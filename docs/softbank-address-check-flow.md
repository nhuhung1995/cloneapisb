# SoftBank Address Check Flow (phan tich de clone hanh vi)

Tai lieu nay tong hop flow "住所を入力する" cua form SoftBank Hikari tu link goc:

- https://bb-entry.itc.softbank.jp/AQW-CTR-100?individualCode=422sLcGAVUfqK

## 1) Tong quan he thong check dia chi

He thong khong check 1 buoc. No la pipeline nhieu tang:

1. Tra zip code -> lay danh sach dia chi ung vien.
2. Chuan hoa dia chi theo backend BFF (nttAddressSearch).
3. Lay chi tiet dia chi/toa do (detailAddressSearch).
4. Check kha dung dich vu tai dia chi do (serviceAreaCheck).

Neu payload sai schema hoac thieu key, backend chan ngay o tung tang.

## 2) Cac endpoint chinh

### A. Zip -> danh sach dia chi

- `GET /aqw-api/composition/search/address/{zip3}/{zip4}`
- Vi du:
  - `GET /aqw-api/composition/search/address/105/0011`
- Ket qua mau:
  - `addresses[].longNm`, `cityKanjiNm`, `streetKanjiNm`
  - `streetInfoList[].addressCd`

### B. NTT address search (BFF)

- `POST /bff/nttAddressSearch`
- Validate bat buoc key:
  - `buildingKind`
  - `orderZip`
  - `inUseServiceType`
- Thuc te test:
  - Thieu key -> `"必要なキーがありません"`
  - Sai enum -> `E00010`
  - Theo flow SB frontend, endpoint nay duoc goi lap lai theo cap:
    - `addressKbn=2` de lay list sau khi co zip/chome
    - `addressKbn=3` de di sau hon ra banchi/go

### C. Detail address search (BFF)

- `POST /bff/detailAddressSearch`
- Test thuc te voi payload rong (`{}`) tra ve loi bat buoc:
  - `requestKbn`
  - `latitude`
  - `longitude`
  - `addressCode`

### D. Service area check (BFF) - buoc quyet dinh

- `POST /bff/serviceAreaCheck`
- Test thuc te voi payload rong (`{}`) tra ve bat buoc:
  - `businessType`
  - `channel`
  - `reqServiceAreaAcquisition`
  - `reqServiceAreaAcquisition.placeAddress`
  - `reqServiceAreaAcquisition.placeAddress.housingType`
  - `reqServiceAreaAcquisition.placeAddress.addressCode`

## 3) Rule nghiep vu rut ra tu ma JS

1. UI "住所を入力する" chi la entry point.
2. Backend moi la noi quyet dinh dia chi hop le va cung cap duoc hay khong.
3. Ma frontend co fallback:
   - Neu `serviceAreaCheck` that bai khi `nttapiCollaborationResult=true`,
   - se retry voi `nttapiCollaborationResult=false` (de giam fail cung).

## 4) So do luong de implement tuong tu

1. User nhap zip.
2. Goi `search/address` de lay candidate + `addressCd`.
3. User chon cho/ban/go + can ho.
4. Goi `nttAddressSearch` de chuan hoa.
5. Goi `detailAddressSearch` de lay chi tiet toa do / dia chi mapping.
6. Goi `serviceAreaCheck` de ra ket qua kha dung dich vu.
7. Neu can, fallback retry voi profile khong NTT collaboration.

## 5) Khuyen nghi khi clone flow

1. Tach endpoint theo layer giong SB:
   - Search layer
   - Normalize layer
   - Availability layer
2. Validate schema chat o backend (khong tin frontend).
3. Log ro rang cho tung buoc de debug:
   - request id
   - payload key summary
   - error code backend (`E00010`, externalErrorCode)
4. Khong cho skip thang buoc availability check.

## 6) Ghi chu implementation

- Link goc mang `individualCode` de vao flow.
- Cac URL trung gian auth/callback co tinh chat phien (session-like), khong nen coi la permalink.
- Neu clone hanh vi nay, nen dung token/uuid ngan han + guard route theo state hop le.
