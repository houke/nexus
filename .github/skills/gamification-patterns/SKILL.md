---
name: gamification-patterns
description: Implement gamification mechanics including achievements, streaks, XP, and rewards. Use when adding game elements, designing progression systems, or creating engagement features.
---

# Gamification Patterns Skill

Implement engaging gamification mechanics for Terra Quest.

## Core Mechanics

### 1. XP & Leveling
```typescript
interface XPSystem {
  currentXP: number;
  level: number;
  xpToNextLevel: number;
}

// XP curve: Exponential growth
function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}
```

### 2. Achievement System
```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress?: number;  // 0-100 for progressive achievements
}

// Achievement types
type AchievementTrigger = 
  | 'first_action'      // First time doing something
  | 'streak'            // N days in a row
  | 'cumulative'        // Total count reaches N
  | 'single_session'    // Do X in one session
  | 'discovery';        // Find something hidden
```

### 3. Streak System
```typescript
interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
}

// Grace period: Allow 1 day miss before breaking streak
const GRACE_HOURS = 36;
```

### 4. Rewards & Loot
- **Variable Ratio**: Random rewards are more engaging than predictable ones
- **Near Misses**: Show "almost got it" to encourage retry
- **Social Proof**: "X players unlocked this today"

## Juice Guidelines

Every achievement unlock should:
1. Play a satisfying sound effect
2. Show particle effects / confetti
3. Display a toast notification
4. Optionally pause gameplay momentarily for emphasis

```typescript
async function celebrateAchievement(achievement: Achievement) {
  await Promise.all([
    playSound('achievement-unlock'),
    showConfetti(achievement.rarity),
    showToast({
      title: 'Achievement Unlocked!',
      description: achievement.name,
      icon: achievement.icon,
      duration: 3000,
    }),
  ]);
}
```

## Progression Visibility

- Always show progress bars
- Animate XP gains (count up animation)
- Show "next milestone" clearly
- Celebrate level-ups prominently

## After Implementation

> [!IMPORTANT]
> After implementing gamification features:
> 1. Run all tests: `pnpm test`
> 2. Test the "game feel" manually
> 3. Verify animations are smooth (60fps)
> 4. Test edge cases (max level, 0 XP, streak reset)
> 5. Fix ALL errors and warnings
