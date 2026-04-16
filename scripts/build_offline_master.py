#!/usr/bin/env python3
import argparse
import csv
import hashlib
import io
import json
import re
import urllib.request
import zipfile
from collections import defaultdict
from datetime import datetime, timezone

KEN_ALL_URL = "https://www.post.japanpost.jp/zipcode/dl/kogaki/zip/ken_all.zip"

CHOME_RE = re.compile(r"^(.*?)([0-9０-９一二三四五六七八九十百千]+丁目)$")
IGNORE_TOWNS = {
    "以下に掲載がない場合",
    "の次に番地がくる場合",
}


def split_town(town: str):
    town = (town or "").strip()
    if town in IGNORE_TOWNS:
        return "", ""
    m = CHOME_RE.match(town)
    if not m:
        return town, ""
    return m.group(1), m.group(2)


def make_address_code(zip7: str, pref: str, city: str, street: str, chome: str) -> str:
    src = f"{zip7}|{pref}|{city}|{street}|{chome}"
    h = hashlib.sha1(src.encode("utf-8")).hexdigest()
    digits = str(int(h[:14], 16))
    return digits[:10].zfill(10)


def download_ken_all(url: str) -> bytes:
    with urllib.request.urlopen(url) as r:
        return r.read()


def build_master(zip_bytes: bytes):
    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zf:
        csv_name = next((n for n in zf.namelist() if n.lower().endswith(".csv")), None)
        if not csv_name:
            raise RuntimeError("KEN_ALL CSV not found in ZIP")
        raw = zf.read(csv_name)

    text = raw.decode("cp932", errors="replace")
    reader = csv.reader(io.StringIO(text))

    by_zip_groups = defaultdict(lambda: defaultdict(dict))

    for row in reader:
        if len(row) < 9:
            continue
        zip7 = row[2].strip()
        pref = row[6].strip()
        city = row[7].strip()
        town = row[8].strip()

        if not re.fullmatch(r"\d{7}", zip7):
            continue

        street, chome = split_town(town)
        group_key = (pref, city, street)
        chome_key = chome

        slot = by_zip_groups[zip7][group_key]
        if "meta" not in slot:
            slot["meta"] = {
                "longNm": pref,
                "cityKanjiNm": city,
                "streetKanjiNm": street,
            }
            slot["streetInfoList"] = {}

        if chome_key not in slot["streetInfoList"]:
            slot["streetInfoList"][chome_key] = {
                "addNbrKanjiNm": chome_key,
                "addressCd": make_address_code(zip7, pref, city, street, chome_key),
            }

    out = {}
    for zip7, grouped in by_zip_groups.items():
        addresses = []
        for (_pref, _city, _street), value in grouped.items():
            infos = list(value["streetInfoList"].values())
            infos.sort(key=lambda x: x["addNbrKanjiNm"])
            addresses.append(
                {
                    "longNm": value["meta"]["longNm"],
                    "cityKanjiNm": value["meta"]["cityKanjiNm"],
                    "streetKanjiNm": value["meta"]["streetKanjiNm"],
                    "streetInfoList": infos,
                }
            )
        addresses.sort(key=lambda a: (a["longNm"], a["cityKanjiNm"], a["streetKanjiNm"]))
        out[zip7] = addresses

    return {
        "version": f"ken-all-{datetime.now(timezone.utc).strftime('%Y%m%d')}",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "byZip": out,
    }


def main():
    parser = argparse.ArgumentParser(description="Build offline master from Japan Post KEN_ALL")
    parser.add_argument("--url", default=KEN_ALL_URL)
    parser.add_argument("--out", default="data/offline/ken_all_master.json")
    args = parser.parse_args()

    blob = download_ken_all(args.url)
    master = build_master(blob)

    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(master, f, ensure_ascii=False, separators=(",", ":"))

    print(f"wrote {args.out}")
    print(f"zip entries: {len(master['byZip'])}")


if __name__ == "__main__":
    main()
