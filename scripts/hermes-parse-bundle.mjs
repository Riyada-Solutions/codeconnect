import fs from "node:fs";
import { parse } from "hermes-parser";

const t = fs.readFileSync(new URL("../_b.js", import.meta.url), "utf8");
try {
  parse(t, { sourceType: "script", babel: true });
  console.log("hermes-parser: OK");
} catch (e) {
  console.error(String(e.message || e));
  if (e.loc) console.error("loc", e.loc);
}
