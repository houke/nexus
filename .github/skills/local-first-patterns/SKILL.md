---
name: local-first-patterns
description: Implement local-first architecture patterns with OPFS, SQLite, and sync strategies. Use when working with offline storage, data persistence, or sync logic.
---

# Local-First Patterns Skill

Implement local-first architecture using OPFS and SQLite.

## Core Principles

1. **Offline First**: App must work without network
2. **Sync Later**: Changes queue and sync when online
3. **User Owns Data**: Data stored locally, export always available
4. **Conflict Resolution**: Last-write-wins or user-prompted merge

## Technology Stack

| Layer    | Technology                        |
| -------- | --------------------------------- |
| Storage  | OPFS (Origin Private File System) |
| Database | SQLite (via sql.js or wa-sqlite)  |
| ORM      | Drizzle ORM                       |
| Sync     | Custom sync protocol              |

## OPFS Access Pattern

```typescript
// Get OPFS directory
const root = await navigator.storage.getDirectory();
const fileHandle = await root.getFileHandle('database.sqlite', {
  create: true,
});

// For better performance, use sync access handle in a worker
const accessHandle = await fileHandle.createSyncAccessHandle();
```

## Offline-First Data Flow

```
User Action
    ↓
Local SQLite Write
    ↓
Queue Change for Sync
    ↓
[When Online] Push to Server
    ↓
Receive Server Changes
    ↓
Merge & Conflict Resolution
```

## Best Practices

1. **Optimistic Updates**: Show changes immediately, sync in background
2. **Idempotent Operations**: Same operation can be applied multiple times safely
3. **Timestamps**: Use server-generated timestamps for ordering
4. **Chunked Sync**: Sync large datasets in batches

## Export/Import

Always provide data portability:

```typescript
// Export database file
async function exportDatabase(): Promise<Blob> {
  const file = await fileHandle.getFile();
  return file;
}

// Import database file
async function importDatabase(blob: Blob): Promise<void> {
  const writable = await fileHandle.createWritable();
  await writable.write(blob);
  await writable.close();
}
```

## After Implementation

> [!IMPORTANT]
> After implementing local-first features:
>
> 1. Test offline functionality (DevTools → Network → Offline)
> 2. Run all tests: `npm run test`
> 3. Verify data persists across page reloads
> 4. Test export/import roundtrip
> 5. Fix ALL errors and warnings
