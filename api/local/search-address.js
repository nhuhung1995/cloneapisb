import { ADDRESS_BY_ZIP } from "../internal/_data.js";
import { readOfflineMaster } from "../_lib/offline-master.js";
import { readCache } from "../_lib/cache-store.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const zip = String(req.query?.zip || "").replace(/\D/g, "");
  if (!/^\d{7}$/.test(zip)) {
    res.status(400).json({ error: "zip must be 7 digits", code: "E00010" });
    return;
  }

  const cache = readCache();
  if (Array.isArray(cache.searchByZip[zip]) && cache.searchByZip[zip].length > 0) {
    res.status(200).json({ addresses: cache.searchByZip[zip], source: "cache" });
    return;
  }

  const master = readOfflineMaster();
  if (Array.isArray(master.byZip[zip]) && master.byZip[zip].length > 0) {
    res.status(200).json({ addresses: master.byZip[zip], source: "offline-master", version: master.version });
    return;
  }

  const snap = ADDRESS_BY_ZIP[zip] || [];
  res.status(200).json({ addresses: snap, source: snap.length ? "snapshot" : "empty" });
}
