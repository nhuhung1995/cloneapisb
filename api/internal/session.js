import { SESSION_FIXTURE } from "./_data.js";

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

  res.status(200).json({
    ...SESSION_FIXTURE,
    agencyProperty: {
      ...SESSION_FIXTURE.agencyProperty,
      individualCd: String(individualCode),
      newApplicationIndividualCd: String(individualCode)
    }
  });
}
