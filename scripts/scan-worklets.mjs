import fs from "node:fs";

const t = fs.readFileSync(new URL("../_b.js", import.meta.url), "utf8");
const re = /code: "((?:[^"\\]|\\.)*)"/g;
let m;
let n = 0;
while ((m = re.exec(t))) {
  const code = JSON.parse(`"${m[1]}"`);
  if (!code.startsWith("function")) continue;
  try {
    new Function(code);
  } catch (e) {
    console.log("FAIL", e.message);
    console.log(code.slice(0, 240));
  }
  n++;
}
console.log("checked function worklets", n);
