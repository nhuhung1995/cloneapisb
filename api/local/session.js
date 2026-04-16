import { SESSION_FIXTURE } from "../internal/_data.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { individualCode } = req.body || {};
  if (!individualCode) {
    res.status(400).json({ error: "individualCode is required" });
    return;
  }

  const out = JSON.parse(JSON.stringify(SESSION_FIXTURE));
  out.agencyProperty.individualCd = String(individualCode);
  out.agencyProperty.newApplicationIndividualCd = String(individualCode);
  res.status(200).json(out);
}
