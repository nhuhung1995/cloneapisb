# taoweblan17

## Tai lieu

- [Phan tich flow check dia chi SoftBank](./docs/softbank-address-check-flow.md)

## Demo clone flow

Mo trang voi query param `individualCode`:

- `/?individualCode=422sLcGAVUfqK`

Trang demo se cho test skeleton 4 buoc:

1. Search address
1.5. Chome -> Banchi/Go
2. Normalize
3. Detail
4. Availability (co retry fallback)

## Da doi sang API that (phan dia chi)

- Session guard lay that tu endpoint SB:
  - `POST /aqw-api/composition/individualCd/decision`
- Zipcode search lay that tu endpoint SB:
  - `GET /aqw-api/composition/search/address/{zip3}/{zip4}`

Luu y:

- Phan `Search Address` da khong con hardcode zip.
- Cac buoc sau van la skeleton de mo phong flow.

## Che do su dung de tranh phu thuoc SB

- `Internal Snapshot` (mac dinh):
  - Session + Search + Normalize + Detail + Availability deu chay tu API noi bo.
  - Muc tieu: SB khoa thi he thong van chay.
- `Live SB`:
  - Chi dung session + zipcode search tu SB de doi chieu.
  - Cac buoc sau van chay API noi bo de on dinh.

## Ghi chu quan trong

- Ban nay la "snapshot-compatible", khong the cam ket 100% dong bo mai mai voi he thong SB neu SB doi nghiep vu.
- De giu do khop cao, can cap nhat fixture/snapshot dinh ky.
