{
  description = "Bun + Svelte project for Cloudflare Pages";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Runtime & package manager
            bun

            # Node.js (sometimes needed for tooling compatibility)
            nodejs_20

            # Cloudflare tooling
            nodePackages.wrangler

            # Formatting & linting
            nodePackages.prettier
            nodePackages.eslint
            nodePackages.typescript-language-server
            svelte-language-server

            # Optional but useful
            git
          ];

          shellHook = ''
            echo "Bun + Svelte dev environment loaded"
            echo "Bun version: $(bun --version)"
            echo ""
            echo "Commands:"
            echo "  bun install     - Install dependencies"
            echo "  bun run dev     - Start dev server"
            echo "  bun run build   - Build for production"
            echo "  bun run check   - Run svelte-check"
            echo "  bun run format  - Format with Prettier"
            echo "  bun run lint    - Lint with ESLint"
            echo "  wrangler pages deploy dist  - Deploy to Cloudflare Pages"
          '';
        };
      }
    );
}
