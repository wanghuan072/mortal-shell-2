/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const Module = require("node:module");

const root = path.resolve(__dirname, "../..");
const sourceRoot = path.join(root, "src");
const outputRoot = path.join(sourceRoot, "data", "wiki");
const resolveFilename = Module._resolveFilename;

Module._resolveFilename = function resolveAlias(request, parent, isMain, options) {
  const resolved = request.startsWith("@/") ? path.join(sourceRoot, request.slice(2)) : request;
  return resolveFilename.call(this, resolved, parent, isMain, options);
};

require.extensions[".ts"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  module._compile(output, filename);
};

const reference = (name) => require(path.join(root, "scripts", "data", "source", `${name}.ts`));
const weaponData = require(path.join(sourceRoot, "lib", "data", "weapons.ts"));
const media = reference("equipmentMedia");
const weaponSource = reference("weapon").weapons;

const clean = (record, keys) => Object.fromEntries(Object.entries(record).filter(([key]) => !keys.has(key)));
const normalize = ({ record, category, description, status, image }) => ({
  id: record.id,
  name: record.name,
  category,
  description: description || record.description || record.tagline || record.name,
  status: status || record.status || record.availability || "Verified",
  image: image ?? record.image ?? null,
  details: clean(record, new Set(["id", "name", "description", "tagline", "image", "status", "availability"])),
  notes: [],
});

const collections = {
  weapons: weaponSource.map((record) => {
    const pageRecord = weaponData.weapons.find((entry) => entry.id === record.id);
    return normalize({
      record: {
        ...record,
        slug: pageRecord?.slug ?? record.id,
        type: pageRecord?.type ?? record.family,
        imagePosition: pageRecord?.imagePosition,
        verification: pageRecord?.verification ?? "Verified in Open Beta data",
      },
      category: `${record.family} · Weapon`,
      image: record.image ?? media.getEquipmentImage("weapon", record.id) ?? pageRecord?.image,
      status: pageRecord?.verification ?? "Verified in Open Beta data",
    });
  }),
  shells: reference("shell").shells.map((record) => normalize({
    record,
    category: `${record.title} · Shell`,
    description: record.tagline,
    image: `/assets/shells/${record.id}.png`,
  })),
  sidearms: reference("sidearm").sidearms.map((record) => normalize({
    record,
    category: `${record.family} · Sidearm`,
    image: media.getEquipmentImage("sidearm", record.id),
  })),
  items: reference("item").items.map((record) => normalize({ record, category: record.category, image: record.image })),
  artifacts: reference("artifact").artifacts.map((record) => normalize({ record, category: record.family, image: record.image })),
  tarstones: reference("tarstone").tarstones.map((record) => normalize({ record, category: `${record.slot} · ${record.effectType}`, image: record.image })),
  seals: reference("seal").seals.map((record) => normalize({ record, category: `${record.ability} · Seal`, image: record.image })),
  skills: reference("skill").skills.map((record) => normalize({ record, category: `${record.type} · ${record.owner}`, image: record.image })),
};

fs.mkdirSync(outputRoot, { recursive: true });
for (const [name, records] of Object.entries(collections)) {
  fs.writeFileSync(path.join(outputRoot, `${name}.json`), `${JSON.stringify(records, null, 2)}\n`);
}
