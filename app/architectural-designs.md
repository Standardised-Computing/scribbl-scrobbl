# Architectural Designs

## Overview

This is a **minimal Svelte 5 + TypeScript + Vite** application designed for simplicity and performance. It follows modern frontend best practices with a clear migration path to SvelteKit if the application grows.

---

## Architectural Patterns

### 1. Component-Based Architecture

**Pattern:** UI is built from reusable, self-contained components

**Implementation:**
- `App.svelte` - Root application component
- `src/lib/*.svelte` - Reusable component library
- Each component contains markup, logic, and scoped styles

**Why Used:**
- Encapsulation of concerns
- Component reusability across the app
- Easier testing and maintenance
- Clear boundaries between UI elements

**For Agents:**
- Create new components in `src/lib/` for reusability
- Keep components focused on a single responsibility
- Use props for data passing, events for communication upward

---

### 2. Single Page Application (SPA)

**Pattern:** Single HTML entry point with client-side JavaScript rendering

**Implementation:**
- `index.html` - Static entry point
- `main.ts` - Application bootstrap
- Client-side routing (if needed, use `svelte-routing`)

**Why Used:**
- Fast navigation without page reloads
- Reduced server load (static files only)
- App-like user experience
- Simple deployment to CDN/edge networks

**For Agents:**
- Do not create multiple HTML files
- Handle navigation via JavaScript, not page reloads
- Consider lazy loading for large route components

---

### 3. TypeScript Project References

**Pattern:** Split TypeScript configuration into referenced projects

**Implementation:**
```
tsconfig.json          # Root config (references only)
tsconfig.app.json      # Application code
tsconfig.node.json     # Build tooling (Vite config)
```

**Why Used:**
- Faster incremental compilation
- Better IDE performance
- Clear separation between app code and tooling

**For Agents:**
- Add new source files to `tsconfig.app.json` include paths
- Keep Vite/tooling changes in `tsconfig.node.json`
- Maintain strict type checking settings

---

### 4. Static Site Architecture

**Pattern:** Pre-built static files deployed to edge CDN

**Implementation:**
- Build output to `dist/` directory
- `wrangler.toml` - Cloudflare Pages configuration
- No server-side runtime required

**Why Used:**
- Fast global distribution via CDN
- Cost-effective hosting
- Excellent scalability
- No server maintenance

**For Agents:**
- Prefer static generation over dynamic server rendering
- Use environment variables for configuration (prefix with `VITE_`)
- Test build with `npm run build` before committing

---

## Design Patterns

### 1. Composition Pattern

**Pattern:** Build complex UIs by composing simpler components

**Example:**
```svelte
<!-- App.svelte -->
<div class="card">
  <Counter />
</div>
```

**For Agents:**
- Favor composition over inheritance
- Create small, focused components that can be combined
- Use slots for flexible component content

---

### 2. Reactive State Management (Observer Pattern)

**Pattern:** Automatic UI updates when state changes

**Implementation:**
```svelte
<script>
  let count: number = $state(0)
  
  function increment() {
    count += 1  // UI updates automatically
  }
</script>
```

**For Agents:**
- Use `$state()` for reactive component state
- Use `$derived()` for computed values
- Use `$effect()` for side effects
- Avoid manual DOM manipulation

---

### 3. Module Pattern

**Pattern:** ES6 modules with clear import/export boundaries

**Implementation:**
- All code uses ES modules (`"type": "module"` in package.json)
- Named exports preferred for clarity

**For Agents:**
- Always use explicit imports/exports
- Avoid default exports unless necessary
- Group related functionality in cohesive modules

---

### 4. Factory Pattern

**Pattern:** Centralized component instantiation

**Implementation:**
```typescript
// main.ts
const app = mount(App, {
  target: document.getElementById('app')!,
})
```

**For Agents:**
- Use Svelte's `mount()` for component instantiation
- Handle cleanup with `unmount()` when components are destroyed

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Svelte | 5.x | Reactive UI framework |
| TypeScript | 5.x | Static typing |
| Vite | 7.x | Build tool and dev server |
| Bun | latest | Package manager and runtime |
| Cloudflare Pages | - | Deployment platform |

---

## File Structure Conventions

```
src/
├── main.ts              # Application entry point
├── App.svelte           # Root component
├── app.css              # Global styles
├── lib/                 # Reusable components
│   └── *.svelte         # Component library
├── stores/              # (if needed) Global state
├── utils/               # (if needed) Helper functions
└── types/               # (if needed) TypeScript definitions

public/                  # Static assets (copied as-is)
dist/                    # Build output (gitignored)
```

**For Agents:**
- Place reusable components in `src/lib/`
- Add global utilities in `src/` subdirectories
- Keep `public/` for files that don't need processing
- Never commit `dist/` directory

---

## Coding Conventions

### Svelte Components

```svelte
<script lang="ts">
  // Props first (if any)
  interface Props {
    title: string
  }
  let { title }: Props = $props()
  
  // Reactive state
  let count: number = $state(0)
  
  // Derived values
  let doubled = $derived(count * 2)
  
  // Effects
  $effect(() => {
    console.log('Count changed:', count)
  })
  
  // Event handlers
  function handleClick() {
    count += 1
  }
</script>

<template>
  <button onclick={handleClick}>
    {title}: {count}
  </button>
</template>

<style>
  button {
    /* Component-scoped styles */
  }
</style>
```

**For Agents:**
- Always use TypeScript (`lang="ts"`)
- Use runes (`$state`, `$derived`, `$effect`) over old Svelte 4 syntax
- Keep templates declarative
- Use component-scoped styles

---

### TypeScript Guidelines

- Enable strict mode (already configured)
- Use explicit types for function parameters and return values
- Define interfaces for complex data structures
- Avoid `any` type

---

### Environment Variables

- Prefix all environment variables with `VITE_`
- Access via `import.meta.env.VITE_VARIABLE_NAME`

**For Agents:**
```typescript
// Good
const apiUrl = import.meta.env.VITE_API_URL

// Bad - won't work
const secret = process.env.API_KEY
```

---

## Build & Development Commands

| Command | Description |
|---------|-------------|
| `bun install` | Install dependencies |
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build |

**For Agents:**
- Always run `bun run build` before committing changes
- Verify no TypeScript errors or build warnings
- Test in preview mode for production-like behavior

---

## Common Tasks for Agents

### Adding a New Component

1. Create file in `src/lib/MyComponent.svelte`
2. Use TypeScript and proper typing
3. Import and use in parent component
4. Run build to verify

### Adding Global State

1. Create store in `src/stores/myStore.ts`
2. Use Svelte's `writable()` or `readable()`
3. Import and subscribe in components
4. Document the store's interface

### Adding a Route

1. Install `svelte-routing` (if not present)
2. Create route component in appropriate directory
3. Add route definition in `App.svelte`
4. Consider code splitting for large routes

### Adding an API Integration

1. Create service file (e.g., `src/lib/api.ts`)
2. Use native `fetch()` or library of choice
3. Type all API responses
4. Handle errors gracefully
5. Consider loading states in UI

---

## Migration Considerations

This template is designed to be simple but can grow:

**Current → Medium Scale:**
- Add `src/stores/` for global state
- Add `src/services/` for API calls
- Add routing library

**Medium → Large Scale:**
- Migrate to SvelteKit for:
  - Server-side rendering
  - File-based routing
  - API routes
  - Advanced data loading

**For Agents:**
- When adding complexity, consider if migration to SvelteKit is warranted
- Discuss with user before making architectural changes
- Maintain backward compatibility during transitions

---

## Performance Guidelines

1. **Bundle Size:** Keep an eye on imported libraries
2. **Lazy Loading:** Use dynamic imports for large components
3. **Images:** Use appropriate formats and sizes
4. **Reactivity:** Avoid unnecessary `$effect` dependencies
5. **Memory:** Clean up subscriptions and effects on unmount

**For Agents:**
- Check bundle size impact before adding dependencies
- Use dynamic imports: `const Module = await import('./heavy.js')`
- Always test performance in production build

---

## Testing (When Implemented)

Recommended tools:
- **Vitest** - Vite-native test runner
- **Playwright** - End-to-end testing
- **Testing Library** - Component testing

**For Agents:**
- Write unit tests for utility functions
- Write component tests for reusable components
- Add e2e tests for critical user flows

---

## Key Decisions & Rationale

| Decision | Reason |
|----------|--------|
| Svelte 5 over React/Vue | Smaller bundles, compiled reactivity, no virtual DOM overhead |
| Vite over Webpack | Faster dev server, native ESM, better HMR |
| TypeScript | Type safety, better IDE support, easier refactoring |
| Minimal template over SvelteKit | Simplicity, no imposed routing, easier to understand |
| Bun over npm/yarn | Faster package installation, modern JavaScript runtime |
| Cloudflare Pages | Edge deployment, global CDN, cost-effective scaling |

---

## Agent Checklist

Before completing any task:

- [ ] Does the code follow TypeScript strict mode?
- [ ] Are components using Svelte 5 runes properly?
- [ ] Is the build successful (`bun run build`)?
- [ ] Are styles scoped to components (not global unless intended)?
- [ ] Is error handling implemented for async operations?
- [ ] Are environment variables properly prefixed with `VITE_`?
- [ ] Is the code properly formatted and organized?
- [ ] **Are skeuomorphic design patterns implemented?**

---

## Design System: Skeuomorphic Patterns

**All UI components must implement skeuomorphic design patterns** - creating visual elements that resemble their real-world physical counterparts.

### What is Skeuomorphism?

Skeuomorphism designs UI elements to look like physical objects from the real world. This creates intuitive, familiar interfaces that users immediately understand.

### Implementation Guidelines

**For Buttons:**
- Use gradients to create 3D depth (lighter top, darker bottom)
- Add subtle shadows for elevation
- Include beveled or rounded edges like physical buttons
- Use textures where appropriate (brushed metal, fabric, etc.)

**Example:**
```svelte
<style>
  .skeuomorphic-button {
    /* 3D depth with gradient */
    background: linear-gradient(to bottom, #f0f0f0, #c0c0c0);
    /* Physical button shadow */
    box-shadow: 
      0 4px 6px rgba(0,0,0,0.3),
      inset 0 1px 0 rgba(255,255,255,0.5);
    /* Rounded like physical buttons */
    border-radius: 8px;
    border: 1px solid #999;
    /* Pressed state */
    &:active {
      background: linear-gradient(to bottom, #c0c0c0, #a0a0a0);
      box-shadow: 
        0 2px 3px rgba(0,0,0,0.3),
        inset 0 2px 4px rgba(0,0,0,0.2);
      transform: translateY(2px);
    }
  }
</style>
```

**For Cards/Containers:**
- Paper-like shadows with multiple layers
- Subtle gradients for depth
- Border treatments that suggest physical materials
- Inner shadows for inset areas

**For Form Inputs:**
- Inset shadows suggesting carved or pressed areas
- Borders that look like physical edges
- Focus states that resemble illumination or highlighting

**For Interactive Elements:**
- Hover states that suggest physical interaction (lift, glow, highlight)
- Active/pressed states showing compression
- Disabled states that look faded or "locked"

### Color Palette

- **Primary surfaces:** Light gradients (suggesting illuminated surfaces)
- **Shadows:** Multiple layered shadows for depth
- **Highlights:** Subtle white/bright overlays on top edges
- **Text:** Dark enough for contrast but integrated into the 3D aesthetic

### Typography

- Use fonts that complement the physical aesthetic
- Consider slightly embossed or inset text effects
- Shadow effects for raised text appearance

### Why Skeuomorphism?

- **Intuitive:** Users instantly recognize interactive elements
- **Tactile:** Creates sense of physical interaction
- **Engaging:** More visually interesting than flat design
- **Accessible:** Clear affordances for interactive elements

**For Agents:**
- Every interactive element should look like a real-world object
- Use gradients, shadows, and borders to create depth
- Think "what would this look like if it were a physical object?"
- Reference physical materials (buttons, paper, metal, leather, etc.)
- Test at different sizes - skeuomorphic elements should work at all scales

---

## Resources

- [Svelte 5 Documentation](https://svelte.dev/docs/svelte)
- [Svelte 5 Runes](https://svelte.dev/docs/svelte/what-are-runes)
- [Vite Guide](https://vitejs.dev/guide/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
