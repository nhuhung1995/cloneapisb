const SB_BASE = "https://bb-entry.itc.softbank.jp";

async function parseJsonOrRaw(upstream) {
  const text = await upstream.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export async function sbDecision(individualCode) {
  const upstream = await fetch(`${SB_BASE}/aqw-api/composition/individualCd/decision`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ individualCd: String(individualCode), uuid: "" })
  });
  const data = await parseJsonOrRaw(upstream);
  return { ok: upstream.ok, status: upstream.status, data };
}

export async function sbSearchAddress(zip) {
  const z = String(zip).replace(/\D/g, "");
  const upstream = await fetch(`${SB_BASE}/aqw-api/composition/search/address/${z.slice(0, 3)}/${z.slice(3)}`, {
    method: "GET",
    headers: { Accept: "application/json, text/plain, */*" }
  });
  const data = await parseJsonOrRaw(upstream);
  return { ok: upstream.ok, status: upstream.status, data };
}

export async function sbDetailAddress({ individualCode, requestKbn, addressCode, choume, banchi, go }) {
  const decision = await sbDecision(individualCode);
  if (!decision.ok) {
    return { ok: false, status: decision.status, data: decision.data };
  }

  const ag = decision.data?.agencyProperty || {};
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
  const data = await parseJsonOrRaw(upstream);
  return { ok: upstream.ok, status: upstream.status, data };
}
