#!/usr/bin/env node

import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";

// --- CONFIGURATION ---
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VERSION = "5.6.1-omnimerge-hardened-fix";
const CACHE_FILE = path.join(
  process.platform === "win32" ? process.env.TEMP : "/tmp",
  ".omni_context_cache"
);

// --- [SECURITY] LIMITS & BLOCKS ---
const LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_TOTAL_SIZE: 50 * 1024 * 1024, // 50MB
};

// Exact filename matches to block
const BLOCKED_FILES = new Set([
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  ".env",
  ".env.local",
  ".env.production",
  ".env.development",
  ".DS_Store",
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".vscode",
  ".idea",
]);

// Extension matches to block
const BLOCKED_EXTENSIONS = new Set([
  ".key",
  ".pem",
  ".crt",
  ".cer",
  ".p12",
  ".pfx", // Certs
  ".exe",
  ".dll",
  ".so",
  ".dylib",
  ".bin", // Binaries
  ".zip",
  ".tar",
  ".gz",
  ".7z",
  ".rar", // Archives
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".ico",
  ".webp",
  ".avif", // Images
  ".mp4",
  ".mov",
  ".avi",
  ".mp3",
  ".wav", // Media
]);

// --- [THEME] ROYAL LIGHT MODE ---
const theme = {
  primary: chalk.hex("#0033CC").bold,
  secondary: chalk.hex("#4D0099").bold,
  success: chalk.hex("#006600").bold,
  warning: chalk.hex("#CC6600").bold,
  danger: chalk.hex("#CC0000").bold,
  text: chalk.hex("#000000"),
  muted: chalk.hex("#555555"),
  accent: chalk.hex("#008899"),
  tag: chalk.bgCyan.black.bold,
  header: chalk.bgHex("#0033CC").white.bold,
};

const GRID_LABEL_WIDTH = 24;

// [SPEED FIX] Allowlist Ekstensi for Binary Check Optimization
const TEXT_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".json",
  ".css",
  ".scss",
  ".html",
  ".md",
  ".txt",
  ".svg",
  ".xml",
  ".env.example",
  ".gitignore",
  ".java",
  ".py",
  ".cpp",
  ".c",
  ".h",
]);

// --- UTILITIES ---
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const clearScreen = () => {
  process.stdout.write("\x1B[2J\x1B[0f");
};

// [FIX] Added missing printHeader function
const printHeader = async (protocolName, meta = {}) => {
  clearScreen();

  const formatLine = (key, val) => {
    const displayVal = val || theme.muted("[ .empty ]");
    return `   ${theme.muted(key.padEnd(GRID_LABEL_WIDTH))} ${theme.muted(
      "│"
    )} ${displayVal}`;
  };

  console.log(formatLine("SYSTEM_TIME", new Date().toLocaleTimeString()));
  console.log(formatLine("PROTOCOL", protocolName));

  Object.keys(meta).forEach((k) => {
    console.log(formatLine(k.toUpperCase(), meta[k]));
  });

  console.log(theme.muted("   ────────────────────────────────────────"));
  console.log("");
};

// [UPDATED] Robust Binary Check
const isBinary = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  // 1. Fast Pass: Known Text
  if (TEXT_EXTENSIONS.has(ext)) return false;

  // 2. Fast Pass: Known Binary Extensions (Blocked)
  if (BLOCKED_EXTENSIONS.has(ext)) return true;

  // 3. Slow Pass: Content Inspection
  try {
    const buffer = Buffer.alloc(4096); // Check first 4KB
    const fd = await fs.open(filePath, "r");
    const { bytesRead } = await fs.read(fd, buffer, 0, 4096, 0);
    await fs.close(fd);

    // Check for null bytes
    for (let i = 0; i < bytesRead; i++) {
      if (buffer[i] === 0) return true;
    }
    return false;
  } catch (e) {
    return false; // Assume text if cant read (will fail later gracefully)
  }
};

const askInline = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);

  return new Promise((resolve) => {
    const prompt = `   ${theme.primary("●")} ${theme.tag(
      query.padEnd(GRID_LABEL_WIDTH - 2)
    )} ${theme.muted(":")} `;
    const keyHandler = (str, key) => {
      if (key.name === "escape") process.exit(0);
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

const waitEnter = (message) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  return new Promise((resolve) => {
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

// --- VISUAL ENGINE ---

const renderMenu = async (protocol, options, meta = {}) => {
  let selectedIndex = 0;
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });
  process.stdout.write("\x1B[?25l");

  const formatLine = (key, val) =>
    `   ${theme.muted(key.padEnd(GRID_LABEL_WIDTH))} ${theme.primary(
      "║"
    )} ${theme.text(val || "—")}`;

  process.stdout.write("\x1B[2J\x1B[0f");
  console.log("");
  console.log(`   ${theme.header(`  ${protocol}  `)}`);
  console.log("");
  if (meta.LOCATION) console.log(formatLine("LOCATION", meta.LOCATION));
  Object.keys(meta).forEach((k) => {
    if (k !== "PWD" && k !== "LOCATION") console.log(formatLine(k, meta[k]));
  });
  console.log(theme.muted("   ════════════════════════════════════════"));
  console.log("");

  const menuStartRow =
    6 + Object.keys(meta).filter((k) => k !== "PWD" && k !== "LOCATION").length;

  const renderItems = () => {
    readline.cursorTo(process.stdout, 0, menuStartRow);
    options.forEach((opt, idx) => {
      readline.clearLine(process.stdout, 0);
      if (opt.label === "---") {
        console.log(theme.muted(`      ────────────────`));
      } else {
        const isSelected = idx === selectedIndex;
        const pointer = isSelected ? theme.primary(">") : " ";
        const label = isSelected
          ? theme.primary(opt.label)
          : theme.text(opt.label);
        console.log(`      ${pointer} ${label}`);
      }
    });
    console.log("");
    readline.clearLine(process.stdout, 0);
    console.log(theme.muted("      [↑/↓] Navigate   [ENTER] Select"));
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
        } while (options[selectedIndex].label === "---");
        renderItems();
      } else if (key.name === "down") {
        do {
          selectedIndex =
            selectedIndex < options.length - 1 ? selectedIndex + 1 : 0;
        } while (options[selectedIndex].label === "---");
        renderItems();
      } else if (key.name === "return") {
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

const renderMultiSelect = async (protocol, options) => {
  let selectedIndex = 0;
  let selectedItems = new Set();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });
  process.stdout.write("\x1B[?25l");
  process.stdout.write("\x1B[2J\x1B[0f");

  console.log("");
  console.log(`   ${theme.header(`  ${protocol}  `)}`);
  console.log(theme.muted("   ════════════════════════════════════════"));
  console.log("");
  console.log(theme.primary(`   ▼ SELECT SOURCES:`));
  console.log("");

  const menuStartRow = 6;
  const renderItems = () => {
    readline.cursorTo(process.stdout, 0, menuStartRow);
    const hasSelection = Array.from(selectedItems).some(
      (i) => i !== "ALL" && i !== "BACK" && i !== "EXECUTE_MERGE"
    );

    options.forEach((opt, idx) => {
      readline.clearLine(process.stdout, 0);
      const isSelected = idx === selectedIndex;

      if (opt.value === "EXECUTE_MERGE") {
        console.log("");
        readline.clearLine(process.stdout, 0);
        let buttonLabel = hasSelection
          ? "[ MERGE ]"
          : "[ Select File To Merge ]";
        if (isSelected) {
          const label = hasSelection
            ? theme.success(`  ${buttonLabel}  `)
            : theme.danger(`  ${buttonLabel}  `);
          console.log(`      ${label}`);
        } else {
          const label = hasSelection
            ? theme.primary(`  ${buttonLabel}  `)
            : chalk.gray(`  ${buttonLabel}  `);
          console.log(`      ${label}`);
        }
        return;
      }

      let pointer = isSelected ? theme.primary(">") : " ";
      let label = isSelected
        ? theme.primary.bold(opt.label)
        : theme.text(opt.label);
      let checkbox = "";

      if (opt.value === "BACK") {
        label = isSelected ? theme.warning(opt.label) : theme.muted(opt.label);
        console.log(`      ${pointer} ${label}`);
      } else {
        const isChecked = selectedItems.has(opt.value);
        checkbox = isChecked ? theme.success("[+]") : theme.muted("[ ]");
        console.log(`      ${pointer} ${checkbox} ${label}`);
      }
    });
    console.log("");
    readline.clearLine(process.stdout, 0);
    console.log(theme.muted("      [Enter] Select/Toggle   [ESC] Cancel"));
  };

  renderItems();

  return new Promise((resolve) => {
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    process.stdin.resume();
    const handleKey = (ch, key) => {
      if (!key) return;
      const hasSelection = Array.from(selectedItems).some(
        (i) => i !== "ALL" && i !== "BACK" && i !== "EXECUTE_MERGE"
      );

      if (key.name === "up") {
        let nextIndex = selectedIndex;
        do {
          nextIndex = nextIndex > 0 ? nextIndex - 1 : options.length - 1;
          if (options[nextIndex].value === "EXECUTE_MERGE" && !hasSelection)
            continue;
          break;
        } while (true);
        selectedIndex = nextIndex;
        renderItems();
      } else if (key.name === "down") {
        let nextIndex = selectedIndex;
        do {
          nextIndex = nextIndex < options.length - 1 ? nextIndex + 1 : 0;
          if (options[nextIndex].value === "EXECUTE_MERGE" && !hasSelection)
            continue;
          break;
        } while (true);
        selectedIndex = nextIndex;
        renderItems();
      } else if (key.name === "return") {
        const val = options[selectedIndex].value;
        if (val === "EXECUTE_MERGE") {
          if (hasSelection) {
            cleanup();
            resolve(
              Array.from(selectedItems).filter(
                (i) => i !== "ALL" && i !== "BACK" && i !== "EXECUTE_MERGE"
              )
            );
          }
          return;
        }
        if (val === "BACK") {
          cleanup();
          resolve("BACK_ACTION");
          return;
        }
        if (val === "ALL") {
          const allFiles = options
            .filter(
              (o) =>
                o.value !== "ALL" &&
                o.value !== "BACK" &&
                o.value !== "EXECUTE_MERGE"
            )
            .map((o) => o.value);
          if (selectedItems.has("ALL")) {
            selectedItems.clear();
          } else {
            selectedItems.add("ALL");
            allFiles.forEach((f) => selectedItems.add(f));
          }
        } else {
          if (selectedItems.has(val)) {
            selectedItems.delete(val);
            selectedItems.delete("ALL");
          } else {
            selectedItems.add(val);
          }
        }
        renderItems();
      } else if (key.name === "escape" || (key.name === "c" && key.ctrl)) {
        cleanup();
        resolve(null);
      }
    };
    const cleanup = () => {
      if (process.stdin.isTTY) process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.removeListener("keypress", handleKey);
      rl.close();
      process.stdout.write("\x1B[?25h");
    };
    process.stdin.on("keypress", handleKey);
  });
};

const renderProgressBar = (current, total, label) => {
  const width = 25;
  const percentage =
    total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
  const filled = Math.round((width * percentage) / 100);
  const empty = width - filled;
  const bar =
    theme.primary("/".repeat(filled)) + theme.muted("-".repeat(empty));
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(
    `   ${theme.accent("⠋")}  ${label.padEnd(20)} [${bar}] ${percentage}%`
  );
};

// --- CORE MERGER LOGIC ---
export const runMerger = async (cwd, directMode = false) => {
  let currentOutFile = null;

  try {
    if (fs.existsSync(CACHE_FILE)) {
      const cached = fs.readFileSync(CACHE_FILE, "utf8").trim();
      if (fs.existsSync(path.join(cwd, cached))) currentOutFile = cached;
    }
  } catch (e) {}

  while (true) {
    if (!currentOutFile) {
      // [FIX] Now printHeader is defined
      await printHeader("INITIAL SETUP", {
        PROTOCOL: "KNOWLEDGE_MERGER",
        STATUS: "CONFIGURATION_REQUIRED",
      });
      console.log(
        theme.text("   Please define where the merged code should be stored.\n")
      );
      let inputName = await askInline(
        "TARGET_FILENAME (default: omni-context.txt): "
      );
      inputName = inputName.trim() || "omni-context.txt";
      if (!inputName.startsWith("omni-")) inputName = `omni-${inputName}`;
      if (!inputName.endsWith(".txt")) inputName += ".txt";
      currentOutFile = inputName;
      try {
        fs.writeFileSync(CACHE_FILE, currentOutFile);
        if (!fs.existsSync(path.join(cwd, currentOutFile)))
          fs.writeFileSync(path.join(cwd, currentOutFile), "");
      } catch (e) {}
    }

    const exists = fs.existsSync(path.join(cwd, currentOutFile));
    const stats = exists ? fs.statSync(path.join(cwd, currentOutFile)) : null;
    const lastUpdate = stats
      ? new Date(stats.mtime).toLocaleTimeString()
      : "Ready";
    const fileSize = stats ? (stats.size / 1024).toFixed(2) + " KB" : "0 KB";

    const options = [
      { value: "MERGE_ALL", label: "⚡ Merge All" },
      { value: "SINGLE_MERGE", label: "📂 Single Merge" },
      { value: "CONFIG", label: `⚙️  File Configuration` },
      { value: "EXIT", label: "Close" },
    ];

    const choice = await renderMenu("OMNIMERGE ENGINE", options, {
      NAME: currentOutFile,
      LOCATION: path.basename(cwd) + "/",
      LAST_UPDATE: lastUpdate,
      SIZE: fileSize,
    });

    if (choice === "EXIT") {
      if (directMode) process.exit(0);
      return;
    }

    if (choice === "CONFIG") {
      const configOptions = [
        { value: "RENAME", label: "✏️  Rename Target" },
        { value: "REMOVE", label: "🗑️  Remove & Reset Context" },
        { value: "BACK", label: "⬅️  Back to Menu" },
      ];
      const configAction = await renderMenu(
        "FILE CONFIGURATION",
        configOptions,
        { CURRENT_TARGET: currentOutFile }
      );
      if (configAction === "BACK") continue;
      if (configAction === "RENAME") {
        const newNameInput = await askInline("NEW_FILENAME: ");
        if (newNameInput) {
          const finalName = newNameInput.endsWith(".txt")
            ? newNameInput
            : `${newNameInput}.txt`;
          try {
            fs.renameSync(
              path.join(cwd, currentOutFile),
              path.join(cwd, finalName)
            );
            currentOutFile = finalName;
            fs.writeFileSync(CACHE_FILE, currentOutFile);
          } catch (e) {}
        }
      }
      if (configAction === "REMOVE") {
        try {
          fs.unlinkSync(path.join(cwd, currentOutFile));
          fs.unlinkSync(CACHE_FILE);
          currentOutFile = null;
        } catch (e) {}
      }
      continue;
    }

    let selectedDirs = [];
    if (choice === "MERGE_ALL") {
      const defaults = [
        "src",
        "public",
        "app",
        "components",
        "pages",
        "utils",
        "hooks",
        "store",
        "lib",
        "test",
      ];
      const allDirs = fs
        .readdirSync(cwd)
        .filter((f) => fs.statSync(path.join(cwd, f)).isDirectory());
      selectedDirs = allDirs.filter((d) => defaults.includes(d));
    }

    if (choice === "SINGLE_MERGE") {
      const ignoreList = [
        "node_modules",
        ".git",
        "dist",
        "build",
        "coverage",
        ".vscode",
        ".idea",
      ];
      const allDirs = fs
        .readdirSync(cwd)
        .filter(
          (f) =>
            fs.statSync(path.join(cwd, f)).isDirectory() &&
            !f.startsWith(".") &&
            !ignoreList.includes(f)
        );
      const items = [
        { value: "ALL", label: "All" },
        ...allDirs.map((d) => ({ value: d, label: d })),
        { value: "EXECUTE_MERGE", label: "MERGE SELECTED" },
        { value: "BACK", label: "<- back to menu" },
      ];
      const result = await renderMultiSelect("FOLDER SELECTION", items);
      if (result === "BACK_ACTION" || !result) continue;
      selectedDirs = result;
    }

    if (!selectedDirs || selectedDirs.length === 0) continue;

    // --- MERGE PROCESS (HARDENED) ---
    clearScreen();
    console.log("");
    console.log(theme.primary(">> AGGREGATING KNOWLEDGE BASE..."));

    let totalFiles = 0;
    let totalSize = 0;
    const allFiles = [];
    let skippedFiles = 0;

    // [STABILITY] Parallel Counting with Promise.all
    const scanDir = async (dir) => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        await Promise.all(
          entries.map(async (entry) => {
            const fullPath = path.join(dir, entry.name);
            const relativePath = path.relative(cwd, fullPath);

            // [SECURITY] Sanitization: Path Traversal Check
            if (relativePath.includes("..")) {
              return;
            }

            // [SECURITY] Sensitive File Detection
            if (
              BLOCKED_FILES.has(entry.name) ||
              BLOCKED_EXTENSIONS.has(path.extname(entry.name).toLowerCase())
            ) {
              skippedFiles++;
              return;
            }

            if (entry.isDirectory()) {
              await scanDir(fullPath);
            } else {
              // [STABILITY] Graceful Degradation on Stat
              try {
                const stat = await fs.stat(fullPath);

                // [SECURITY] File Size Limit (10MB)
                if (stat.size > LIMITS.MAX_FILE_SIZE) {
                  skippedFiles++; // Skip oversized files
                  return;
                }

                // Check Binary
                if (path.basename(fullPath) === currentOutFile) return;
                if (!(await isBinary(fullPath))) {
                  allFiles.push({ path: fullPath, size: stat.size });
                  totalFiles++;
                  totalSize += stat.size;
                } else {
                  skippedFiles++;
                }
              } catch (e) {
                // Ignore file stat errors
              }
            }
          })
        );
      } catch (e) {
        // Ignore directory read errors
      }
    };

    process.stdout.write(
      theme.muted("   :: Analyzing filesystem (Parallel Scan)...")
    );
    await Promise.all(selectedDirs.map((d) => scanDir(path.join(cwd, d))));
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);

    // [SECURITY] Total Size Limit Check
    if (totalSize > LIMITS.MAX_TOTAL_SIZE) {
      console.log("\n");
      console.log(
        theme.danger("   ⚠ OPERATION HALTED: TOTAL SIZE LIMIT EXCEEDED")
      );
      console.log(
        theme.text(
          `   Total size (${(totalSize / 1024 / 1024).toFixed(
            2
          )}MB) exceeds limit (${LIMITS.MAX_TOTAL_SIZE / 1024 / 1024}MB).`
        )
      );
      console.log(
        theme.muted(
          "   Please select fewer directories or exclude large assets."
        )
      );
      await waitEnter("Press Enter to continue...");
      continue;
    }

    // 2. Streaming Phase
    const writeStream = fs.createWriteStream(path.join(cwd, currentOutFile), {
      flags: "w",
    });
    let processed = 0;

    for (const fileObj of allFiles) {
      const file = fileObj.path;
      const relativePath = path.relative(cwd, file);

      writeStream.write(
        `\n// --------------------------------------------------------\n// FILE: ${relativePath}\n// --------------------------------------------------------\n`
      );

      // [STABILITY] Graceful Read
      try {
        const content = await fs.readFile(file);
        writeStream.write(content);
        writeStream.write(`\n`);
      } catch (e) {
        writeStream.write(`// [ERROR] Could not read file content.\n`);
      }

      processed++;
      if (processed % 5 === 0 || processed === totalFiles) {
        renderProgressBar(
          processed,
          totalFiles,
          theme.accent("Streaming assets:")
        );
      }
    }

    writeStream.end();
    await new Promise((resolve) => writeStream.on("finish", resolve));

    console.log("\n");
    console.log(theme.muted("   ════════════════════════════════════════"));
    console.log(`   ${theme.success("✔ MERGE COMPLETE")}`);
    console.log(
      `   ${theme.text("Files Processed:".padEnd(20))} ${theme.primary.bold(
        processed
      )}`
    );
    console.log(
      `   ${theme.text("Files Skipped:".padEnd(20))} ${theme.warning.bold(
        skippedFiles
      )}`
    );

    // [STABILITY] Check final output
    try {
      const finalStat = fs.statSync(path.join(cwd, currentOutFile));
      console.log(
        `   ${theme.text("Total Size:".padEnd(20))} ${theme.primary.bold(
          (finalStat.size / 1024).toFixed(2) + " KB"
        )}`
      );
    } catch (e) {
      console.log(
        `   ${theme.text("Total Size:".padEnd(20))} ${theme.muted("Unknown")}`
      );
    }

    console.log(theme.muted("   ════════════════════════════════════════\n"));

    await waitEnter("Press Enter To Return . . .");
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const main = async () => {
    const cwd = process.cwd();
    await runMerger(cwd, true);
  };
  main().catch(console.error);
}
