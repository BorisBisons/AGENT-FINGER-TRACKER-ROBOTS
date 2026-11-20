// Regenerates the accessory-recognition text embeddings embedded in index.html
// (<script id="wearData">). Run:  npm i @huggingface/transformers && node tools/build-wear-data.mjs
// Prompts are embedded once here with the MobileCLIP text tower, so the browser only
// has to download the (much smaller) vision tower.
import { AutoTokenizer, CLIPTextModelWithProjection } from "@huggingface/transformers";
import { readFileSync, writeFileSync } from "node:fs";

const MODEL = "Xenova/mobileclip_s0";
// Each group is a softmax over mutually exclusive options plus the shared NULLS ("nothing to report").
const GROUPS = [
  { key: "eyes", opts: [["GLASSES", "a photo of a person wearing eyeglasses"], ["SUNGLASSES", "a photo of a person wearing dark sunglasses"], [null, "a photo of a person's face with bare eyes and no glasses"]] },
  { key: "head", opts: [["CAP", "a photo of a person wearing a baseball cap"], ["BEANIE", "a photo of a person wearing a beanie"], ["HAT", "a photo of a person wearing a hat with a brim"], ["HOOD", "a photo of a person with a hood pulled over their head"], ["HEADSCARF", "a photo of a person wearing a headscarf"], [null, "a photo of a person with a bare head and nothing on it"]] },
  { key: "ears", opts: [["HEADPHONES", "a photo of a person wearing over-ear headphones"], ["EARBUDS", "a photo of a person with wireless earbuds in their ears"], [null, "a photo of a person with nothing on their ears"]] },
  { key: "mask", opts: [["FACE MASK", "a photo of a person wearing a face mask over the nose and mouth"], [null, "a photo of a person with an uncovered nose and mouth"]] },
  { key: "hair", opts: [["BEARD", "a photo of a person with a beard"], ["MUSTACHE", "a photo of a person with a mustache and no beard"], [null, "a photo of a person with a clean-shaven face"]] },
];
const NULLS = ["a photo of a person", "a close-up photo of a face", "a portrait of a person looking at the camera"];

const tok = await AutoTokenizer.from_pretrained(MODEL);
const model = await CLIPTextModelWithProjection.from_pretrained(MODEL, { dtype: "fp32" });
const prompts = [...GROUPS.flatMap(g => g.opts.map(o => o[1])), ...NULLS];
const { text_embeds } = await model(tok(prompts, { padding: "max_length", truncation: true }));
const dim = text_embeds.dims[1];
const bytes = new Int8Array(prompts.length * dim);          // int8 per row; the page re-normalises
for (let r = 0; r < prompts.length; r++) {
  const row = text_embeds.data.slice(r * dim, (r + 1) * dim);
  const max = row.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
  for (let i = 0; i < dim; i++) bytes[r * dim + i] = Math.round((row[i] / max) * 127);
}
const data = { model: MODEL, dim, nulls: NULLS.length, groups: GROUPS.map(g => ({ key: g.key, labels: g.opts.map(o => o[0]) })), emb: Buffer.from(bytes.buffer).toString("base64") };
const file = new URL("../index.html", import.meta.url);
const html = readFileSync(file, "utf8");
const re = /(<script id="wearData" type="application\/json">)[\s\S]*?(<\/script>)/;
if (!re.test(html)) throw new Error("wearData script tag not found in index.html");
writeFileSync(file, html.replace(re, `$1${JSON.stringify(data)}$2`));
console.log(`wrote ${prompts.length} embeddings (${dim}d) into index.html`);
