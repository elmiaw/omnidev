<div align="center">

OmniBuild

The Ultimate Modular React Framework

"Forged for the Architects of the Digital Realm."

Features • Installation • Usage • Structure • Troubleshooting

</div>

OmniBuild is an all-in-one CLI Toolkit engineered for modern React developers. More than just a boilerplate, it is a complete ecosystem to Scaffold robust architectures, Fabricate components instantly, and Merge code contexts for AI analysis.

⚡ Installation

Method 1: Global Install (Recommended)

Unlock the full power of the CLI (omni, omnifab, omnimerge) in any terminal directory.

Windows:

npm install -g omnibuild

macOS / Linux:
(May require administrator privileges)

sudo npm install -g omnibuild

Method 2: On-Demand Execution

Execute without installing dependencies globally:

npx omnibuild init

🎮 Command Reference

Command

Alias

Function

Description

omni

omni init

Installer

Launches the Fortress Edition installer to scaffold a new React+Vite project.

omnifab

omni fab

Fabricator

Opens the interactive CLI to generate components, features, hooks, and stores.

omnimerge

omni merge

Merger

Aggregates your codebase into a single omni-context.txt file for AI/LLM analysis.

🚀 Key Features

1. The Installer (Fortress Edition)

Scaffolds a battle-tested React architecture designed for scalability.

Execution:

omni

Architecture Highlights:

⚛️ Core: React 18 + Vite 5 + TailwindCSS 3.4

🧠 State: Zustand (Global) + TanStack Query (Server)

🛡️ Security: Auto .env generation & Dockerfile included

🧩 Modular: Pre-configured src/features architecture

🧪 Testing: Vitest & React Testing Library pre-installed

2. The Fabricator (Code Generator)

An interactive CLI tool to generate standardized code assets.

Execution:
(Run this inside your project root)

omnifab

Capabilities:

Visual Interface: Navigate using keyboard arrows.

Auto-Testing: Automatically generates .test.jsx alongside components.

Smart Scoping: Choose between Global (src/components) or Feature-scoped (src/features/...) creation.

3. The Merger (AI Context Builder)

Optimized for "Chat with Codebase" workflows. Combines relevant source code into a token-efficient text file.

Execution:

omnimerge

Features:

🚫 Smart Ignore: Automatically excludes node_modules, .env, .git, and lockfiles.

🔒 Security Guard: Prevents accidental leakage of secrets/API keys.

⚡ Stream Processing: Handles large codebases with minimal memory footprint.

📂 Project Structure

OmniBuild enforces a Feature-First Architecture to maintain sanity in large applications.

src/
├── components/ # 🌐 Global UI Components (Button, Input, Modal)
│ └── ui/ # Primitive UI elements
├── features/ # 🚀 Modular Feature Domains
│ └── auth/ # Example: Auth Feature
│ ├── api/ # - API calls specific to Auth
│ ├── components/# - Components specific to Auth
│ └── routes/ # - Routes specific to Auth
├── hooks/ # ⚓ Global Custom Hooks
├── lib/ # 🛠️ Configuration (Axios, Utils, Constants)
├── pages/ # 📄 Page Composition (Route Views)
├── store/ # 📦 Global State Stores (Zustand)
└── types/ # 📐 TypeScript Definitions

🛠 Troubleshooting

Note: If you encounter permission errors, always verify your Node.js and NPM permissions.

<details>
<summary><strong>Error: Command omni not found</strong></summary>

Ensure your global NPM bin folder is in your system's PATH variable.

Windows: Check Environment Variables.

Mac/Linux: Check .bashrc or .zshrc.

</details>

<details>
<summary><strong>Error: EPERM / Permission Denied (Windows)</strong></summary>

Try running your terminal as Administrator or force the installation:

npm install -g omnibuild --force

</details>

<details>
<summary><strong>Error: EACCES (macOS/Linux)</strong></summary>

Use sudo to grant write access to global directories:

sudo npm install -g omnibuild

</details>

<div align="center">

Forged by Grandmaster Architect

Report Bug • Request Feature

</div>
