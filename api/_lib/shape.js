export function normalizeMode(input) {
  const mode = String(input || "hybrid").toLowerCase();
  if (mode === "live" || mode === "offline" || mode === "hybrid") return mode;
  return "hybrid";
}

export function flattenSearchAddresses(data) {
  const flattened = [];
  (data?.addresses || []).forEach((a) => {
    const base = `${a.longNm || ""}${a.cityKanjiNm || ""}${a.streetKanjiNm || ""}`;
    (a.streetInfoList || []).forEach((s) => {
      flattened.push({
        full: `${base}${s.addNbrKanjiNm || ""}`,
        addressCode: s.addressCd || "",
        pref: a.longNm || "",
        city: a.cityKanjiNm || "",
        street: a.streetKanjiNm || "",
        chome: s.addNbrKanjiNm || ""
      });
    });
  });
  return flattened;
}

export function extractBuildingCandidates(raw) {
  const pools = [
    raw?.buildingList,
    raw?.addressBuildingList,
    raw?.buldngList,
    raw?.apartmentList,
    raw?.addressBuildingInfoList
  ].filter(Array.isArray);

  return pools
    .flat()
    .map((row) => {
      if (typeof row === "string") return { id: row, name: row };
      const id = row?.buldngId || row?.buildingId || row?.id || "";
      const name = row?.buldngNm || row?.buildingName || row?.name || "";
      if (!id && !name) return null;
      return { id: id || name, name: name || id };
    })
    .filter(Boolean);
}
