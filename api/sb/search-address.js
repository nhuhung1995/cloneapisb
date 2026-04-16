const SB_BASE = "https://bb-entry.itc.softbank.jp";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const zip = String(req.query?.zip || "").replace(/\D/g, "");
    if (!/^\d{7}$/.test(zip)) {
      res.status(400).json({ error: "zip must be 7 digits" });
      return;
    }

    const url = `${SB_BASE}/aqw-api/composition/search/address/${zip.slice(0, 3)}/${zip.slice(3)}`;
    const upstream = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json, text/plain, */*" }
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
    res.status(500).json({ error: "search-address proxy failed", detail: String(error?.message || error) });
  }
}
