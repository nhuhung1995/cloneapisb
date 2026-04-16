import { ADDRESS_DETAIL_BY_CODE, SNAPSHOT_VERSION } from "./_data.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const addressCode = String(req.query?.addressCode || "");
  if (!addressCode) {
    res.status(400).json({ code: "E00001", message: "addressCode is required" });
    return;
  }

  const meta = ADDRESS_DETAIL_BY_CODE[addressCode];
  if (!meta) {
    res.status(404).json({ code: "E20005", message: "addressCode not found in snapshot" });
    return;
  }

  const banchiCandidates = (meta.banchi || []).map((b) =>
    typeof b === "string" ? { value: b, go: [] } : { value: b.value, go: b.go || [] }
  );

  res.status(200).json({
    addressCode,
    banchiCandidates,
    snapshotVersion: SNAPSHOT_VERSION
  });
}
