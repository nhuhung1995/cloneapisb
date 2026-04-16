export const SNAPSHOT_VERSION = "2026-04-17";

export const SESSION_FIXTURE = {
  agencyProperty: {
    sbmOrdcstmCd: "BBABELL94",
    orderType: 1,
    channelCd: "B13",
    individualCd: "422sLcGAVUfqK",
    certificationFlg: false,
    agencyCode: "10000",
    agencyCd: "900110000A59S000",
    uuid: "317b9af6-2694-4edf-a80c-442df776d2c7",
    marketType: 1,
    productName: "光新規",
    nanoId: "lJayPZOjgRkWFb1ckMfP",
    brancheCode: "A59",
    loginAgencyCd: null,
    marketName: "direct",
    carrierCode: "9001",
    olsOrdcstmCd: null,
    newApplicationIndividualCd: "422sLcGAVUfqK",
    productType: 2,
    campaignCode: "S000"
  },
  snapshotVersion: SNAPSHOT_VERSION
};

export const ADDRESS_BY_ZIP = {
  "1050011": [
    {
      longNm: "東京都",
      cityKanjiNm: "港区",
      streetKanjiNm: "芝公園",
      streetInfoList: [
        { addNbrKanjiNm: "１丁目", addressCd: "13103012001" },
        { addNbrKanjiNm: "２丁目", addressCd: "13103012002" },
        { addNbrKanjiNm: "３丁目", addressCd: "13103012003" },
        { addNbrKanjiNm: "４丁目", addressCd: "13103012004" }
      ]
    }
  ],
  "1500001": [
    {
      longNm: "東京都",
      cityKanjiNm: "渋谷区",
      streetKanjiNm: "神宮前",
      streetInfoList: [
        { addNbrKanjiNm: "１丁目", addressCd: "13113001001" },
        { addNbrKanjiNm: "２丁目", addressCd: "13113001002" }
      ]
    }
  ]
};

export const ADDRESS_DETAIL_BY_CODE = {
  "13103012001": {
    latitude: 35.6586,
    longitude: 139.7454,
    banchi: ["1-1", "1-2", "1-3"],
    available: true
  },
  "13103012002": {
    latitude: 35.6563,
    longitude: 139.7481,
    banchi: ["2-1", "2-2"],
    available: false
  },
  "13103012003": {
    latitude: 35.6577,
    longitude: 139.7443,
    banchi: ["3-1"],
    available: true
  },
  "13103012004": {
    latitude: 35.6581,
    longitude: 139.7428,
    banchi: ["4-1", "4-2"],
    available: false
  },
  "13113001001": {
    latitude: 35.6719,
    longitude: 139.7063,
    banchi: ["1-5", "1-6"],
    available: true
  },
  "13113001002": {
    latitude: 35.6708,
    longitude: 139.7084,
    banchi: ["2-7"],
    available: false
  }
};

export function validateRequired(input, keys) {
  const missing = keys.filter((k) => input?.[k] === undefined || input?.[k] === null || input?.[k] === "");
  if (missing.length) {
    return { ok: false, missing };
  }
  return { ok: true, missing: [] };
}
