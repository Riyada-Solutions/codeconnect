const path = require("path");
const { spawn } = require("child_process");

const projectRoot = path.resolve(__dirname, "..");

const env = { ...process.env };
const replitExpoDomain = process.env.REPLIT_EXPO_DEV_DOMAIN;
if (replitExpoDomain) {
  env.EXPO_PACKAGER_PROXY_URL = `https://${replitExpoDomain}`;
}
if (process.env.REPLIT_DEV_DOMAIN) {
  env.EXPO_PUBLIC_DOMAIN = process.env.REPLIT_DEV_DOMAIN;
  env.REACT_NATIVE_PACKAGER_HOSTNAME = process.env.REPLIT_DEV_DOMAIN;
}
if (process.env.REPL_ID) {
  env.EXPO_PUBLIC_REPL_ID = process.env.REPL_ID;
}

const port = process.env.PORT || "8081";

const child = spawn("pnpm", ["exec", "expo", "start", "--localhost", "--port", port], {
  cwd: projectRoot,
  env,
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 1);
  }
});
