import { ADDRESS_BY_ZIP, SNAPSHOT_VERSION } from "./_data.js";

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

  res.status(200).json({
    addresses: ADDRESS_BY_ZIP[zip] || [],
    snapshotVersion: SNAPSHOT_VERSION
  });
}
