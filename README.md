# Cursorforge

WIP

## Getting Started

### Prerequisites

- Node.js >= 24.0.0
- pnpm (recommended package manager)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd cursorforge

# Install dependencies
pnpm install
```

### Development

```bash
# Start all applications in development mode
pnpm dev

# Start specific applications
pnpm dev:web    # Web application only
pnpm dev:native # Native application only
pnpm dev:server # Server application only
```

## Project Structure

```
cursorforge/
├── apps/
│   └── cli/                    # Command-line interface
│       ├── src/
│       │   └── index.ts       # CLI entry point
│       └── package.json
├── packages/
│   ├── core/                   # Core functionality
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   └── package.json
│   ├── generator/              # Code generation utilities
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── generator.ts
│   │   └── package.json
│   ├── tui/                    # Terminal UI components
│   │   ├── src/
│   │   │   ├── index.tsx
│   │   │   └── app.tsx
│   │   └── package.json
│   ├── utils/                  # Shared utilities
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── helpers.ts
│   │   │   └── constants.ts
│   │   └── package.json
│   └── typescript-config/      # Shared TypeScript config
│       ├── base.json
│       └── package.json
├── biome.json                  # Biome configuration
├── turbo.json                  # Turborepo configuration
├── pnpm-workspace.yaml         # PNPM workspace configuration
└── package.json               # Root package configuration
```

## Available Scripts

### Root Scripts

- `pnpm dev` - Start all applications in development mode
- `pnpm build` - Build all applications and packages
- `pnpm check-types` - Type-check all TypeScript files
- `pnpm lint` - Run linting across all packages
- `pnpm format` - Format code using Biome
- `pnpm check` - Run Biome check with auto-fix
- `pnpm upgrade:deps` - Upgrade dependencies across workspace

### Package-Specific Scripts

Each package includes:

- `check-types` - TypeScript type checking
- `format` - Code formatting
- `lint` - Code linting

## Development Tools

- **Turborepo** - Monorepo build system for optimized development and builds
- **Biome** - Fast linting and formatting
- **TypeScript** - Type safety and modern JavaScript features
- **Husky** - Git hooks for code quality enforcement
- **lint-staged** - Run linters on staged files

## License

MIT
