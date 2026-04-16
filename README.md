# cloneapisb

## Muc tieu hien tai

Repo nay da duoc nang cap theo huong **tu chu du lieu** de giam phu thuoc vao SB:

- `offline`: khong goi SB
- `hybrid`: uu tien local, thieu moi goi SB va tu cache lai
- `live`: goi SB truoc (de doi chieu)

UI co switch `Provider Mode` ngay tren dau trang.

## Flow UI

1. Search address
2. Banchi (requestKbn=1)
3. Go (requestKbn=2)
4. Building (requestKbn=3)
5. Normalize
6. Detail
7. Availability

`Full Address` hien theo dang: `chome - banchi - go`.

## API moi (orchestrator)

- `POST /api/address/session?mode=offline|hybrid|live`
- `GET /api/address/search-address?mode=offline|hybrid|live&zip=...`
- `POST /api/address/detail-address?mode=offline|hybrid|live`

## Thu vien offline (zip/chome)

- File du lieu local:
  - `data/offline/ken_all_master.json`
- Duoc build tu Japan Post KEN_ALL.

### Rebuild du lieu offline

```bash
python scripts/build_offline_master.py --out data/offline/ken_all_master.json
```

Script se tai KEN_ALL tu Japan Post va build ve format app dang dung.

## Cache nong live

- File cache:
  - `data/cache/live-cache.json`
- Hybrid/live se tu dong luu ket qua live hop le vao cache.
- Khi live loi, `hybrid` co the fallback local/cache.

## Ghi chu

- `zip -> chome` da co bo du lieu lon offline.
- `banchi/go/building` full-coverage van phu thuoc cache/snapshot (hoac live khi co).
- Repo `taoweblan17` dung o trang thai dong so; code moi tiep tuc tren repo nay.
