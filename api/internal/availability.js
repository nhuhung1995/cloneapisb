import { ADDRESS_DETAIL_BY_CODE, SNAPSHOT_VERSION } from "./_data.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const payload = req.body || {};
  const place = payload?.reqServiceAreaAcquisition?.placeAddress;
  const nttFlag = payload?.reqServiceAreaAcquisition?.nttapiCollaborationResult;

  if (!payload.businessType || !payload.channel || !place?.housingType || !place?.addressCode) {
    res.status(400).json({ code: "E00001", message: "required key missing in serviceAreaCheck" });
    return;
  }

  const meta = ADDRESS_DETAIL_BY_CODE[place.addressCode];
  if (!meta) {
    res.status(404).json({ code: "E20005", message: "addressCode not found in snapshot" });
    return;
  }

  if (nttFlag === true && String(place.addressCode).endsWith("2")) {
    res.status(409).json({
      code: "NTT_TEMP_ERROR",
      message: "first call failed, retry with nttapiCollaborationResult=false"
    });
    return;
  }

  res.status(200).json({
    available: Boolean(meta.available),
    planSuggestion: String(place.housingType) === "1" ? "family" : "mansion",
    checkedAddressCode: place.addressCode,
    snapshotVersion: SNAPSHOT_VERSION
  });
}
