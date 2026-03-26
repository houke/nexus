const fs = require('fs');
const path = require('path');

const WORKFLOW_DEFINITIONS = {
  init: { slug: 'nexus-init', label: 'init' },
  planning: { slug: 'nexus-planning', label: 'planning' },
  execution: { slug: 'nexus-execution', label: 'execution' },
  review: { slug: 'nexus-review', label: 'review' },
  summary: { slug: 'nexus-summary', label: 'summary' },
  sync: { slug: 'nexus-sync', label: 'sync' },
  hotfix: { slug: 'nexus-hotfix', label: 'hotfix' },
};

const WORKFLOW_ALIASES = {
  init: 'init',
  initialize: 'init',
  plan: 'planning',
  planning: 'planning',
  execute: 'execution',
  execution: 'execution',
  exec: 'execution',
  review: 'review',
  summary: 'summary',
  summarize: 'summary',
  sync: 'sync',
  reconcile: 'sync',
  hotfix: 'hotfix',
  fix: 'hotfix',
};

const TOOL_EXPLANATIONS = {
  vscode:
    'Editor-integrated affordances such as asking follow-up questions, surfacing files, or invoking editor commands. In a generic CLI agent, this usually maps to plain terminal prompts and local file paths.',
  execute:
    'Shell command execution. The runtime must be able to run non-interactive commands and preserve working-directory context.',
  read: 'File reads. The runtime should be able to inspect prompt files, plans, templates, logs, and source code.',
  edit: 'File creation and patch-style edits. The runtime should support safe, explicit code modifications instead of opaque regeneration.',
  search:
    'Fast file and text search, ideally with ripgrep or equivalent, to discover plans, prompts, agents, and implementation files.',
  web: 'Optional web fetch capability for documentation or external references used during planning, review, or research.',
  agent:
    'Subagent delegation. If the CLI framework supports multiple agents, map this directly. If not, emulate delegation by running the same workflow in staged persona-specific passes.',
  'filesystem/*':
    'Structured file-system operations such as listing, creating, moving, and reading multiple files. Useful for templates, feature folders, and generated docs.',
  'sequential-thinking/*':
    'Explicit stepwise reasoning or planning scratchpad support. Helpful for orchestration and review workflows with multiple decision points.',
  'playwright/*':
    'Browser automation for E2E verification, UI inspection, and reproduction of user-facing issues.',
  todo: 'Task-plan tracking for multi-step orchestration. A simple todo list or plan file is sufficient if the runtime lacks a dedicated planner.',
};

function findRepoRoot(startDir) {
  let currentDir = path.resolve(startDir);

  while (true) {
    const promptsDir = path.join(currentDir, '.github', 'prompts');
    if (fs.existsSync(promptsDir)) {
      return currentDir;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }
    currentDir = parentDir;
  }

  return path.resolve(__dirname, '..');
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    return { attributes: {}, body: markdown };
  }

  const frontmatter = match[1];
  const body = match[2];
  const attributes = {};

  for (const field of ['name', 'description', 'agent', 'model']) {
    const fieldMatch = frontmatter.match(
      new RegExp(`^${field}:\\s*(.+)$`, 'm'),
    );
    if (fieldMatch) {
      attributes[field] = fieldMatch[1].trim().replace(/^['\"]|['\"]$/g, '');
    }
  }

  const toolsMatch = frontmatter.match(/tools:\s*\[([\s\S]*?)\]/m);
  attributes.tools = toolsMatch
    ? toolsMatch[1]
        .split(',')
        .map((value) => value.trim().replace(/^['\"]|['\"]$/g, ''))
        .filter(Boolean)
    : [];

  return { attributes, body };
}

function resolveWorkflow(name) {
  const normalized = WORKFLOW_ALIASES[name];
  if (!normalized) {
    return null;
  }

  return WORKFLOW_DEFINITIONS[normalized];
}

function listWorkflows() {
  return Object.values(WORKFLOW_DEFINITIONS).map((workflow) => workflow.label);
}

function loadWorkflowPrompt(repoRoot, workflowName) {
  const workflow = resolveWorkflow(workflowName);
  if (!workflow) {
    return null;
  }

  const promptPath = path.join(
    repoRoot,
    '.github',
    'prompts',
    `${workflow.slug}.prompt.md`,
  );
  const content = fs.readFileSync(promptPath, 'utf8');
  const parsed = parseFrontmatter(content);

  return {
    workflow,
    promptPath,
    raw: content,
    ...parsed,
  };
}

function formatToolGuide(tools) {
  const uniqueTools = [...new Set(tools)];
  if (uniqueTools.length === 0) {
    return 'No tool metadata declared.';
  }

  return uniqueTools
    .map((tool) => {
      const explanation =
        TOOL_EXPLANATIONS[tool] || 'No mapping documented yet.';
      return `- ${tool}: ${explanation}`;
    })
    .join('\n');
}

function renderWorkflowBrief(loadedPrompt, userRequest) {
  const requestBlock = userRequest
    ? `\n## Requested User Context\n\n${userRequest.trim()}\n`
    : '';

  return [
    `# Nexus CLI Workflow: ${loadedPrompt.workflow.label}`,
    '',
    `Source prompt: ${loadedPrompt.promptPath}`,
    `Agent: ${loadedPrompt.attributes.agent || 'Nexus'}`,
    `Model: ${loadedPrompt.attributes.model || 'Unspecified'}`,
    `Description: ${loadedPrompt.attributes.description || 'No description provided.'}`,
    '',
    '## Runtime Capability Contract',
    '',
    formatToolGuide(loadedPrompt.attributes.tools),
    '',
    '## Prompt',
    '',
    loadedPrompt.raw.trim(),
    requestBlock.trimEnd(),
  ]
    .filter(Boolean)
    .join('\n');
}

function printHelp(stdout) {
  stdout.write(`Nexus CLI\n\n`);
  stdout.write(`Usage:\n`);
  stdout.write(`  ./nexus list\n`);
  stdout.write(`  ./nexus tools [workflow]\n`);
  stdout.write(`  ./nexus doctor\n`);
  stdout.write(`  ./nexus <workflow> [request...]\n\n`);
  stdout.write(`Workflows:\n`);
  stdout.write(`  ${listWorkflows().join(', ')}\n\n`);
  stdout.write(`Examples:\n`);
  stdout.write(`  ./nexus planning "Plan an offline-first kanban app"\n`);
  stdout.write(`  ./nexus execution user-auth\n`);
  stdout.write(`  ./nexus tools review\n`);
}

function runCli(argv, io) {
  const { cwd, stdout, stderr } = io;
  const repoRoot = findRepoRoot(cwd);
  const [command, ...rest] = argv;

  if (
    !command ||
    command === 'help' ||
    command === '--help' ||
    command === '-h'
  ) {
    printHelp(stdout);
    return 0;
  }

  if (command === 'list') {
    stdout.write(`${listWorkflows().join('\n')}\n`);
    return 0;
  }

  if (command === 'doctor') {
    const promptsDir = path.join(repoRoot, '.github', 'prompts');
    const hasPrompts = fs.existsSync(promptsDir);
    const hasAgents = fs.existsSync(
      path.join(repoRoot, 'plugins', 'nexus', 'agents'),
    );
    const hasNexus = fs.existsSync(path.join(repoRoot, '.nexus'));
    const hasMarketplace = fs.existsSync(
      path.join(repoRoot, '.github', 'plugin', 'marketplace.json'),
    );

    stdout.write(`Repo root: ${repoRoot}\n`);
    stdout.write(`Prompts: ${hasPrompts ? 'ok' : 'missing'}\n`);
    stdout.write(`Agents: ${hasAgents ? 'ok' : 'missing'}\n`);
    stdout.write(`.nexus: ${hasNexus ? 'ok' : 'missing'}\n`);
    stdout.write(`Marketplace: ${hasMarketplace ? 'ok' : 'missing'}\n`);
    stdout.write(
      `.nexusrc in cwd: ${fs.existsSync(path.join(cwd, '.nexusrc')) ? 'present' : 'missing'}\n`,
    );
    return hasPrompts && hasAgents ? 0 : 1;
  }

  if (command === 'tools') {
    const workflowName = rest[0];
    if (!workflowName) {
      stdout.write(`${formatToolGuide(Object.keys(TOOL_EXPLANATIONS))}\n`);
      return 0;
    }

    const loadedPrompt = loadWorkflowPrompt(repoRoot, workflowName);
    if (!loadedPrompt) {
      stderr.write(`Unknown workflow: ${workflowName}\n`);
      return 1;
    }

    stdout.write(`${formatToolGuide(loadedPrompt.attributes.tools)}\n`);
    return 0;
  }

  const loadedPrompt = loadWorkflowPrompt(repoRoot, command);
  if (!loadedPrompt) {
    stderr.write(`Unknown command: ${command}\n\n`);
    printHelp(stderr);
    return 1;
  }

  stdout.write(`${renderWorkflowBrief(loadedPrompt, rest.join(' '))}\n`);
  return 0;
}

module.exports = {
  TOOL_EXPLANATIONS,
  WORKFLOW_DEFINITIONS,
  findRepoRoot,
  formatToolGuide,
  listWorkflows,
  loadWorkflowPrompt,
  parseFrontmatter,
  renderWorkflowBrief,
  resolveWorkflow,
  runCli,
};
