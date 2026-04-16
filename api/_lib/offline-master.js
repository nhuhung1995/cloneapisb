import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const MASTER_PATH = path.join(ROOT, "data", "offline", "ken_all_master.json");

let master = null;

function normalize(raw) {
  const obj = raw && typeof raw === "object" ? raw : {};
  return {
    version: obj.version || "seed",
    generatedAt: obj.generatedAt || new Date(0).toISOString(),
    byZip: obj.byZip || {}
  };
}

export function readOfflineMaster() {
  if (master) return master;
  try {
    if (!fs.existsSync(MASTER_PATH)) {
      master = normalize({});
      return master;
    }
    const text = fs.readFileSync(MASTER_PATH, "utf8");
    master = normalize(text ? JSON.parse(text) : {});
    return master;
  } catch {
    master = normalize({});
    return master;
  }
}
