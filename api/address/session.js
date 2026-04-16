import { SESSION_FIXTURE } from "../../lib/internal-data.js";
import { normalizeMode } from "../../lib/shape.js";
import { sbDecision } from "../../lib/sb-client.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const mode = normalizeMode(req.query?.mode);
  const { individualCode } = req.body || {};
  if (!individualCode) {
    res.status(400).json({ error: "individualCode is required" });
    return;
  }

  const fixture = JSON.parse(JSON.stringify(SESSION_FIXTURE));
  fixture.agencyProperty.individualCd = String(individualCode);
  fixture.agencyProperty.newApplicationIndividualCd = String(individualCode);

  if (mode === "offline") {
    res.status(200).json({ ...fixture, source: "offline" });
    return;
  }

  const live = await sbDecision(individualCode);
  if (live.ok) {
    res.status(200).json({ ...live.data, source: "live" });
    return;
  }

  if (mode === "hybrid") {
    res.status(200).json({ ...fixture, source: "offline-fallback", liveError: live.data });
    return;
  }

  res.status(live.status).json(live.data);
}
