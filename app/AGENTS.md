# Agent Instructions

## ⚠️ REQUIRED: Read Before Starting

**You MUST read `architectural-designs.md` before making any code changes.**

This file contains critical architectural patterns, conventions, and guidelines specific to this project.

## Quick Reference

- **Framework:** Svelte 5 + TypeScript
- **Build Tool:** Vite
- **Package Manager:** Bun
- **Architecture:** Component-based SPA with static site deployment

## Pre-Task Checklist

1. ✅ Read `architectural-designs.md` completely
2. ✅ Understand the component structure in `src/lib/`
3. ✅ Review existing components for patterns to follow
4. ✅ Check the Agent Checklist at the end of architectural-designs.md

## Post-Task Checklist

1. ✅ Run `bun run build` - must complete without errors
2. ✅ Verify no TypeScript errors
3. ✅ Follow the Agent Checklist in architectural-designs.md

## Key Reminders

- Use Svelte 5 runes (`$state`, `$derived`, `$effect`)
- Environment variables must use `VITE_` prefix
- Components go in `src/lib/`
- Run build before committing changes
- **Implement skeuomorphic design patterns** (see architectural-designs.md for details)

## Project Structure Note

**Important:** This application is located in the `app/` subdirectory. Nix configuration files (`flake.nix`, `flake.lock`) are located in the **parent directory** (one level up). When running nix commands, you may need to reference files from the parent directory.

---

**When in doubt, refer to `architectural-designs.md`**
