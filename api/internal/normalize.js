import { SNAPSHOT_VERSION, validateRequired } from "./_data.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const input = req.body || {};
  const check = validateRequired(input, ["buildingKind", "orderZip", "inUseServiceType"]);
  if (!check.ok) {
    res.status(400).json({ code: "E00001", missing: check.missing });
    return;
  }

  if (!["2"].includes(String(input.buildingKind))) {
    res.status(400).json({ code: "E00010", message: "buildingKind invalid" });
    return;
  }
  if (!["1", "2"].includes(String(input.inUseServiceType))) {
    res.status(400).json({ code: "E00010", message: "inUseServiceType invalid" });
    return;
  }

  res.status(200).json({
    areaFlg: "1",
    orderNumber: "ORD-" + Date.now(),
    orderAddress1: input.orderAddress1 || "",
    orderAddress2: input.orderAddress2 || "",
    snapshotVersion: SNAPSHOT_VERSION
  });
}
