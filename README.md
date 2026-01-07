<h1>OmniBuild</h1>

<p>OmniBuild is an all-in-one CLI Toolkit (Command Line Interface) for modern React developers. More than just a boilerplate, it is an ecosystem to Scaffold, Fabricate, and Merge code for AI contexts.</p><br>
<hr>
<h3><b>⚡ - Installation & Usage</b></h3>
<br>
<b>Method 1: One-Time Use <i>(No Install)</i></b>

<p>If you just want to create a new project once without cluttering your system:</p>

<pre>npx omni init</pre>

<br>
<b>Method 2: Global Install <i>(Recommended for Architects)</i></b>
<p>For full access to Fabricator and Merger features in any terminal (Power User):</p>

<pre>Windows<br>
<pre>npm install -g omnibuild</pre></pre>

<pre>Mac OS / Linux<br>
<pre>sudo npm install -g omnibuild</pre></pre>
<hr><br>
<p>Once installed, you have access to 3 powerful commands in your terminal:</p>
<br>
<b>. Main Command</b>
<p><i>To Open Installer & Dashboard</i></p>
    <pre>omni</pre>
<br>
<b>. Component / Feature Generator</b>
<p><i>To Generate component, feature, page, etc.</i></p>
    <pre>omnifab</pre>
<br>
<b>. File Merger</b>
<p><i>Merge your file for LLM Context</i></p>
    <pre>omnifab</pre>
<br>

<hr>
<h3><b>🚀 - Key Feature</b></h3>
<br>
<b>1. The Installer</b>
<p>Creates a React + Vite project  architecture.</p><br>

<pre>Usage:<br>
<pre>omni <br><i>or</i><br>omni init</pre></pre>
<p>What do you get?</P>
<Pre>
    Core            : React 18, Vite 5, TailwindCSS 3.4.
    State & Logic   : Zustand, TanStack Query, Axios (configured).
    Architecture    : Modular src/features folder structure.
    UI Kit          : Shadcn-like setup with class-variance-authority.
    Security        : Auto .env generation, deployment-ready Dockerfile.
    Testing         : Vitest & React Testing Library pre-installed.
</pre>
<br>
<hr>
<b>2. The Fabricator</b>
<p>Don't waste time creating files manually. Use Fabricator to generate components, pages, hooks, or stores complete with Unit Tests.</p></br>

<pre>Usage:<br>
<pre>Enter your project folder<br><i>thentype</i><br>omnifab</pre></pre>
<p>Compability</P>
<pre>
    Visual Menu     : Interactive navigation with keyboard arrows.
    Auto Test       : Automatically creates .test.jsx file for every component.
    Smart Scoping   : Can choose to create components in (Global) or (Feature)
    Clean Code      : Generates clean, industry-standard code.
</pre>
<br>
<hr>
<b>3. The Merger</b>
<p>Want to ask ChatGPT/Claude about your entire codebase? Copy-pasting one by one is slow. Merger will combine all your code into a single text file.</p><br>

<pre>Usage:<br>
<pre>omnimerge <br><i>or</i><br>omni merge</pre></pre>

<p>Compability</P>

<pre>
    Smart Filter    : Automatically ignores node_modules, .env, and other secret files.
    Security        : Prevents API Key leakage.
    Performance     : Uses streams to handle thousands of files quickly.
    Output          : Generates omni-context.txt file ready for AI upload.
</pre>
<br>
<hr>
<h3><b>📂 - Project Structure</b></h3>
<p><i>When you create a project with omni, your folder structure will look like this:</i><p>
<pre>
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
</pre>
<br>
<hr>
<h3><b>🛠 - Troubleshooting</b></h3>

<b>Q: omni command not found after install?</b><br>
A: Ensure global npm folder is in your computer's PATH. Or try restarting the terminal.
<br>

<b>Q: "EPERM" error during install on Windows?</b><br>
A: Try running terminal as Administrator, or use npm install -g omnibuild --force.
<br>

<b>Q: "EACCES" error during install on macOS/Linux?</b><br>
A: You need administrator permissions. Use the sudo command prefix : <i>sudo npm install -g omnibuild</i>

<br>
Cheers,<br>
<b>Omni Developer Team<b>
