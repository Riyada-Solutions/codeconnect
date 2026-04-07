const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

const shimPath = path.join(projectRoot, "shims", "expo-local-authentication.js");

function realExpoLocalAuthInstalled() {
  try {
    require.resolve("expo-local-authentication", { paths: [projectRoot] });
    return true;
  } catch {
    return false;
  }
}

const upstreamResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "expo-local-authentication" && !realExpoLocalAuthInstalled()) {
    return { type: "sourceFile", filePath: shimPath };
  }
  if (typeof upstreamResolveRequest === "function") {
    return upstreamResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
