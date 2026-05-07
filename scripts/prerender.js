import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const pages = [
  { url: "/", out: "dist/index.html" },
  { url: "/terms", out: "dist/terms/index.html" },
];

async function main() {
  const template = fs.readFileSync(path.join(root, "dist/index.html"), "utf-8");
  const { render } = await import(path.join(root, "dist-ssr/entry-server.js"));

  for (const { url, out } of pages) {
    const appHtml = render(url, "en");
    const html = template.replace("<!--ssr-outlet-->", appHtml);
    const outPath = path.join(root, out);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html);
    console.log(`✓ ${out}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
