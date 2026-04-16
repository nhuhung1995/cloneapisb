import { normalizeMode } from "../_lib/shape.js";
import { readOfflineMaster } from "../_lib/offline-master.js";
import { readCache, cacheSearch } from "../_lib/cache-store.js";
import { ADDRESS_BY_ZIP } from "../internal/_data.js";
import { sbSearchAddress } from "../_lib/sb-client.js";

function getLocalAddresses(zip) {
  const cache = readCache();
  if (Array.isArray(cache.searchByZip[zip]) && cache.searchByZip[zip].length > 0) {
    return { addresses: cache.searchByZip[zip], source: "cache" };
  }

  const master = readOfflineMaster();
  if (Array.isArray(master.byZip[zip]) && master.byZip[zip].length > 0) {
    return { addresses: master.byZip[zip], source: "offline-master", version: master.version };
  }

  const snap = ADDRESS_BY_ZIP[zip] || [];
  return { addresses: snap, source: snap.length ? "snapshot" : "empty" };
}

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

  const mode = normalizeMode(req.query?.mode);
  const local = getLocalAddresses(zip);

  if (mode === "offline") {
    res.status(200).json(local);
    return;
  }

  if (mode === "hybrid" && Array.isArray(local.addresses) && local.addresses.length > 0) {
    res.status(200).json(local);
    return;
  }

  const live = await sbSearchAddress(zip);
  if (live.ok) {
    cacheSearch(zip, live.data?.addresses || []);
    res.status(200).json({ ...(live.data || {}), source: mode === "hybrid" ? "live-refresh" : "live" });
    return;
  }

  if (mode === "hybrid") {
    res.status(200).json({ ...local, source: `${local.source}-fallback`, liveError: live.data });
    return;
  }

  res.status(live.status).json(live.data);
}
