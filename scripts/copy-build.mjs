import fs from "fs-extra";

const source = "./build/index.html";
const destination = "./apps-script/index.html";

await fs.copy(source, destination);

console.log("✓ Svelte build copied to Apps Script");
