const SB_BASE = "https://bb-entry.itc.softbank.jp";

async function getAgency(individualCode) {
  const upstream = await fetch(`${SB_BASE}/aqw-api/composition/individualCd/decision`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ individualCd: String(individualCode), uuid: "" })
  });
  const text = await upstream.text();
  const data = text ? JSON.parse(text) : {};
  if (!upstream.ok) {
    throw new Error(`decision failed: ${upstream.status}`);
  }
  return data?.agencyProperty;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { individualCode, requestKbn, addressCode, choume, banchi, go } = req.body || {};
    if (!individualCode || !requestKbn || !addressCode) {
      res.status(400).json({ error: "individualCode, requestKbn, addressCode are required" });
      return;
    }

    const ag = await getAgency(individualCode);
    const ts = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);

    const payload = {
      ReqBbapiBase: {
        customerId: null,
        Auth: { agency: "ACQ-WEB", accountId: ag.nanoId, timestamp: ts },
        StoreInfo: {
          carrierCode: ag.carrierCode,
          agencyCode: ag.agencyCode,
          brancheCode: ag.brancheCode,
          campaignCode: ag.campaignCode,
          salesShopCode: ag.sbmOrdcstmCd
        },
        entrySheetNumber: ""
      },
      requestKbn: String(requestKbn),
      addressCode: String(addressCode),
      choume: choume ?? undefined,
      banchi: banchi ?? undefined,
      go: go ?? undefined
    };

    const upstream = await fetch(`${SB_BASE}/bff/detailAddressSearch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
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
    res.status(500).json({ error: "detail-address proxy failed", detail: String(error?.message || error) });
  }
}
