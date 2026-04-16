import fs from "node:fs";
import { parse } from "hermes-parser";

const t = fs.readFileSync(new URL("../_b.js", import.meta.url), "utf8");
const re = /code: "((?:[^"\\]|\\.)*)"/g;
let m;
let n = 0;
while ((m = re.exec(t))) {
  const code = JSON.parse(`"${m[1]}"`);
  if (!code.startsWith("function")) continue;
  try {
    parse(code, { sourceType: "script", babel: true });
  } catch (e) {
    console.log("FAIL", e.message);
    console.log(code.slice(0, 300));
  }
  n++;
}
console.log("checked", n);
