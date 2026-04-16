import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CACHE_PATH = path.join(ROOT, "data", "cache", "live-cache.json");

let memoryCache = null;

function ensureShape(raw) {
  const obj = raw && typeof raw === "object" ? raw : {};
  return {
    version: obj.version || "1",
    updatedAt: obj.updatedAt || new Date(0).toISOString(),
    searchByZip: obj.searchByZip || {},
    detailKbn1: obj.detailKbn1 || {},
    detailKbn2: obj.detailKbn2 || {},
    detailKbn3: obj.detailKbn3 || {}
  };
}

export function readCache() {
  if (memoryCache) return memoryCache;
  try {
    if (!fs.existsSync(CACHE_PATH)) {
      memoryCache = ensureShape({});
      return memoryCache;
    }
    const text = fs.readFileSync(CACHE_PATH, "utf8");
    memoryCache = ensureShape(text ? JSON.parse(text) : {});
    return memoryCache;
  } catch {
    memoryCache = ensureShape({});
    return memoryCache;
  }
}

export function writeCache(next) {
  const normalized = ensureShape(next);
  normalized.updatedAt = new Date().toISOString();
  memoryCache = normalized;
  try {
    fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
    fs.writeFileSync(CACHE_PATH, JSON.stringify(normalized, null, 2), "utf8");
  } catch {
    // Vercel runtime may be read-only. Keep in-memory cache only.
  }
  return normalized;
}

export function cacheSearch(zip, addresses) {
  const cache = readCache();
  cache.searchByZip[String(zip)] = Array.isArray(addresses) ? addresses : [];
  return writeCache(cache);
}

export function cacheDetailKbn1(addressCode, choume, addressBanchiList) {
  const key = `${addressCode}|${choume || ""}`;
  const cache = readCache();
  cache.detailKbn1[key] = Array.isArray(addressBanchiList) ? addressBanchiList : [];
  return writeCache(cache);
}

export function cacheDetailKbn2(addressCode, choume, banchi, addressGoList) {
  const key = `${addressCode}|${choume || ""}|${banchi || ""}`;
  const cache = readCache();
  cache.detailKbn2[key] = Array.isArray(addressGoList) ? addressGoList : [];
  return writeCache(cache);
}

export function cacheDetailKbn3(addressCode, choume, banchi, go, buildingCandidates) {
  const key = `${addressCode}|${choume || ""}|${banchi || ""}|${go || ""}`;
  const cache = readCache();
  cache.detailKbn3[key] = Array.isArray(buildingCandidates) ? buildingCandidates : [];
  return writeCache(cache);
}
