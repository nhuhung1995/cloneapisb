import { ADDRESS_DETAIL_BY_CODE, SNAPSHOT_VERSION, validateRequired } from "./_data.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const input = req.body || {};
  const check = validateRequired(input, ["requestKbn", "addressCode"]);
  if (!check.ok) {
    res.status(400).json({ code: "E00001", missing: check.missing });
    return;
  }

  const meta = ADDRESS_DETAIL_BY_CODE[input.addressCode];
  if (!meta) {
    res.status(404).json({ code: "E20005", message: "addressCode not found in snapshot" });
    return;
  }

  res.status(200).json({
    requestKbn: input.requestKbn,
    addressCode: input.addressCode,
    latitude: meta.latitude,
    longitude: meta.longitude,
    banchiCandidates: (meta.banchi || []).map((b) =>
      typeof b === "string" ? { value: b, go: [] } : { value: b.value, go: b.go || [] }
    ),
    detailResolved: true,
    snapshotVersion: SNAPSHOT_VERSION
  });
}
