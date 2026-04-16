const SB_BASE = "https://bb-entry.itc.softbank.jp";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { individualCode } = req.body || {};
    if (!individualCode) {
      res.status(400).json({ error: "individualCode is required" });
      return;
    }

    const upstream = await fetch(`${SB_BASE}/aqw-api/composition/individualCd/decision`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ individualCd: String(individualCode), uuid: "" })
    });

    const text = await upstream.text();
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }
    }
    res.status(upstream.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "session proxy failed", detail: String(error?.message || error) });
  }
}
