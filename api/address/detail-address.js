import { normalizeMode, extractBuildingCandidates } from "../../lib/shape.js";
import { sbDetailAddress } from "../../lib/sb-client.js";
import {
  readCache,
  cacheDetailKbn1,
  cacheDetailKbn2,
  cacheDetailKbn3
} from "../../lib/cache-store.js";
import { ADDRESS_DETAIL_BY_CODE } from "../../lib/internal-data.js";

function localDetail({ requestKbn, addressCode, choume, banchi, go }) {
  const cache = readCache();
  const meta = ADDRESS_DETAIL_BY_CODE[String(addressCode)] || null;
  const kbn = String(requestKbn);

  if (kbn === "1") {
    const key = `${addressCode}|${choume || ""}`;
    const cached = cache.detailKbn1[key];
    if (Array.isArray(cached) && cached.length > 0) {
      return { addressBanchiList: cached, source: "cache" };
    }
    const banchiList = (meta?.banchi || []).map((row) => (typeof row === "string" ? row : row.value));
    return { addressBanchiList: banchiList, source: meta ? "snapshot" : "empty" };
  }

  if (kbn === "2") {
    const key = `${addressCode}|${choume || ""}|${banchi || ""}`;
    const cached = cache.detailKbn2[key];
    if (Array.isArray(cached) && cached.length > 0) {
      return { addressGoList: cached, source: "cache" };
    }
    const picked = (meta?.banchi || []).find((row) => {
      const value = typeof row === "string" ? row : row.value;
      return String(value) === String(banchi || "");
    });
    return { addressGoList: Array.isArray(picked?.go) ? picked.go : [], source: meta ? "snapshot" : "empty" };
  }

  if (kbn === "3") {
    const key = `${addressCode}|${choume || ""}|${banchi || ""}|${go || ""}`;
    const cached = cache.detailKbn3[key];
    return { buildingList: Array.isArray(cached) ? cached : [], source: "cache-or-empty" };
  }

  return { error: "unsupported requestKbn" };
}

function persistLiveDetail({ requestKbn, addressCode, choume, banchi, go }, data) {
  const kbn = String(requestKbn);
  if (kbn === "1") {
    cacheDetailKbn1(addressCode, choume, data?.addressBanchiList || []);
    return;
  }
  if (kbn === "2") {
    cacheDetailKbn2(addressCode, choume, banchi, data?.addressGoList || []);
    return;
  }
  if (kbn === "3") {
    cacheDetailKbn3(addressCode, choume, banchi, go, extractBuildingCandidates(data));
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const mode = normalizeMode(req.query?.mode);
  const payload = req.body || {};
  const { individualCode, requestKbn, addressCode } = payload;
  if (!requestKbn || !addressCode) {
    res.status(400).json({ error: "requestKbn and addressCode are required" });
    return;
  }

  const local = localDetail(payload);

  if (mode === "offline") {
    res.status(200).json(local);
    return;
  }

  if (mode === "hybrid") {
    const hasLocal =
      (Array.isArray(local.addressBanchiList) && local.addressBanchiList.length > 0) ||
      (Array.isArray(local.addressGoList) && local.addressGoList.length > 0) ||
      (Array.isArray(local.buildingList) && local.buildingList.length > 0);
    if (hasLocal) {
      res.status(200).json(local);
      return;
    }
  }

  if (!individualCode) {
    if (mode === "hybrid") {
      res.status(200).json({ ...local, source: `${local.source}-fallback`, liveError: { error: "individualCode missing" } });
      return;
    }
    res.status(400).json({ error: "individualCode is required in live mode" });
    return;
  }

  const live = await sbDetailAddress(payload);
  if (live.ok) {
    persistLiveDetail(payload, live.data || {});
    res.status(200).json({ ...(live.data || {}), source: mode === "hybrid" ? "live-refresh" : "live" });
    return;
  }

  if (mode === "hybrid") {
    res.status(200).json({ ...local, source: `${local.source}-fallback`, liveError: live.data });
    return;
  }

  res.status(live.status).json(live.data);
}
