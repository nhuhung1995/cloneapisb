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
  ],
  "3320035": [
    {
      longNm: "埼玉県",
      cityKanjiNm: "川口市",
      streetKanjiNm: "並木",
      streetInfoList: [
        { addNbrKanjiNm: "１丁目", addressCd: "11203061001" },
        { addNbrKanjiNm: "２丁目", addressCd: "11203061002" },
        { addNbrKanjiNm: "３丁目", addressCd: "11203061003" },
        { addNbrKanjiNm: "４丁目", addressCd: "11203061004" }
      ]
    }
  ]
};

export const ADDRESS_DETAIL_BY_CODE = {
  "13103012001": {
    latitude: 35.6586,
    longitude: 139.7454,
    banchi: [
      { value: "1-1", go: ["101", "102"] },
      { value: "1-2", go: ["201"] },
      { value: "1-3", go: ["301", "302"] }
    ],
    available: true
  },
  "13103012002": {
    latitude: 35.6563,
    longitude: 139.7481,
    banchi: [
      { value: "2-1", go: ["101"] },
      { value: "2-2", go: ["201", "202"] }
    ],
    available: false
  },
  "13103012003": {
    latitude: 35.6577,
    longitude: 139.7443,
    banchi: [{ value: "3-1", go: ["101"] }],
    available: true
  },
  "13103012004": {
    latitude: 35.6581,
    longitude: 139.7428,
    banchi: [
      { value: "4-1", go: ["101"] },
      { value: "4-2", go: ["201"] }
    ],
    available: false
  },
  "13113001001": {
    latitude: 35.6719,
    longitude: 139.7063,
    banchi: [
      { value: "1-5", go: ["101", "102"] },
      { value: "1-6", go: ["201"] }
    ],
    available: true
  },
  "13113001002": {
    latitude: 35.6708,
    longitude: 139.7084,
    banchi: [{ value: "2-7", go: ["101"] }],
    available: false
  },
  "11203061001": {
    latitude: 35.8151,
    longitude: 139.7074,
    banchi: [
      { value: "10-1", go: ["101", "102", "103"] },
      { value: "10-2", go: ["201"] }
    ],
    available: true
  },
  "11203061002": {
    latitude: 35.8148,
    longitude: 139.7081,
    banchi: [
      { value: "20-1", go: ["101", "102"] },
      { value: "20-2", go: ["201", "202"] }
    ],
    available: true
  },
  "11203061003": {
    latitude: 35.8143,
    longitude: 139.7067,
    banchi: [
      { value: "30-1", go: ["101"] },
      { value: "30-2", go: ["201"] }
    ],
    available: false
  },
  "11203061004": {
    latitude: 35.8139,
    longitude: 139.7061,
    banchi: [
      { value: "40-1", go: ["101", "102"] },
      { value: "40-2", go: ["201"] }
    ],
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
