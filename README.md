<h1>OmniBuild</h1>

OmniBuild is an all-in-one CLI Toolkit (Command Line Interface) for modern React developers. More than just a boilerplate, it is an ecosystem to Scaffold, Fabricate, and Merge code for AI contexts.

⚡ Installation & Usage

Method 1: One-Time Use (No Install)
If you just want to create a new project once without cluttering your system:

    npx omnibuild init

Method 2: Global Install (Recommended for Architects)
For full access to Fabricator and Merger features in any terminal (Power User):

    Windows:
    npm install -g omnibuild

<br>
    macOS / Linux:
    sudo npm install -g omnibuild

Once installed, you have access to 3 powerful commands in your terminal:

    omni        : Main command (Installer & Dashboard).
    omnifab     : Component/feature generator (Fabricator).
    omnimerge   : File merger for LLM Context (Merger).

🚀 Key Features

1. The Installer (Fortress Edition)

Creates a React + Vite project with "Bulletproof" architecture.
Usage:

    omni
    # or
    omni init

What do you get?

    Core            : React 18, Vite 5, TailwindCSS 3.4.
    State & Logic   : Zustand, TanStack Query, Axios (configured).
    Architecture    : Modular src/features folder structure.
    UI Kit          : Shadcn-like setup with class-variance-authority.
    Security        : Auto .env generation, deployment-ready Dockerfile.
    Testing         : Vitest & React Testing Library pre-installed.

2. The Fabricator (Code Generator)

Don't waste time creating files manually. Use Fabricator to generate components, pages, hooks, or stores complete with Unit Tests.

Usage:

    Enter your project folder, then type:

    omnifab
    # or
    omni fab

Capabilities:

    Visual Menu     : Interactive navigation with keyboard arrows.
    Auto Test       : Automatically creates .test.jsx file for every component.
    Smart Scoping   : Can choose to create components in src/components (Global) or inside src/features (Modular).
    Clean Code      : Generates clean, industry-standard code.

3. The Merger (AI Context Builder)

Want to ask ChatGPT/Claude about your entire codebase? Copy-pasting one by one is slow. Merger will combine all your code into a single text file.

Usage:

    omnimerge
    # or
    omni merge

Advantages:

    Smart Filter    : Automatically ignores node_modules, .env, and other secret files.
    Security        : Prevents API Key leakage.
    Performance     : Uses streams to handle thousands of files quickly.
    Output          : Generates omni-context.txt file ready for AI upload.

📂 Project Structure (OmniBuild Standard)

When you create a project with omni, your folder structure will look like this:

    src/
    ├── components/ # Global UI Components (Button, Input, etc.)
    ├── features/ # Modular Features (Auth, Dashboard, Product)
    │ └── auth/
    │ ├── components/
    │ ├── routes/
    │ └── api/
    ├── hooks/ # Global Custom Hooks
    ├── lib/ # Library Configuration (Axios, Utils)
    ├── pages/ # Main Pages (Routing)
    ├── store/ # Global State (Zustand)
    └── types/ # TypeScript Definitions (if using TS)

🛠 Troubleshooting

    Q: omni command not found after install?
    A: Ensure global npm folder is in your computer's PATH. Or try restarting the terminal.

    Q: "EPERM" error during install on Windows?
    A: Try running terminal as Administrator, or use npm install -g omnibuild --force.

    Q: "EACCES" error during install on macOS/Linux?
    A: You need administrator permissions. Use the sudo command prefix:
    sudo npm install -g omnibuild

Cheers,
Omni Developer Team
