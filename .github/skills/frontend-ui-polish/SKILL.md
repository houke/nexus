---
name: frontend-ui-polish
description: Expertise in UI/UX excellence, custom animations, transitions, and "the juice" that makes interfaces feel premium. Use when styling components, adding motion, or refining visual hierarchy.
---

# Frontend UI Polish Skill

Apply high-end visual aesthetics and smooth interactions to the application interface.

## Core Pillars

1. **"The Juice"**: Micro-interactions, tactile feedback, and subtle animations.
2. **Visual Hierarchy**: Guiding user focus through contrast, spacing, and typography.
3. **Motion Physics**: Using `cubic-bezier` timings and GPU-accelerated transforms.
4. **Design System Adherence**: Strict use of project-defined design tokens and CSS variables.
5. **Responsive Excellence**: Beyond "working" on mobile—making it feel native and fluid.

## Principles

- **Avoid Generic**: Don't use default browser styles; everything should be curated.
- **Micro-animations**: Button presses should scale slightly, hover states should be smooth.
- **Glassmorphism**: Use translucent backgrounds and blurs where it adds depth.
- **Feedback**: Every interaction must have a visual or motion response.

## Animation Checklist

- [ ] Uses CSS `transform` (scale, translate, rotate) or `opacity`.
- [ ] Avoids animating layout properties (`width`, `height`, `top`, `left`, `margin`).
- [ ] Uses `ease-out` for entering and `ease-in` for exiting.
- [ ] Timing is fast: 150ms-300ms for most UI interactions.
- [ ] Respects `prefers-reduced-motion`.

## Design Tokens

> [!TIP]
> Use standard timings and easings from [animation-constants.ts](./animation-constants.ts).

Always prefer CSS variables defined in the central theme:

```css
/* Examples */
color: var(--color-primary);
background: var(--glass-bg);
backdrop-filter: blur(var(--blur-radius));
transition: all var(--transition-bounce);
```

## Interactive Patterns

```javascript
// Example: Bouncy click effect
const handleClick = () => {
  // 1. Visual feedback
  // 2. Audio feedback (Haptic if supported)
  // 3. Action execution
};
```

## Mandatory Verification

> [!IMPORTANT]
> After styling or adding animations:
>
> 1. Verify 60fps performance in DevTools.
> 2. Test responsiveness across mobile, tablet, and desktop.
> 3. Ensure contrast ratios meet WCAG AA.
> 4. Fix ALL unrelated lint or type errors in the modified files.
