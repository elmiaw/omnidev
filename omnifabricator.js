#!/usr/bin/env node

/**
 * MODULE: OMNIFABRICATOR (THE ROYAL ARCHITECT)
 * AUTHOR: GRANDMASTER ARCHITECT
 * THEME: ROYAL LIGHT MODE (High Contrast / Clean Protocol)
 * NOTE: Advanced scaffolding engine with visual feedback, governance, data metrics, and TEST SUITES.
 */

import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";

// --- CONFIGURATION ---
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VERSION = "9.1.2-royal-alignment-fix";

// --- [THEME] ROYAL LIGHT MODE (Optimized for White Background) ---
const theme = {
  primary: chalk.hex("#0033CC").bold, // Royal Blue
  secondary: chalk.hex("#4D0099").bold, // Deep Purple
  success: chalk.hex("#006600").bold, // Forest Green
  warning: chalk.hex("#CC6600").bold, // Burnt Orange
  danger: chalk.hex("#CC0000").bold, // Red
  text: chalk.hex("#000000"), // Pure Black (High Contrast)
  muted: chalk.hex("#555555"), // Dark Grey
  accent: chalk.hex("#008899"), // Teal
  tag: chalk.bgCyan.black.bold, // High vis tag
  dangerTag: chalk.bgHex("#CC0000").white.bold, // [NEW] Red Background Tag
  header: chalk.bgHex("#0033CC").white.bold, // Blue Header block
  disabled: chalk.hex("#AAAAAA"), // Disabled Grey
};

// [ALIGNMENT CONSTANT]
const GRID_LABEL_WIDTH = 32;

// --- UTILITIES ---

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const clearScreen = () => {
  process.stdout.write("\x1B[2J\x1B[0f");
};

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 KB";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// [VISUAL ENGINE] Progress Bar & Spinner
const spinners = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
let spinnerIdx = 0;

const renderGridProgressBar = (label, pct) => {
  const width = 15;
  const filled = Math.round((width * pct) / 100);
  const empty = width - filled;

  const bar =
    theme.primary("/".repeat(filled)) + theme.muted("-".repeat(empty));
  const spinner = theme.accent(spinners[spinnerIdx++ % spinners.length]);

  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);

  const key = "FABRICATION";
  const valueStr = `${spinner} ${label.padEnd(22)} ${theme.muted(
    "["
  )}${bar}${theme.muted("]")} ${pct}%`;

  process.stdout.write(
    `   ${theme.muted(key.padEnd(GRID_LABEL_WIDTH))} ${theme.primary(
      "│"
    )} ${valueStr}`
  );
};

const runForgingAnimation = async (taskName) => {
  console.log("");
  const steps = [
    "Allocating Blueprint...",
    "Forging Structure...",
    "Writing Unit Tests...",
    "Polishing Syntax...",
    "Finalizing Asset...",
  ];

  for (let i = 0; i < steps.length; i++) {
    const pct = Math.round(((i + 1) / steps.length) * 100);
    renderGridProgressBar(steps[i], pct);
    await sleep(80 + Math.random() * 100);
  }
  renderGridProgressBar("Asset Finalized", 100);
  process.stdout.write("\n\n");
};

const runDestructionAnimation = async (taskName) => {
  console.log("");
  const steps = [
    "Locating Target...",
    "Detaching Dependencies...",
    "Removing Test Suites...",
    "Incinerating Data...",
    "Cleaning Residue...",
  ];

  for (let i = 0; i < steps.length; i++) {
    const pct = Math.round(((i + 1) / steps.length) * 100);
    renderGridProgressBar(steps[i], pct);
    await sleep(80 + Math.random() * 100);
  }
  renderGridProgressBar("Destruction Complete", 100);
  process.stdout.write("\n\n");
};

const printHeader = (protocol, meta = {}) => {
  clearScreen();
  const formatLine = (key, val) => {
    const displayVal = val || theme.muted("—");
    return `   ${theme.muted(key.padEnd(GRID_LABEL_WIDTH))} ${theme.primary(
      "│"
    )} ${theme.text(displayVal)}`;
  };

  console.log("");
  console.log(`   ${theme.header(`  ${protocol}  `)}`);
  console.log("");

  if (meta.PROJECT) console.log(formatLine("PROJECT", meta.PROJECT));
  if (meta.LOCATION) console.log(formatLine("LOCATION", meta.LOCATION));

  Object.keys(meta).forEach((k) => {
    if (
      k !== "PROJECT" &&
      k !== "LOCATION" &&
      k !== "CONTEXT" &&
      k !== "STATUS"
    ) {
      console.log(formatLine(k, meta[k]));
    }
  });

  console.log(
    theme.muted("   ──────────────────────────────────────────────────────")
  );
  console.log("");
};

const logStatus = (key, val, colorFn = theme.text) => {
  console.log(
    `   ${theme.muted(key.padEnd(GRID_LABEL_WIDTH))} ${theme.primary(
      "│"
    )} ${colorFn(val)}`
  );
};

const askInline = (query, tagStyle = theme.tag) => {
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

    const prompt = `   ${theme.primary("●")} ${tagStyle(
      paddedLabel
    )} ${theme.muted(":")} `;

    const keyHandler = (str, key) => {
      if (key.name === "escape") {
        process.stdout.write("\n");
        console.log("");
        console.log(theme.primary("   >> FABRICATION_ABORTED"));
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

const waitEnter = (message = "Press [ENTER] to continue...") => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);

  return new Promise((resolve) => {
    console.log("");
    process.stdout.write(`   ${theme.muted(message)}`);
    const keyHandler = (str, key) => {
      if (key.name === "return" || key.name === "enter") {
        process.stdin.removeListener("keypress", keyHandler);
        if (process.stdin.isTTY) process.stdin.setRawMode(false);
        rl.close();
        process.stdout.write("\n");
        resolve();
      }
    };
    process.stdin.on("keypress", keyHandler);
  });
};

const renderMenu = async (protocol, options, meta = {}) => {
  let selectedIndex = 0;

  const firstEnabled = options.findIndex(
    (opt) => !opt.disabled && opt.value !== "noop" && opt.label !== "---"
  );
  if (firstEnabled !== -1) selectedIndex = firstEnabled;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });
  process.stdout.write("\x1B[?25l");

  printHeader(protocol, meta);

  const metaKeys = Object.keys(meta);
  const startRow = 3 + metaKeys.length + 2;

  const renderItems = () => {
    readline.cursorTo(process.stdout, 0, startRow);

    options.forEach((opt, idx) => {
      readline.clearLine(process.stdout, 0);

      if (opt.label === "---") {
        console.log(
          theme.muted(`      ────────────────────────────────────────`)
        );
      } else {
        const isSelected = idx === selectedIndex;
        const pointer = isSelected ? theme.primary("▶") : " ";
        let label = "";

        if (opt.disabled) {
          label = theme.disabled(opt.label);
        } else if (opt.value === "noop") {
          label = isSelected ? theme.accent(opt.label) : theme.text(opt.label);
        } else if (opt.danger) {
          label = isSelected
            ? theme.danger.bold(opt.label)
            : theme.danger(opt.label);
        } else if (opt.warning) {
          label = isSelected
            ? theme.warning.bold(opt.label)
            : theme.warning(opt.label);
        } else {
          label = isSelected
            ? theme.primary.bold(opt.label)
            : theme.text(opt.label);
        }

        console.log(`      ${pointer} ${label}`);
      }
    });

    console.log("");
    readline.clearLine(process.stdout, 0);
    console.log(theme.warning("      [↑/↓] Navigate   [ENTER] Select"));
  };

  renderItems();

  return new Promise((resolve) => {
    process.stdin.setRawMode(true);
    process.stdin.resume();

    const handleKey = (ch, key) => {
      if (key.name === "up") {
        do {
          selectedIndex =
            selectedIndex > 0 ? selectedIndex - 1 : options.length - 1;
        } while (
          options[selectedIndex].label === "---" ||
          options[selectedIndex].disabled ||
          options[selectedIndex].value === "noop"
        );
        renderItems();
      } else if (key.name === "down") {
        do {
          selectedIndex =
            selectedIndex < options.length - 1 ? selectedIndex + 1 : 0;
        } while (
          options[selectedIndex].label === "---" ||
          options[selectedIndex].disabled ||
          options[selectedIndex].value === "noop"
        );
        renderItems();
      } else if (key.name === "return") {
        if (options[selectedIndex].value === "noop") return;
        if (options[selectedIndex].disabled) return;
        cleanup();
        resolve(options[selectedIndex].value);
      } else if (key.name === "c" && key.ctrl) {
        cleanup();
        process.exit(0);
      }
    };

    const cleanup = () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.removeListener("keypress", handleKey);
      rl.close();
      process.stdout.write("\x1B[?25h");
    };

    process.stdin.on("keypress", handleKey);
  });
};

const getFolders = async (dirPath) => {
  if (!fs.existsSync(dirPath)) fs.ensureDirSync(dirPath);
  const dirs = await fs.readdir(dirPath);
  return dirs.filter((d) => {
    return fs.statSync(path.join(dirPath, d)).isDirectory();
  });
};

// --- [CORE LOGIC] FABRICATOR ENGINE ---

export const runFabricator = async (
  cwd = process.cwd(),
  directMode = false
) => {
  const projectName = path.basename(cwd);

  while (true) {
    const MENU_PAD = GRID_LABEL_WIDTH - 5;

    const mainOptions = [
      {
        value: "FEAT",
        label: `🚀  ${"Manage Feature".padEnd(MENU_PAD - 4)}`,
      },
      {
        value: "COMP",
        label: `🏗️   ${"Manage Component".padEnd(MENU_PAD - 4)}`,
      },
      { value: "PAGE", label: `📄  ${"Manage Page".padEnd(MENU_PAD - 4)}` },
      { value: "HOOK", label: `⚓  ${"Manage Logic".padEnd(MENU_PAD - 4)}` },
      {
        value: "STORE",
        label: `📦  ${"Manage State".padEnd(MENU_PAD - 4)}`,
      },
      { value: "---", label: "---" },
      {
        value: "BACK",
        label: directMode
          ? `❌ ${"Terminate".padEnd(MENU_PAD - 3)}`
          : `⬅️  ${"Return to Main".padEnd(MENU_PAD - 4)}`,
      },
    ];

    const protocol = "OMNI_FABRICATOR";
    const choice = await renderMenu(protocol, mainOptions, {
      PROJECT: projectName,
      LOCATION: "Root",
    });

    if (choice === "BACK") {
      if (directMode) process.exit(0);
      return;
    }

    // --- FEATURE MANAGEMENT ---
    if (choice === "FEAT") {
      const featureRoot = path.join(cwd, "src/features");
      await fs.ensureDir(featureRoot);

      while (true) {
        const features = await getFolders(featureRoot);
        const featureList = features.map((f) => {
          const subPath = path.join(featureRoot, f, "components");
          const count = fs.existsSync(subPath)
            ? fs
                .readdirSync(subPath)
                .filter((x) => x.endsWith(".jsx") || x.endsWith(".tsx")).length
            : 0;

          // [ALIGNMENT FIX] Updated to -8 to account for the "📦 " icon width
          const ALIGNMENT_OFFSET = GRID_LABEL_WIDTH - 8;

          const paddedName =
            f.length > ALIGNMENT_OFFSET
              ? f.substring(0, ALIGNMENT_OFFSET - 3) + "..."
              : f.padEnd(ALIGNMENT_OFFSET);

          return {
            value: f,
            label: `📦 ${paddedName} ${theme.muted("│")}   ${count} components`,
          };
        });

        const subMenu = [
          ...featureList,
          { value: "---", label: "---" },
          { value: "CREATE", label: "➕  Create New Feature" },
          { value: "BACK", label: "⬅️   Return" },
        ];

        const action = await renderMenu("FEATURE MANAGER", subMenu, {
          PROJECT: projectName,
          LOCATION: "src/features",
        });

        if (action === "BACK") break;

        if (action === "CREATE") {
          printHeader("FEATURE_FORGE", {
            PROJECT: projectName,
            TARGET: "NEW_MODULE",
          });

          const name = await askInline("FEATURE_NAME (camelCase): ");
          if (name) {
            await runForgingAnimation(`Forging Module: ${name}`);

            const featurePath = path.join(featureRoot, name);
            const dirs = ["api", "components", "hooks", "routes", "types"];

            for (const d of dirs) {
              await fs.ensureDir(path.join(featurePath, d));
            }

            await fs.writeFile(
              path.join(featurePath, "index.js"),
              `// Public API for ${name} feature\nexport * from './routes';\n`
            );

            await fs.writeFile(
              path.join(featurePath, "routes/index.jsx"),
              `import { Route, Routes } from 'react-router-dom';\n\nexport const ${
                name.charAt(0).toUpperCase() + name.slice(1)
              }Routes = () => {\n  return (\n    <Routes>\n      <Route path="/" element={<div>${name} Root</div>} />\n    </Routes>\n  );\n};`
            );

            logStatus(
              "STATUS",
              `✓ Feature module '${name}' created`,
              theme.success
            );
            await waitEnter();
          }
          continue;
        }

        if (!["CREATE", "BACK", "---"].includes(action)) {
          const actionMenu = [
            { value: "RENAME", label: "✏️   Rename Feature", warning: true },
            { value: "DELETE", label: "🗑️   Destroy Feature", danger: true },
            { value: "BACK", label: "⬅️   Cancel" },
          ];

          const subAction = await renderMenu(
            `MANAGE: ${action.toUpperCase()}`,
            actionMenu,
            {
              PROJECT: projectName,
              LOCATION: `src/features/${action}`,
            }
          );

          if (subAction === "DELETE") {
            const confirm = await askInline(
              "CONFIRM_DESTRUCTION [y/n]: ",
              theme.dangerTag
            );
            if (confirm.toLowerCase() === "y") {
              await runDestructionAnimation("Deleting Feature");
              await fs.remove(path.join(featureRoot, action));
              logStatus("STATUS", "✓ Feature Destroyed", theme.success);
              await waitEnter();
            }
          }

          if (subAction === "RENAME") {
            const newName = await askInline("NEW_NAME: ");
            if (newName) {
              await fs.rename(
                path.join(featureRoot, action),
                path.join(featureRoot, newName)
              );
              logStatus("STATUS", "✓ Renamed", theme.success);
              await waitEnter();
            }
          }
        }
      }
    }

    // --- COMPONENT FABRICATION ---
    else if (choice === "COMP") {
      const scopeOptions = [
        { value: "GLOBAL", label: "🌐  Global Components (src/components)" },
        { value: "FEATURE", label: "🚀  Feature Components (src/features)" },
        { value: "BACK", label: "⬅️   Return" },
      ];

      const scope = await renderMenu("COMPONENT_SCOPE", scopeOptions, {
        PROJECT: projectName,
        ACTION: "SELECT_SCOPE",
      });

      if (scope === "BACK") continue;

      let rootDir = "";
      let locationLabel = "";

      if (scope === "GLOBAL") {
        rootDir = path.join(cwd, "src/components");
        locationLabel = "src/components";
      } else {
        const featureRoot = path.join(cwd, "src/features");
        await fs.ensureDir(featureRoot);
        const features = await getFolders(featureRoot);

        if (features.length === 0) {
          console.log(
            theme.warning("   ⚠ No features found. Create a feature first.")
          );
          await waitEnter();
          continue;
        }

        const featureOptions = features.map((f) => ({
          value: f,
          label: `📦 ${f}`,
        }));
        const selectedFeature = await renderMenu(
          "SELECT FEATURE",
          [...featureOptions, { value: "BACK", label: "⬅️ Return" }],
          {
            PROJECT: projectName,
            LOCATION: "src/features",
          }
        );

        if (selectedFeature === "BACK") continue;
        rootDir = path.join(featureRoot, selectedFeature, "components");
        locationLabel = `src/features/${selectedFeature}/components`;
      }

      await fs.ensureDir(rootDir);

      // FILE MANAGEMENT (EXPLORER)
      while (true) {
        const folders = await getFolders(rootDir);

        const folderOptions = folders.map((s) => {
          const folderPath = path.join(rootDir, s);
          const files = fs.readdirSync(folderPath);
          const count = files.filter(
            (f) => f.endsWith(".jsx") || f.endsWith(".tsx")
          ).length;
          const ALIGNMENT_OFFSET = GRID_LABEL_WIDTH - 5;
          const paddedName =
            s.length > ALIGNMENT_OFFSET
              ? s.substring(0, ALIGNMENT_OFFSET - 3) + "..."
              : s.padEnd(ALIGNMENT_OFFSET);
          let filesLabel =
            count === 0 ? theme.muted("0 files") : `${count} files`;

          return {
            value: s,
            label: `${paddedName} ${theme.muted("│")}   ${filesLabel}`,
          };
        });

        const menuOptions = [
          ...folderOptions,
          { value: "---", label: "---" },
          { value: "NEW_FOLDER", label: "➕  Initiate New Folder" },
          { value: "BACK", label: "⬅️   Return" },
        ];

        const folderChoice = await renderMenu(
          "COMPONENT MANAGER",
          menuOptions,
          {
            PROJECT: projectName,
            LOCATION: locationLabel,
          }
        );

        if (folderChoice === "BACK") break;

        if (folderChoice === "NEW_FOLDER") {
          const name = await askInline("FOLDER_NAME (lowercase): ");
          if (name) {
            fs.ensureDirSync(path.join(rootDir, name));
            logStatus(
              "STATUS",
              `✓ Folder '${name}' established`,
              theme.success
            );
            await sleep(500);
          }
          continue;
        }

        let currentFolder = folderChoice;

        // Loop Inside Specific Folder
        while (true) {
          const folderPath = path.join(rootDir, currentFolder);
          if (!fs.existsSync(folderPath)) break;

          const files = fs
            .readdirSync(folderPath)
            .filter((f) => f.endsWith(".jsx") || f.endsWith(".tsx"));
          let totalSize = 0;
          const fileStats = files.map((f) => {
            const stat = fs.statSync(path.join(folderPath, f));
            totalSize += stat.size;
            return { name: f, size: stat.size };
          });

          const ALIGNMENT_OFFSET_FILE = GRID_LABEL_WIDTH - 8;
          const fileOptions = fileStats.map((f) => {
            const truncatedName =
              f.name.length > ALIGNMENT_OFFSET_FILE
                ? f.name.substring(0, ALIGNMENT_OFFSET_FILE - 3) + "..."
                : f.name;
            const paddedName = truncatedName.padEnd(ALIGNMENT_OFFSET_FILE);
            return {
              value: `MANAGE:${f.name}`,
              label: `📄 ${paddedName} ${theme.muted("│")}   ${formatBytes(
                f.size
              )}`,
            };
          });

          let subMenu =
            fileOptions.length > 0
              ? [...fileOptions]
              : [{ value: "noop", label: theme.muted("(Folder Empty)") }];

          subMenu.push(
            { value: "---", label: "---" },
            { value: "CREATE", label: "⚡  Forge Component Here" },
            {
              value: "RENAME_FOLDER",
              label: "✏️   Rename Folder",
              warning: true,
            },
            {
              value: "DELETE_FOLDER",
              label: "🗑️   Destroy Folder",
              danger: true,
            },
            { value: "BACK", label: "⬅️   Return" }
          );

          const subChoice = await renderMenu(
            `FOLDER: ${currentFolder.toUpperCase()}`,
            subMenu,
            {
              PROJECT: projectName,
              LOCATION: `${locationLabel}/${currentFolder}`,
              FILES: files.length.toString(),
            }
          );

          if (subChoice === "BACK") break;

          if (subChoice === "RENAME_FOLDER") {
            const newName = await askInline("NEW_FOLDER_NAME: ");
            if (newName && newName !== currentFolder) {
              await fs.rename(
                path.join(rootDir, currentFolder),
                path.join(rootDir, newName)
              );
              currentFolder = newName;
              logStatus("STATUS", "✓ Renamed", theme.success);
              await waitEnter();
            }
            continue;
          }

          if (subChoice === "DELETE_FOLDER") {
            const confirm = await askInline(
              "CONFIRM_NUKE [y/n]: ",
              theme.dangerTag
            );
            if (confirm.toLowerCase() === "y") {
              await runDestructionAnimation("Incinerating Folder");
              await fs.remove(path.join(rootDir, currentFolder));
              logStatus("STATUS", "✓ Folder destroyed", theme.success);
              await waitEnter();
              break;
            }
            continue;
          }

          if (subChoice.startsWith("MANAGE:")) {
            const fileName = subChoice.split(":")[1];
            const filePath = path.join(folderPath, fileName);
            let fileSizeStr = "Unknown";
            if (fs.existsSync(filePath)) {
              const stat = fs.statSync(filePath);
              fileSizeStr = formatBytes(stat.size);
            }

            const action = await renderMenu(
              "FILE_GOVERNANCE",
              [
                { value: "RENAME", label: "✏️   Rename File" },
                { value: "DELETE", label: "🗑️   Destroy File", danger: true },
                { value: "BACK", label: "⬅️   Back" },
              ],
              { PROJECT: projectName, FILE: fileName, SIZE: fileSizeStr }
            ); // [NEW] Added SIZE to Header

            if (action === "DELETE") {
              const confirm = await askInline(
                "CONFIRM [y/n]: ",
                theme.dangerTag
              );
              if (confirm.toLowerCase() === "y") {
                await fs.remove(path.join(folderPath, fileName));
                const testName = fileName.replace(/\.(jsx|tsx)$/, ".test.$1");
                const testPath = path.join(folderPath, "__tests__", testName);
                if (fs.existsSync(testPath)) await fs.remove(testPath);
                logStatus("STATUS", "✓ File Destroyed", theme.success);
                await waitEnter();
              }
            }
            if (action === "RENAME") {
              const newName = await askInline("NEW_NAME (PascalCase): ");
              if (newName) {
                const ext = fileName.split(".").pop();
                await fs.rename(
                  path.join(folderPath, fileName),
                  path.join(folderPath, `${newName}.${ext}`)
                );
                logStatus("STATUS", "✓ Renamed", theme.success);
                await waitEnter();
              }
            }
            continue;
          }

          if (subChoice === "CREATE") {
            const name = await askInline("COMPONENT_NAME (PascalCase): ");
            if (name) {
              await runForgingAnimation(`Forging ${name}`);
              const ext = fs.existsSync(path.join(cwd, "tsconfig.json"))
                ? "tsx"
                : "jsx";
              const filePath = path.join(folderPath, `${name}.${ext}`);

              if (!fs.existsSync(filePath)) {
                await fs.writeFile(
                  filePath,
                  `import { cn } from "@/utils";\nexport default function ${name}({ className, ...props }) {\n  return <div className={cn("", className)} {...props}>${name}</div>;\n}`
                );
                const testDir = path.join(folderPath, "__tests__");
                await fs.ensureDir(testDir);
                const testExt = ext === "tsx" ? "test.tsx" : "test.jsx";
                await fs.writeFile(
                  path.join(testDir, `${name}.${testExt}`),
                  `import { render } from '@testing-library/react';\nimport ${name} from '../${name}';\n\ndescribe('${name}', () => {\n  it('renders', () => {\n    render(<${name} />);\n  });\n});`
                );
                logStatus("STATUS", `✓ ${name} Created`, theme.success);
              } else {
                console.log(theme.danger("   ERR: File exists"));
              }
              await waitEnter();
            }
          }
        }
      }
    }

    // --- PAGE FABRICATION (UPGRADED) ---
    else if (choice === "PAGE") {
      const rootDir = path.join(cwd, "src/pages");
      await fs.ensureDir(rootDir);

      while (true) {
        const folders = await getFolders(rootDir);
        const folderOptions = folders.map((s) => {
          const folderPath = path.join(rootDir, s);
          const files = fs.readdirSync(folderPath);
          const count = files.filter(
            (f) => f.endsWith(".jsx") || f.endsWith(".tsx")
          ).length;
          const ALIGNMENT_OFFSET = GRID_LABEL_WIDTH - 5;
          const paddedName =
            s.length > ALIGNMENT_OFFSET
              ? s.substring(0, ALIGNMENT_OFFSET - 3) + "..."
              : s.padEnd(ALIGNMENT_OFFSET);
          let filesLabel =
            count === 0 ? theme.muted("0 files") : `${count} files`;
          return {
            value: s,
            label: `${paddedName} ${theme.muted("│")}   ${filesLabel}`,
          };
        });

        const menuOptions = [
          ...folderOptions,
          { value: "---", label: "---" },
          { value: "NEW_FOLDER", label: "➕  Initiate New Page Group" },
          { value: "BACK", label: "⬅️   Return" },
        ];

        const folderChoice = await renderMenu("PAGE MANAGER", menuOptions, {
          PROJECT: projectName,
          LOCATION: "src/pages",
        });

        if (folderChoice === "BACK") break;

        if (folderChoice === "NEW_FOLDER") {
          const name = await askInline("GROUP_NAME (lowercase): ");
          if (name) {
            fs.ensureDirSync(path.join(rootDir, name));
            logStatus("STATUS", `✓ Group '${name}' established`, theme.success);
            await sleep(500);
          }
          continue;
        }

        let currentFolder = folderChoice;
        while (true) {
          const folderPath = path.join(rootDir, currentFolder);
          if (!fs.existsSync(folderPath)) break;
          const files = fs
            .readdirSync(folderPath)
            .filter((f) => f.endsWith(".jsx") || f.endsWith(".tsx"));
          const fileStats = files.map((f) => ({
            name: f,
            size: fs.statSync(path.join(folderPath, f)).size,
          }));
          const ALIGNMENT_OFFSET_FILE = GRID_LABEL_WIDTH - 8;
          const fileOptions = fileStats.map((f) => {
            const paddedName = f.name.padEnd(ALIGNMENT_OFFSET_FILE);
            return {
              value: `MANAGE:${f.name}`,
              label: `📄 ${paddedName} ${theme.muted("│")}   ${formatBytes(
                f.size
              )}`,
            };
          });

          let subMenu =
            fileOptions.length > 0
              ? [...fileOptions]
              : [{ value: "noop", label: theme.muted("(Empty Group)") }];
          subMenu.push(
            { value: "---", label: "---" },
            { value: "CREATE", label: "⚡  Forge Page Here" },
            {
              value: "DELETE_FOLDER",
              label: "🗑️   Destroy Group",
              danger: true,
            },
            { value: "BACK", label: "⬅️   Return" }
          );

          const subChoice = await renderMenu(
            `GROUP: ${currentFolder.toUpperCase()}`,
            subMenu,
            { PROJECT: projectName, LOCATION: `src/pages/${currentFolder}` }
          );
          if (subChoice === "BACK") break;

          if (subChoice === "DELETE_FOLDER") {
            const confirm = await askInline(
              "CONFIRM_NUKE [y/n]: ",
              theme.dangerTag
            );
            if (confirm.toLowerCase() === "y") {
              await runDestructionAnimation("Incinerating Group");
              await fs.remove(path.join(rootDir, currentFolder));
              await waitEnter();
              break;
            }
            continue;
          }

          if (subChoice.startsWith("MANAGE:")) {
            const fileName = subChoice.split(":")[1];
            const filePath = path.join(folderPath, fileName);
            let fileSizeStr = "Unknown";
            if (fs.existsSync(filePath)) {
              const stat = fs.statSync(filePath);
              fileSizeStr = formatBytes(stat.size);
            }

            const action = await renderMenu(
              "FILE_GOVERNANCE",
              [
                { value: "DELETE", label: "🗑️   Destroy File", danger: true },
                { value: "BACK", label: "⬅️   Back" },
              ],
              { PROJECT: projectName, FILE: fileName, SIZE: fileSizeStr }
            ); // [NEW] Added SIZE to Header
            if (action === "DELETE") {
              const confirm = await askInline(
                "CONFIRM [y/n]: ",
                theme.dangerTag
              );
              if (confirm.toLowerCase() === "y") {
                await fs.remove(path.join(folderPath, fileName));
                logStatus("STATUS", "✓ File Destroyed", theme.success);
                await waitEnter();
              }
            }
            continue;
          }

          if (subChoice === "CREATE") {
            const name = await askInline("PAGE_NAME (PascalCase): ");
            if (name) {
              await runForgingAnimation(`Constructing Page: ${name}`);
              const ext = fs.existsSync(path.join(cwd, "tsconfig.json"))
                ? "tsx"
                : "jsx";
              const filePath = path.join(folderPath, `${name}.${ext}`);
              await fs.writeFile(
                filePath,
                `export default function ${name}() {\n  return <div className="p-8"><h1 className="text-3xl font-bold">${name}</h1></div>;\n}`
              );
              logStatus("STATUS", `✓ Page ${name} created`, theme.success);
              await waitEnter();
            }
          }
        }
      }
    }

    // --- HOOK FABRICATION (UPGRADED) ---
    else if (choice === "HOOK") {
      const scopeOptions = [
        { value: "GLOBAL", label: "🌐  Global Logic (src/hooks)" },
        { value: "FEATURE", label: "🚀  Feature Logic (src/features)" },
        { value: "BACK", label: "⬅️   Return" },
      ];
      const scope = await renderMenu("HOOK_SCOPE", scopeOptions, {
        PROJECT: projectName,
        ACTION: "SELECT_SCOPE",
      });
      if (scope === "BACK") continue;

      let rootDir = "";
      let locationLabel = "";

      if (scope === "GLOBAL") {
        rootDir = path.join(cwd, "src/hooks");
        locationLabel = "src/hooks";
      } else {
        const featureRoot = path.join(cwd, "src/features");
        await fs.ensureDir(featureRoot);
        const features = await getFolders(featureRoot);
        if (features.length === 0) {
          console.log(theme.warning("   ⚠ No features found."));
          await waitEnter();
          continue;
        }
        const featureOptions = features.map((f) => ({
          value: f,
          label: `📦 ${f}`,
        }));
        const selectedFeature = await renderMenu(
          "SELECT FEATURE",
          [...featureOptions, { value: "BACK", label: "⬅️ Return" }],
          { PROJECT: projectName, LOCATION: "src/features" }
        );
        if (selectedFeature === "BACK") continue;
        rootDir = path.join(featureRoot, selectedFeature, "hooks");
        locationLabel = `src/features/${selectedFeature}/hooks`;
      }
      await fs.ensureDir(rootDir);

      while (true) {
        const folders = await getFolders(rootDir);
        const folderOptions = folders.map((s) => {
          const folderPath = path.join(rootDir, s);
          const files = fs.readdirSync(folderPath);
          const count = files.filter(
            (f) => f.endsWith(".js") || f.endsWith(".ts")
          ).length;
          const paddedName = s.padEnd(GRID_LABEL_WIDTH - 5);
          return {
            value: s,
            label: `${paddedName} ${theme.muted("│")}   ${count} hooks`,
          };
        });

        const menuOptions = [
          ...folderOptions,
          { value: "---", label: "---" },
          { value: "NEW_FOLDER", label: "➕  Initiate New Logic Group" },
          { value: "BACK", label: "⬅️   Return" },
        ];
        const folderChoice = await renderMenu("LOGIC MANAGER", menuOptions, {
          PROJECT: projectName,
          LOCATION: locationLabel,
        });
        if (folderChoice === "BACK") break;

        if (folderChoice === "NEW_FOLDER") {
          const name = await askInline("GROUP_NAME (lowercase): ");
          if (name) {
            fs.ensureDirSync(path.join(rootDir, name));
            logStatus("STATUS", `✓ Group '${name}' established`, theme.success);
            await sleep(500);
          }
          continue;
        }

        let currentFolder = folderChoice;
        while (true) {
          const folderPath = path.join(rootDir, currentFolder);
          if (!fs.existsSync(folderPath)) break;
          const files = fs
            .readdirSync(folderPath)
            .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
          const fileStats = files.map((f) => ({
            name: f,
            size: fs.statSync(path.join(folderPath, f)).size,
          }));
          const ALIGNMENT_OFFSET_FILE = GRID_LABEL_WIDTH - 8;
          const fileOptions = fileStats.map((f) => {
            const paddedName = f.name.padEnd(ALIGNMENT_OFFSET_FILE);
            return {
              value: `MANAGE:${f.name}`,
              label: `⚓ ${paddedName} ${theme.muted("│")}   ${formatBytes(
                f.size
              )}`,
            };
          });

          let subMenu =
            fileOptions.length > 0
              ? [...fileOptions]
              : [{ value: "noop", label: theme.muted("(Empty Group)") }];
          subMenu.push(
            { value: "---", label: "---" },
            { value: "CREATE", label: "⚡  Synthesize Hook Here" },
            {
              value: "DELETE_FOLDER",
              label: "🗑️   Destroy Group",
              danger: true,
            },
            { value: "BACK", label: "⬅️   Return" }
          );

          const subChoice = await renderMenu(
            `GROUP: ${currentFolder.toUpperCase()}`,
            subMenu,
            {
              PROJECT: projectName,
              LOCATION: `${locationLabel}/${currentFolder}`,
            }
          );
          if (subChoice === "BACK") break;

          if (subChoice === "DELETE_FOLDER") {
            const confirm = await askInline(
              "CONFIRM_NUKE [y/n]: ",
              theme.dangerTag
            );
            if (confirm.toLowerCase() === "y") {
              await runDestructionAnimation("Incinerating Group");
              await fs.remove(path.join(rootDir, currentFolder));
              await waitEnter();
              break;
            }
            continue;
          }

          if (subChoice.startsWith("MANAGE:")) {
            const fileName = subChoice.split(":")[1];
            const action = await renderMenu(
              "FILE_GOVERNANCE",
              [
                { value: "DELETE", label: "🗑️   Destroy File", danger: true },
                { value: "BACK", label: "⬅️   Back" },
              ],
              { PROJECT: projectName, FILE: fileName }
            );
            if (action === "DELETE") {
              const confirm = await askInline(
                "CONFIRM [y/n]: ",
                theme.dangerTag
              );
              if (confirm.toLowerCase() === "y") {
                await fs.remove(path.join(folderPath, fileName));
                logStatus("STATUS", "✓ File Destroyed", theme.success);
                await waitEnter();
              }
            }
            continue;
          }

          if (subChoice === "CREATE") {
            const name = await askInline("HOOK_NAME (e.g. Auth): ");
            if (name) {
              const finalName = name.startsWith("use") ? name : `use${name}`;
              await runForgingAnimation(`Synthesizing Hook: ${finalName}`);
              const ext = fs.existsSync(path.join(cwd, "tsconfig.json"))
                ? "ts"
                : "js";
              await fs.writeFile(
                path.join(folderPath, `${finalName}.${ext}`),
                `import { useState } from 'react';\n\nexport const ${finalName} = () => {\n  const [state, setState] = useState(null);\n  return { state, setState };\n};`
              );
              logStatus("STATUS", `✓ Hook ${finalName} created`, theme.success);
              await waitEnter();
            }
          }
        }
      }
    }

    // --- STORE FABRICATION (UPGRADED) ---
    else if (choice === "STORE") {
      const scopeOptions = [
        { value: "GLOBAL", label: "🌐  Global State (src/store)" },
        { value: "FEATURE", label: "🚀  Feature State (src/features)" },
        { value: "BACK", label: "⬅️   Return" },
      ];
      const scope = await renderMenu("STORE_SCOPE", scopeOptions, {
        PROJECT: projectName,
        ACTION: "SELECT_SCOPE",
      });
      if (scope === "BACK") continue;

      let rootDir = "";
      let locationLabel = "";

      if (scope === "GLOBAL") {
        rootDir = path.join(cwd, "src/store");
        locationLabel = "src/store";
      } else {
        const featureRoot = path.join(cwd, "src/features");
        await fs.ensureDir(featureRoot);
        const features = await getFolders(featureRoot);
        if (features.length === 0) {
          console.log(theme.warning("   ⚠ No features found."));
          await waitEnter();
          continue;
        }
        const featureOptions = features.map((f) => ({
          value: f,
          label: `📦 ${f}`,
        }));
        const selectedFeature = await renderMenu(
          "SELECT FEATURE",
          [...featureOptions, { value: "BACK", label: "⬅️ Return" }],
          { PROJECT: projectName, LOCATION: "src/features" }
        );
        if (selectedFeature === "BACK") continue;
        rootDir = path.join(featureRoot, selectedFeature, "store"); // Assuming 'store' folder in feature
        locationLabel = `src/features/${selectedFeature}/store`;
      }
      await fs.ensureDir(rootDir);

      while (true) {
        const folders = await getFolders(rootDir);
        const folderOptions = folders.map((s) => {
          const folderPath = path.join(rootDir, s);
          const files = fs.readdirSync(folderPath);
          const count = files.filter(
            (f) => f.endsWith(".js") || f.endsWith(".ts")
          ).length;
          const paddedName = s.padEnd(GRID_LABEL_WIDTH - 5);
          return {
            value: s,
            label: `${paddedName} ${theme.muted("│")}   ${count} stores`,
          };
        });

        const menuOptions = [
          ...folderOptions,
          { value: "---", label: "---" },
          { value: "NEW_FOLDER", label: "➕  Initiate New State Group" },
          { value: "BACK", label: "⬅️   Return" },
        ];
        const folderChoice = await renderMenu("STATE MANAGER", menuOptions, {
          PROJECT: projectName,
          LOCATION: locationLabel,
        });
        if (folderChoice === "BACK") break;

        if (folderChoice === "NEW_FOLDER") {
          const name = await askInline("GROUP_NAME (lowercase): ");
          if (name) {
            fs.ensureDirSync(path.join(rootDir, name));
            logStatus("STATUS", `✓ Group '${name}' established`, theme.success);
            await sleep(500);
          }
          continue;
        }

        let currentFolder = folderChoice;
        while (true) {
          const folderPath = path.join(rootDir, currentFolder);
          if (!fs.existsSync(folderPath)) break;
          const files = fs
            .readdirSync(folderPath)
            .filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
          const fileStats = files.map((f) => ({
            name: f,
            size: fs.statSync(path.join(folderPath, f)).size,
          }));
          const ALIGNMENT_OFFSET_FILE = GRID_LABEL_WIDTH - 8;
          const fileOptions = fileStats.map((f) => {
            const paddedName = f.name.padEnd(ALIGNMENT_OFFSET_FILE);
            return {
              value: `MANAGE:${f.name}`,
              label: `📦 ${paddedName} ${theme.muted("│")}   ${formatBytes(
                f.size
              )}`,
            };
          });

          let subMenu =
            fileOptions.length > 0
              ? [...fileOptions]
              : [{ value: "noop", label: theme.muted("(Empty Group)") }];
          subMenu.push(
            { value: "---", label: "---" },
            { value: "CREATE", label: "⚡  Initialize Store Here" },
            {
              value: "DELETE_FOLDER",
              label: "🗑️   Destroy Group",
              danger: true,
            },
            { value: "BACK", label: "⬅️   Return" }
          );

          const subChoice = await renderMenu(
            `GROUP: ${currentFolder.toUpperCase()}`,
            subMenu,
            {
              PROJECT: projectName,
              LOCATION: `${locationLabel}/${currentFolder}`,
            }
          );
          if (subChoice === "BACK") break;

          if (subChoice === "DELETE_FOLDER") {
            const confirm = await askInline(
              "CONFIRM_NUKE [y/n]: ",
              theme.dangerTag
            );
            if (confirm.toLowerCase() === "y") {
              await runDestructionAnimation("Incinerating Group");
              await fs.remove(path.join(rootDir, currentFolder));
              await waitEnter();
              break;
            }
            continue;
          }

          if (subChoice.startsWith("MANAGE:")) {
            const fileName = subChoice.split(":")[1];
            const action = await renderMenu(
              "FILE_GOVERNANCE",
              [
                { value: "DELETE", label: "🗑️   Destroy File", danger: true },
                { value: "BACK", label: "⬅️   Back" },
              ],
              { PROJECT: projectName, FILE: fileName }
            );
            if (action === "DELETE") {
              const confirm = await askInline(
                "CONFIRM [y/n]: ",
                theme.dangerTag
              );
              if (confirm.toLowerCase() === "y") {
                await fs.remove(path.join(folderPath, fileName));
                logStatus("STATUS", "✓ File Destroyed", theme.success);
                await waitEnter();
              }
            }
            continue;
          }

          if (subChoice === "CREATE") {
            const name = await askInline("STORE_NAME (e.g. Cart): ");
            if (name) {
              const finalName = name.startsWith("use")
                ? name
                : `use${name}Store`;
              await runForgingAnimation(`Initializing Store: ${finalName}`);
              const ext = fs.existsSync(path.join(cwd, "tsconfig.json"))
                ? "ts"
                : "js";
              await fs.writeFile(
                path.join(folderPath, `${finalName}.${ext}`),
                `import { create } from 'zustand';\n\nconst ${finalName} = create((set) => ({\n  data: null,\n  setData: (payload) => set({ data: payload }),\n}));\n\nexport default ${finalName};`
              );
              logStatus(
                "STATUS",
                `✓ Store ${finalName} created`,
                theme.success
              );
              await waitEnter();
            }
          }
        }
      }
    }
  }
};

// --- HYBRID EXECUTION ---
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const main = async () => {
    const cwd = process.cwd();
    await runFabricator(cwd, true);
  };
  main().catch(console.error);
}
