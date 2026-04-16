import { ADDRESS_DETAIL_BY_CODE } from "../internal/_data.js";
import { readCache } from "../_lib/cache-store.js";

function key1(addressCode, choume) {
  return `${addressCode}|${choume || ""}`;
}

function key2(addressCode, choume, banchi) {
  return `${addressCode}|${choume || ""}|${banchi || ""}`;
}

function key3(addressCode, choume, banchi, go) {
  return `${addressCode}|${choume || ""}|${banchi || ""}|${go || ""}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { requestKbn, addressCode, choume, banchi, go } = req.body || {};
  if (!requestKbn || !addressCode) {
    res.status(400).json({ error: "requestKbn and addressCode are required" });
    return;
  }

  const kbn = String(requestKbn);
  const cache = readCache();
  const meta = ADDRESS_DETAIL_BY_CODE[String(addressCode)] || null;

  if (kbn === "1") {
    const cached = cache.detailKbn1[key1(addressCode, choume)];
    if (Array.isArray(cached) && cached.length > 0) {
      res.status(200).json({ addressBanchiList: cached, source: "cache" });
      return;
    }
    const banchiList = (meta?.banchi || []).map((row) => (typeof row === "string" ? row : row.value));
    res.status(200).json({ addressBanchiList: banchiList, source: meta ? "snapshot" : "empty" });
    return;
  }

  if (kbn === "2") {
    const cached = cache.detailKbn2[key2(addressCode, choume, banchi)];
    if (Array.isArray(cached) && cached.length > 0) {
      res.status(200).json({ addressGoList: cached, source: "cache" });
      return;
    }
    const picked = (meta?.banchi || []).find((row) => {
      const value = typeof row === "string" ? row : row.value;
      return String(value) === String(banchi || "");
    });
    const goList = Array.isArray(picked?.go) ? picked.go : [];
    res.status(200).json({ addressGoList: goList, source: meta ? "snapshot" : "empty" });
    return;
  }

  if (kbn === "3") {
    const cached = cache.detailKbn3[key3(addressCode, choume, banchi, go)];
    res.status(200).json({ buildingList: Array.isArray(cached) ? cached : [], source: "cache-or-empty" });
    return;
  }

  res.status(400).json({ error: "unsupported requestKbn" });
}
