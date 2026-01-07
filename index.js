#!/usr/bin/env node

import { execa } from "execa";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";

// --- MODULE IMPORTS ---
import { runMerger } from "./omnimerge.js";
import { runFabricator } from "./omnifabricator.js";

// --- CONFIGURATION ---
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VERSION = "5.10.0-pure-installer";

// --- [SECURITY] DEPENDENCY MANIFEST (VERSION LOCKING) ---
const DEPENDENCY_MANIFEST = {
  // Foundation
  vite: "^5.0.0",
  react: "^18.2.0",
  "react-dom": "^18.2.0",

  // Styling
  tailwindcss: "^3.4.1",
  postcss: "^8.4.35",
  autoprefixer: "^10.4.17",
  "class-variance-authority": "^0.7.0",
  clsx: "^2.1.0",
  "tailwind-merge": "^2.2.1",
  "lucide-react": "^0.344.0",
  sonner: "^1.4.3",

  // Logic
  axios: "^1.6.7",
  zustand: "^4.5.1",
  "@tanstack/react-query": "^5.24.1",
  "date-fns": "^3.3.1",

  // Routing & Safety
  "react-router-dom": "^6.22.2",
  "react-error-boundary": "^4.0.12",
  "react-helmet-async": "^2.0.4",

  // Dev Tools
  vitest: "^1.3.1",
  jsdom: "^24.0.0",
  "@testing-library/react": "^14.2.1",
  "@testing-library/jest-dom": "^6.4.2",
  prettier: "^3.2.5",
  "eslint-config-prettier": "^9.1.0",
  "eslint-plugin-prettier": "^5.1.3",
};

// --- [THEME] DAYLIGHT HACKER PALETTE ---
const theme = {
  primary: chalk.hex("#0055FF").bold, // Electric Blue
  secondary: chalk.hex("#7928CA").bold, // Deep Purple
  success: chalk.hex("#008F11").bold, // Matrix Green
  warning: chalk.hex("#FFA500").bold, // Orange for 90% state
  danger: chalk.hex("#D00000").bold, // Blood Red
  text: chalk.hex("#111111"), // Almost Black
  muted: chalk.hex("#888888"), // Grey
  accent: chalk.cyan, // Cyan Text
  tag: chalk.bgCyan.black.bold,
};

const GRID_LABEL_WIDTH = 24;

// --- UTILITIES ---

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const clearScreen = () => {
  process.stdout.write("\x1B[2J\x1B[0f");
};

const formatLine = (key, val) => {
  const displayVal = val || theme.muted("[ .empty ]");
  return `   ${theme.muted(key.padEnd(GRID_LABEL_WIDTH))} ${theme.muted(
    "│"
  )} ${displayVal}`;
};

const askInline = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);

  return new Promise((resolve) => {
    const cleanQuery = query.replace(/:\s*$/, "").trim();
    const PADDED_LABEL_WIDTH = GRID_LABEL_WIDTH - 2;
    const labelText = ` ${cleanQuery}`;
    const paddedLabel = labelText.padEnd(PADDED_LABEL_WIDTH);

    const prompt = `   ${theme.primary(".")} ${theme.tag(
      paddedLabel
    )} ${theme.muted("│")} `;

    const keyHandler = (str, key) => {
      if (key.name === "escape") {
        process.stdout.write("\n");
        console.log("");
        console.log(theme.primary("   >> SESSION_TERMINATED"));
        process.exit(0);
      }
    };
    process.stdin.on("keypress", keyHandler);

    rl.question(prompt, (ans) => {
      process.stdin.removeListener("keypress", keyHandler);
      if (process.stdin.isTTY) process.stdin.setRawMode(false);
      rl.close();
      resolve(ans);
    });
  });
};

const printHeader = async (protocolName, meta = {}) => {
  clearScreen();
  console.log(formatLine("SYSTEM_TIME", new Date().toLocaleTimeString()));
  console.log(formatLine("PROTOCOL", protocolName));

  Object.keys(meta).forEach((k) => {
    console.log(formatLine(k.toUpperCase(), meta[k]));
  });

  console.log(theme.muted("   ────────────────────────────────────────"));
  console.log("");
};

const execTask = async (
  taskName,
  commandOrFn,
  args = [],
  cwd = process.cwd()
) => {
  const CAT_WIDTH = GRID_LABEL_WIDTH - 3;
  const DET_WIDTH = 25;
  const BAR_WIDTH = 20;

  let pct = 0;
  let spinnerIdx = 0;
  const spinners = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

  const [rawCat, rawDet] = taskName.includes(":")
    ? taskName.split(":")
    : [taskName, ""];
  const category = rawCat.trim();
  const detail = rawDet.trim();

  const drawLabel = () => {
    return `${category.padEnd(CAT_WIDTH)} ${theme.muted("│")} ${detail.padEnd(
      DET_WIDTH
    )}`;
  };

  process.stdout.write("\x1B[?25l");

  const emptyBar = theme.muted("-".repeat(BAR_WIDTH));

  process.stdout.write(
    `   ${theme.accent(spinners[0])}  ${drawLabel()} [${emptyBar}] 0%`
  );

  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      const increment = Math.random() > 0.5 ? 2 : 1;
      if (pct < 90) pct += increment;

      const filled = Math.floor((pct / 100) * BAR_WIDTH);
      let barColor = theme.primary;
      if (pct >= 90) barColor = theme.warning;

      const bar =
        barColor("/".repeat(filled)) +
        theme.muted("-".repeat(BAR_WIDTH - filled));
      const spinner = theme.accent(spinners[spinnerIdx++ % spinners.length]);

      process.stdout.write(`\r   ${spinner}  ${drawLabel()} [${bar}] ${pct}%`);
    }, 80);

    const runner =
      typeof commandOrFn === "function"
        ? commandOrFn()
        : execa(commandOrFn, args, { cwd });

    Promise.resolve(runner)
      .then(() => {
        clearInterval(timer);
        process.stdout.write(`\r\x1B[K`);
        console.log(
          `   ${theme.success("+")}  ${drawLabel()} [${theme.success(
            "/".repeat(BAR_WIDTH)
          )}] 100%`
        );
        resolve(true);
      })
      .catch((e) => {
        clearInterval(timer);
        process.stdout.write(`\r\x1B[K`);
        console.log(`   ${theme.danger("x")}  ${drawLabel()} FAILED`);
        reject(e);
      })
      .finally(() => {
        process.stdout.write("\x1B[?25h");
      });
  });
};

const checkRequirements = async () => {
  try {
    await execa("node", ["-v"]);
    await execa("npm", ["-v"]);
  } catch (e) {
    console.log(theme.danger("FATAL: Node/NPM runtime missing."));
    process.exit(1);
  }
};

// --- [MODULE] INSTALLER (FORTRESS EDITION) ---
const runInstaller = async () => {
  await checkRequirements();
  await printHeader("INITIATE_PROJECT", { NAME: "", DIR: "" });

  let projectName = "";
  while (!projectName) {
    projectName = await askInline("PROJECT_NAME: ");
    const isValidName = /^[a-zA-Z][a-zA-Z0-9_-]+$/.test(projectName);
    const isValidLength = projectName.length >= 2;

    if (!projectName || !isValidName || !isValidLength) {
      console.log(
        theme.danger(
          "   ERR: Invalid name. Must start with letter, min 2 chars, alphanumeric only."
        )
      );
      projectName = "";
    }
  }

  const targetDir = path.resolve(process.cwd(), projectName);
  const displayDir = `./${projectName}`;

  await printHeader("INITIATE_PROJECT", { NAME: projectName, DIR: displayDir });
  console.log("");

  if (fs.existsSync(targetDir)) {
    console.log(
      theme.danger(
        `   ERR: Directory '${projectName}' already exists. Aborting to prevent overwrite.`
      )
    );
    process.exit(1);
  }

  // [SAFETY] ROLLBACK PROTOCOL START
  try {
    // 1. SCAFFOLDING
    await execTask(
      "Core: React + Vite",
      "npx",
      ["create-vite@latest", projectName, "--template", "react"],
      process.cwd()
    );

    // [NUCLEAR FIX] FORCE CREATION OF .npmrc BEFORE INSTALLING ANYTHING
    await execTask("Config: Enforce Rules", async () => {
      await fs.ensureDir(targetDir);
      await fs.writeFile(
        path.join(targetDir, ".npmrc"),
        "legacy-peer-deps=true\nengine-strict=false\n"
      );
      // [FIX] 5. Environment Template & Auto .env
      const envContent = `# API URL for production\nVITE_API_URL=https://api.example.com\n\n# Feature Flags\nVITE_ENABLE_ANALYTICS=true\n`;
      await fs.writeFile(path.join(targetDir, ".env.example"), envContent);
      await fs.writeFile(path.join(targetDir, ".env"), envContent); // Auto-create .env for convenience
    });

    // 2. DEPENDENCIES (LOCKED VERSIONS)
    await execTask("Install: Foundation", "npm", ["install"], targetDir);

    // Build locked dependency list
    const depsToInstall = [
      "tailwindcss",
      "postcss",
      "autoprefixer",
      "clsx",
      "tailwind-merge",
      "class-variance-authority",
      "lucide-react",
      "sonner",
      "axios",
      "zustand",
      "@tanstack/react-query",
      "react-hook-form",
      "zod",
      "@hookform/resolvers",
      "react-router-dom",
      "react-error-boundary",
      "react-helmet-async",
      "date-fns",
    ].map((pkg) => `${pkg}@${DEPENDENCY_MANIFEST[pkg] || "latest"}`);

    await execTask(
      "Inject: Power Tools",
      "npm",
      ["install", ...depsToInstall],
      targetDir
    );

    const devDepsToInstall = [
      "vitest",
      "jsdom",
      "@testing-library/react",
      "@testing-library/jest-dom",
      "husky",
      "lint-staged",
      "prettier",
      "eslint-config-prettier",
      "eslint-plugin-prettier",
    ].map((pkg) => `${pkg}@${DEPENDENCY_MANIFEST[pkg] || "latest"}`);

    await execTask(
      "Inject: Dev Guards",
      "npm",
      ["install", "-D", ...devDepsToInstall],
      targetDir
    );

    // 3. CONFIGURATION (TAILWIND, SCRIPTS & SYSTEM)
    await execTask("Config: System", async () => {
      // Tailwind
      await fs.writeFile(
        path.join(targetDir, "tailwind.config.js"),
        `export default { 
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], 
    theme: { extend: {} }, 
    plugins: [] 
  }`
      );
      await fs.writeFile(
        path.join(targetDir, "postcss.config.js"),
        `export default { plugins: { tailwindcss: {}, autoprefixer: {} } }`
      );
      await fs.writeFile(
        path.join(targetDir, "src/index.css"),
        `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n/* Global Reset */\nhtml, body { height: 100%; font-family: sans-serif; }`
      );

      // [FIX] 8. Vite Config with Alias (@ -> ./src)
      await fs.writeFile(
        path.join(targetDir, "vite.config.js"),
        `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});`
      );

      // [FIX] 7. Enhanced Scripts in package.json
      const pkgPath = path.join(targetDir, "package.json");
      const pkg = await fs.readJson(pkgPath);
      pkg.scripts = {
        ...pkg.scripts,
        "lint:fix": "eslint . --ext .js,.jsx --fix",
        format: "prettier --write .",
        test: "vitest",
        "test:coverage": "vitest run --coverage",
        prepare: "husky install",
      };
      await fs.writeJson(pkgPath, pkg, { spaces: 2 });

      // [FIX] 4. Prettier Config
      await fs.writeFile(
        path.join(targetDir, ".prettierrc"),
        `{\n  "semi": true,\n  "singleQuote": true,\n  "tabWidth": 2,\n  "trailingComma": "es5"\n}`
      );
    });

    // 4. ARCHITECTURE (FEATURE-FIRST)
    await execTask("Architecture: Matrix", async () => {
      const dirs = [
        "src/components/ui",
        "src/components/layout",
        "src/features",
        "src/hooks",
        "src/lib",
        "src/pages",
        "src/providers",
        "src/routes",
        "src/store",
        "src/utils",
        "src/types",
      ];
      for (const d of dirs) fs.ensureDirSync(path.join(targetDir, d));

      await fs.writeFile(
        path.join(targetDir, "src/lib/utils.js"),
        `import { clsx } from "clsx";\nimport { twMerge } from "tailwind-merge";\n\nexport function cn(...inputs) { return twMerge(clsx(inputs)); }`
      );

      // [FIX] 6. Component Library - Generate Button with CVA
      await fs.writeFile(
        path.join(targetDir, "src/components/ui/button.jsx"),
        `import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-100/80",
        ghost: "hover:bg-slate-100 hover:text-slate-900",
        link: "text-blue-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };`
      );

      // [FIX] 6. Test Examples - Real test file for Button
      await fs.ensureDir(path.join(targetDir, "src/components/ui/__tests__"));
      await fs.writeFile(
        path.join(targetDir, "src/components/ui/__tests__/button.test.jsx"),
        `import { render, screen } from "@testing-library/react";
import { Button } from "../button";

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it("applies default class", () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-blue-600");
  });
});`
      );

      await fs.writeFile(
        path.join(targetDir, "jsconfig.json"),
        `{\n  "compilerOptions": {\n    "baseUrl": ".",\n    "paths": {\n      "@/*": ["./src/*"]\n    }\n  },\n  "include": ["src"]\n}`
      );
    });

    // 5. SECURITY & UTILITIES GENERATION
    await execTask("Forging: Security Gates", async () => {
      await fs.writeFile(
        path.join(targetDir, "src/lib/axios.js"),
        `import axios from 'axios';\nimport { toast } from 'sonner';\n\n// 1. Create Instance\nexport const api = axios.create({\n  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',\n  headers: { 'Content-Type': 'application/json' },\n});\n\n// 2. Request Interceptor (Inject Token)\napi.interceptors.request.use((config) => {\n  const token = localStorage.getItem('token');\n  if (token) {\n    config.headers.Authorization = \`Bearer \${token}\`;\n  }\n  return config;\n});\n\n// 3. Response Interceptor\napi.interceptors.response.use(\n  (response) => response,\n  (error) => {\n    if (error.response?.status === 401) {\n       toast.error('Session Expired. Please login again.');\n    }\n    return Promise.reject(error);\n  }\n);`
      );

      await fs.writeFile(
        path.join(targetDir, "src/lib/react-query.js"),
        `import { QueryClient } from '@tanstack/react-query';\n\nexport const queryClient = new QueryClient({\n  defaultOptions: {\n    queries: {\n      staleTime: 1000 * 60 * 5,\n      retry: 1,\n      refetchOnWindowFocus: false,\n    },\n  },\n});`
      );

      await fs.writeFile(
        path.join(targetDir, "src/components/ui/error-fallback.jsx"),
        `export const ErrorFallback = ({ error, resetErrorBoundary }) => {\n  return (\n    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-slate-900 p-6">\n      <h2 className="text-3xl font-bold text-red-600 mb-2">Oops! Something went wrong.</h2>\n      <p className="text-slate-500 mb-6 max-w-md text-center">{error.message}</p>\n      <button \n        onClick={resetErrorBoundary}\n        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"\n      >\n        Try Again\n      </button>\n    </div>\n  );\n};`
      );

      await fs.writeFile(
        path.join(targetDir, "src/providers/AppProvider.jsx"),
        `import React from 'react';\nimport { HelmetProvider } from 'react-helmet-async';\nimport { QueryClientProvider } from '@tanstack/react-query';\nimport { ErrorBoundary } from 'react-error-boundary';\nimport { Toaster } from 'sonner';\nimport { queryClient } from '@/lib/react-query';\nimport { ErrorFallback } from '@/components/ui/error-fallback';\n\nexport const AppProvider = ({ children }) => {\n  return (\n    <React.Suspense fallback={<div className="p-4">Loading Application...</div>}>\n      <ErrorBoundary FallbackComponent={ErrorFallback}>\n        <HelmetProvider>\n          <QueryClientProvider client={queryClient}>\n            {children}\n            <Toaster position="top-center" richColors />\n          </QueryClientProvider>\n        </HelmetProvider>\n      </ErrorBoundary>\n    </React.Suspense>\n  );\n};`
      );

      await fs.writeFile(
        path.join(targetDir, "src/App.jsx"),
        `import { AppProvider } from '@/providers/AppProvider';\nimport { Button } from '@/components/ui/button';\n\nfunction Dashboard() {\n  return (\n    <div className=\"flex flex-col items-center justify-center h-screen bg-slate-50\">\n      <h1 className=\"text-4xl font-bold text-blue-700 mb-4\">OmniDev Framework</h1>\n      <p className=\"text-slate-600 mb-8\">The Fortress Edition is Active.</p>\n      <Button onClick={() => alert('Ready!')}>Get Started</Button>\n    </div>\n  );\n}\n\nfunction App() {\n  return (\n    <AppProvider>\n      <Dashboard />\n    </AppProvider>\n  );\n}\n\nexport default App;`
      );
    });

    // 6. DOCKER & DEPLOYMENT
    await execTask("Deploy: Containerization", async () => {
      await fs.writeFile(
        path.join(targetDir, "Dockerfile"),
        `FROM node:18-alpine as builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM nginx:alpine\nCOPY --from=builder /app/dist /usr/share/nginx/html\nEXPOSE 80\nCMD ["nginx", "-g", "daemon off;"]`
      );
      await fs.writeFile(
        path.join(targetDir, ".dockerignore"),
        `node_modules\ndist\n.git\n.env\n.DS_Store`
      );
    });

    // 7. TESTING CONFIG
    await execTask("Config: Vitest", async () => {
      await fs.writeFile(
        path.join(targetDir, "vitest.config.js"),
        `import { defineConfig } from 'vitest/config';\nimport react from '@vitejs/plugin-react';\nimport path from 'path';\n\nexport default defineConfig({\n  plugins: [react()],\n  test: {\n    environment: 'jsdom',\n    globals: true,\n    setupFiles: './src/tests/setup.js',\n    include: ['src/**/*.{test,spec}.{js,jsx}'],\n    alias: { '@': path.resolve(__dirname, './src') },\n  },\n});`
      );
      await fs.ensureDir(path.join(targetDir, "src/tests"));
      await fs.writeFile(
        path.join(targetDir, "src/tests/setup.js"),
        `import '@testing-library/jest-dom';`
      );
    });

    // [FIX] 3. Git Initialization (Last step) (ROBUST FIX)
    await execTask("Version Control: Git Init", async () => {
      try {
        await execa("git", ["init"], { cwd: targetDir });

        if (fs.existsSync(path.join(targetDir, ".git"))) {
          await execa("git", ["add", "."], { cwd: targetDir });
          try {
            await execa("git", ["commit", "-m", "Initial commit via OmniDev"], {
              cwd: targetDir,
            });
          } catch (commitErr) {
            // Ignore commit errors, just init and stage is fine
          }
        }
      } catch (e) {
        // Silent fail for git issues to prevent crash
      }
    });

    console.log("\n");
    console.log(formatLine("STATUS", theme.success("COMPLETE [200]")));
    console.log(theme.muted("   ────────────────────────────────────────"));
  } catch (error) {
    console.log("\n");
    console.log(theme.danger("   ⚠ CRITICAL ERROR DETECTED"));
    console.log(theme.muted(`   Reason: ${error.message}`));
    console.log(theme.warning("   >> INITIATING ROLLBACK PROTOCOL..."));

    try {
      if (fs.existsSync(targetDir)) {
        await fs.remove(targetDir);
        console.log(theme.success("   ✔ CLEANUP COMPLETE. System restored."));
      }
    } catch (cleanupErr) {
      console.log(
        theme.danger("   X CLEANUP FAILED. Manual deletion required.")
      );
    }
    process.exit(1);
  }

  const runDev = await askInline(`BOOT_DEV_SERVER [Y/n]`);
  if (runDev.trim().toLowerCase() !== "n") {
    console.log(theme.muted("   :: Starting development server..."));
    try {
      await execa("npm", ["run", "dev"], { cwd: targetDir, stdio: "inherit" });
    } catch (e) {}
  } else {
    process.exit(0);
  }
};

// --- MAIN CONTROLLER (PURE INSTALLER) ---

async function main(manualArgs) {
  const cwd = process.cwd();
  const args = Array.isArray(manualArgs) ? manualArgs : process.argv.slice(2);
  const command = args[0] ? args[0].toLowerCase() : null;
  const isProjectRoot = fs.existsSync(path.join(cwd, "package.json"));

  // 1. Direct Command Passthrough (Pro User)
  if (command === "merge") {
    await runMerger(cwd, true);
    process.exit(0);
  }
  if (command === "fab" || command === "fabricator") {
    await runFabricator(cwd, true);
    process.exit(0);
  }

  // 2. Installer Logic
  if (command === "install" || command === "init" || !isProjectRoot) {
    if (isProjectRoot && (command === "install" || command === "init")) {
      console.log(theme.danger("   ERR: PROJECT_ALREADY_INITIALIZED"));
      process.exit(1);
    }
    await runInstaller();
    return;
  }

  // 3. Already in Project? Show Help instead of Dashboard
  if (isProjectRoot) {
    await printHeader("OMNIBUILD", { PROJECT: path.basename(cwd) });
    console.log(theme.text("   Welcome to OmniBuild Project."));
    console.log("");
    console.log(`   ${theme.primary("Available Commands:")}`);
    console.log(
      `   ${theme.accent("omni")}    ${theme.muted(
        "Install Project & Open Dashboard"
      )}`
    );
    console.log(
      `   ${theme.accent("omni fab")}    ${theme.muted(
        "Create components, pages, hooks, etc"
      )}`
    );
    console.log(
      `   ${theme.accent("omni merge")}  ${theme.muted(
        "Combine files for LLM context"
      )}`
    );
    console.log("");
    process.exit(0);
  }
}

main().catch(console.error);
