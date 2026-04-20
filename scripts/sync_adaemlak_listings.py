from __future__ import annotations

import html
import json
import re
from datetime import datetime
from pathlib import Path
from typing import Any
from urllib.parse import quote_plus, urljoin
from urllib.request import Request, urlopen


BASE_URL = "https://www.adaemlak.com.tr"
PROJECT_ROOT = Path(__file__).resolve().parents[1]
OUTPUT_FILE = PROJECT_ROOT / "data" / "liveListings.generated.ts"
USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"

IGNORED_PATHS = {
    "/",
    "/arsa/",
    "/bina/",
    "/plaza/",
    "/fabrika/",
    "/is-yeri/",
    "/luks-konut/",
    "/haberler/",
    "/hakkimizda/",
    "/iletisim/",
    "/referanslarimiz/",
}

CATEGORY_SOURCES = [
    ("arsa", "?Kategori=ARSA&durum=satilik"),
    ("arsa", "?Kategori=ARSA&durum=kiralik"),
    ("bina", "?Kategori=BiNA&durum=satilik"),
    ("bina", "?Kategori=BiNA&durum=kiralik"),
    ("plaza", "?Kategori=PLAZA&durum=satilik"),
    ("plaza", "?Kategori=PLAZA&durum=kiralik"),
    ("fabrika", "?Kategori=FABRiKA&durum=satilik"),
    ("fabrika", "?Kategori=FABRiKA&durum=kiralik"),
    ("is-yeri", "?Kategori=is-YERi&durum=satilik"),
    ("is-yeri", "?Kategori=is-YERi&durum=kiralik"),
    ("luks-konut", "?Kategori=LuKS-KONUT&durum=satilik"),
    ("luks-konut", "?Kategori=LuKS-KONUT&durum=kiralik"),
]

TURKISH_MAP = str.maketrans(
    {
        "ç": "c",
        "ğ": "g",
        "ı": "i",
        "ö": "o",
        "ş": "s",
        "ü": "u",
        "Ç": "c",
        "Ğ": "g",
        "İ": "i",
        "I": "i",
        "Ö": "o",
        "Ş": "s",
        "Ü": "u",
    }
)


def fetch(url: str) -> str:
    request = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(request) as response:
        return response.read().decode("iso-8859-9", "replace")


def clean_text(value: str) -> str:
    text = html.unescape(value or "")
    text = text.replace("\x92", "'").replace("\xa0", " ")
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.I)
    text = re.sub(r"</p\s*>", "\n", text, flags=re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"[ \t\r\f\v]+", " ", text)
    text = re.sub(r"\n\s*\n+", "\n", text)
    return text.strip(" :\n\t")


def squash_whitespace(value: str) -> str:
    return re.sub(r"\s+", " ", value or "").strip()


def tidy_numeric_spacing(value: str) -> str:
    value = re.sub(r"(?<=\d)\s+\.(?=\d)", ".", value)
    value = re.sub(r"(?<=\d)\s+(?=\d\.)", "", value)
    return value


def normalize_token(value: str) -> str:
    lowered = clean_text(value).translate(TURKISH_MAP).lower()
    lowered = re.sub(r"[^a-z0-9]+", " ", lowered)
    return squash_whitespace(lowered)


def normalize_detail_key(value: str) -> str:
    token = normalize_token(value).replace(" ", "")
    token = token.replace("²", "2")
    return token


def parse_date_for_sort(date_str: str) -> str:
    try:
        return datetime.strptime(date_str, "%d.%m.%Y").strftime("%Y-%m-%d")
    except ValueError:
        return ""


def prettify_category_label(category: str) -> str:
    mapping = {
        "SATILIK": "Satılık",
        "KIRALIK": "Kiralık",
        "ARSA": "Arsa",
        "BİNA": "Bina",
        "BINA": "Bina",
        "PLAZA": "Plaza",
        "FABRİKA": "Fabrika",
        "FABRIKA": "Fabrika",
        "DEPO-ANTREPO": "Depo-Antrepo",
        "İŞ": "İş",
        "IS": "İş",
        "YERİ": "Yeri",
        "YERI": "Yeri",
        "OTEL": "Otel",
        "OFİS": "Ofis",
        "OFIS": "Ofis",
        "MAĞAZA": "Mağaza",
        "MAGAZA": "Mağaza",
        "VİLLA": "Villa",
        "VILLA": "Villa",
        "KONUT": "Konut",
        "TARLA": "Tarla",
    }
    return " ".join(mapping.get(part, part.title()) for part in category.split())


def smart_title_case(value: str) -> str:
    clean = squash_whitespace(value)
    if not clean:
        return clean
    return clean.title() if clean.isupper() else clean


def unique_list(items: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for item in items:
        if item and item not in seen:
            result.append(item)
            seen.add(item)
    return result


def infer_category(human_type: str, title: str, raw_category: str) -> str:
    token = " ".join(filter(None, [normalize_token(human_type), normalize_token(raw_category), normalize_token(title)]))

    status = "SATILIK"
    if "kiralik" in token:
        status = "KİRALIK"

    if "villa" in normalize_token(human_type):
        return f"{status} VİLLA"
    if "otel" in token or "turistik tesis" in token or "butik otel" in token:
        return f"{status} OTEL"
    if "magaza" in token or "dukkan" in token:
        return f"{status} MAĞAZA"
    if "ofis" in token or "büro" in human_type.lower():
        return f"{status} OFİS"
    if "depo" in token or "antrepo" in token:
        return f"{status} DEPO-ANTREPO"
    if "plaza" in token:
        return f"{status} PLAZA"
    if "fabrika" in token or "uretim tesisi" in token:
        return f"{status} FABRİKA"
    if "bina" in token:
        return f"{status} BİNA"
    if "arsa" in token or "tarla" in token or "parsel" in token:
        return f"{status} ARSA"
    if "residence" in token or "daire" in token or "konut" in normalize_token(human_type):
        return f"{status} KONUT"
    return f"{status} İŞ YERİ"


def map_detail_rows(detail_html: str) -> dict[str, str]:
    values: dict[str, str] = {}
    for key_raw, value_raw in re.findall(r"<tr>\s*<td[^>]*>(.*?)</td>\s*<td[^>]*>(.*?)</td>\s*</tr>", detail_html, re.S | re.I):
        key = normalize_detail_key(key_raw)
        value = clean_text(value_raw)
        if key and value:
            values[key] = value.lstrip(": ").strip()
    return values


def collect_detail_rows(detail_html: str) -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    for key_raw, value_raw in re.findall(r"<tr>\s*<td[^>]*>(.*?)</td>\s*<td[^>]*>(.*?)</td>\s*</tr>", detail_html, re.S | re.I):
        label = clean_text(key_raw).strip().rstrip(":")
        label = label.replace("M 2", "M²").replace("m 2", "m²")
        normalized_label = label.upper()
        if normalized_label in {"GABARİ", "GABARI"}:
            label = "Yükseklik"
        if normalized_label in {"KREDİYE UYGUNLUK", "KREDIYE UYGUNLUK", "KREDİ UYGUNLUĞU", "KREDI UYGUNLUGU"}:
            label = "Kredi Durumu"
        value = clean_text(value_raw).lstrip(": ").strip()
        if label and value:
            rows.append({"label": label, "value": value})
    return rows


def fallback_m2(title: str) -> str:
    match = re.search(r"(\d[\d\.\,]*)\s*m[²2]", title, re.I)
    return match.group(1).replace(",", ".") + " m²" if match else "-"


def build_map_url(location_parts: list[str]) -> str:
    query = ", ".join(part for part in location_parts if part and part != "-")
    if not query:
        return ""
    return f"https://www.google.com/maps?q={quote_plus(query)}&output=embed"


def collect_homepage_featured_paths() -> list[str]:
    homepage_html = fetch(f"{BASE_URL}/")
    featured_paths: list[str] = []
    for block in re.findall(r'<div class="boxemlak">(.*?)</div><!--box -->', homepage_html, re.S | re.I):
        href_match = re.search(r'<a href="(/[^"?#]+/)"', block)
        if href_match:
            featured_paths.append(href_match.group(1))
    return featured_paths


def collect_category_records() -> dict[str, dict[str, Any]]:
    records: dict[str, dict[str, Any]] = {}

    for slug, query in CATEGORY_SOURCES:
        category_html = fetch(f"{BASE_URL}/{slug}/{query}")
        for block in re.findall(r'<div class="boxemlak">(.*?)</div><!--box -->', category_html, re.S | re.I):
            href_match = re.search(r'<a href="(/[^"?#]+/)"', block)
            if not href_match:
                continue

            path = href_match.group(1)
            if path in IGNORED_PATHS:
                continue

            record = records.setdefault(
                path,
                {
                    "path": path,
                    "title": "",
                    "location": "",
                    "ilanNo": "",
                    "updateDate": "",
                    "price": "",
                    "rawCategories": set(),
                    "previewImage": "",
                },
            )

            title_match = re.search(r'<div class="baslik">(.*?)</div>', block, re.S | re.I)
            location_match = re.search(r"<strong>(.*?)</strong>", block, re.S | re.I)
            ilan_match = re.search(r"İLAN NO:\s*([^<\n]+)", block, re.I)
            update_match = re.search(r"Güncelleme:\s*([^<\n]+)", block, re.I)
            price_match = re.search(r'<span class="price">(.*?)</span>', block, re.S | re.I)
            category_match = re.search(r'<div class="boxBot">\s*<span class="lef">(.*?)</span>', block, re.S | re.I)
            image_match = re.search(r'<img[^>]+src="(/UserFiles/ProductFiles/[^"]+)"', block, re.I)

            if title_match:
                record["title"] = clean_text(title_match.group(1))
            if location_match:
                record["location"] = clean_text(location_match.group(1))
            if ilan_match:
                record["ilanNo"] = clean_text(ilan_match.group(1))
            if update_match:
                record["updateDate"] = clean_text(update_match.group(1))
            if price_match:
                record["price"] = clean_text(price_match.group(1))
            if category_match:
                record["rawCategories"].add(clean_text(category_match.group(1)))
            if image_match:
                record["previewImage"] = urljoin(BASE_URL, image_match.group(1))

    return records


def build_listings() -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    featured_paths = collect_homepage_featured_paths()
    featured_order = {path: index for index, path in enumerate(featured_paths, start=1)}
    category_records = collect_category_records()

    listings: list[dict[str, Any]] = []

    for path, seed in category_records.items():
        detail_html = fetch(urljoin(BASE_URL, path))

        top_match = re.search(r'<div class="boxTop">(.*?)</div><!--boxTop -->', detail_html, re.S | re.I)
        top_spans = [clean_text(value) for value in re.findall(r'<span class="(?:lef|lef sm|rig)">(.*?)</span>', top_match.group(1), re.S | re.I)] if top_match else []

        detail_title_match = re.search(r'<div class="baslik">(.*?)</div>', detail_html, re.S | re.I)
        detail_title = clean_text(detail_title_match.group(1)) if detail_title_match else seed["title"]

        image_urls = unique_list(
            [
                urljoin(BASE_URL, item)
                for item in re.findall(r'href="(/UserFiles/ProductFiles/big/[^"]+)"[^>]*rel="prettyPhoto\[gallery2\]"', detail_html, re.I)
            ]
        )[:8]

        if not image_urls and seed["previewImage"]:
            image_urls = [seed["previewImage"]]

        details_block_match = re.search(r'<div class="realty-info">(.*?)</div>\s*</div>\s*<div class="boxMidBot">', detail_html, re.S | re.I)
        detail_rows = map_detail_rows(details_block_match.group(1)) if details_block_match else {}
        detail_row_list = collect_detail_rows(details_block_match.group(1)) if details_block_match else []

        description_match = re.search(r'<div class="boxMidBot">(.*?)</div><!--boxMidBot -->', detail_html, re.S | re.I)
        description = tidy_numeric_spacing(squash_whitespace(clean_text(description_match.group(1)))) if description_match else detail_title
        if not description:
            description = detail_title

        human_type = top_spans[0] if top_spans else prettify_category_label(next(iter(seed["rawCategories"]), "SATILIK ARSA"))
        location = top_spans[1] if len(top_spans) > 1 else seed["location"]
        price = top_spans[2] if len(top_spans) > 2 else seed["price"]

        city = detail_rows.get("il", "")
        district = detail_rows.get("ilce", "")
        neighborhood = detail_rows.get("mahalle", "")

        if not city and " / " in location:
            district, city = [smart_title_case(part.strip()) for part in location.split("/", 1)]

        category = infer_category(human_type, detail_title, " ".join(sorted(seed["rawCategories"])))
        listing_id = re.sub(r"[^0-9]", "", seed["ilanNo"]) or path.strip("/").split("-")[-1]

        room_count = detail_rows.get("odasayisi", "-")
        salon_count = detail_rows.get("salonsayisi", "-")
        if room_count != "-" and salon_count not in {"", "-"} and "+" not in room_count:
            combined_room_count = f"{room_count}+{salon_count}"
        else:
            combined_room_count = room_count

        listing: dict[str, Any] = {
            "id": listing_id,
            "category": category,
            "type": human_type,
            "title": detail_title,
            "description": description,
            "location": location or "-",
            "ilanNo": seed["ilanNo"] or f"ADA-{listing_id}",
            "updateDate": seed["updateDate"] or "-",
            "createdDate": parse_date_for_sort(seed["updateDate"]),
            "price": price or "-",
            "imageUrls": image_urls,
            "mapUrl": build_map_url([neighborhood, district, city]),
            "status": "active",
            "detailRows": detail_row_list,
            "details": {
                "city": city or "-",
                "district": district or "-",
                "neighborhood": neighborhood or "-",
                "m2": detail_rows.get("m2", fallback_m2(detail_title)),
                "zoningStatus": detail_rows.get("imardurumu", "-"),
                "kaks": detail_rows.get("kaksemsal", "-"),
                "gabari": detail_rows.get("gabari", "-"),
                "deedType": detail_rows.get("taputipi", "-"),
                "credit": detail_rows.get("krediyeuygunluk", "-"),
                "swap": detail_rows.get("takas", "-"),
                "grossM2": detail_rows.get("brutm2", "-"),
                "netM2": detail_rows.get("netm2", "-"),
                "roomCount": combined_room_count,
                "salonCount": salon_count,
                "buildingAge": detail_rows.get("binaninyasi", "-"),
                "floorLocation": detail_rows.get("bulundugukat", "-"),
                "floorCount": detail_rows.get("katsayisi", "-"),
                "heating": detail_rows.get("isinmatipi", "-"),
                "bathroomCount": detail_rows.get("banyosayisi", "-"),
                "parking": detail_rows.get("otopark", "-"),
                "usageStatus": detail_rows.get("mevcuthali", "-"),
                "workplaceType": detail_rows.get("isyeritipi", "-"),
                "closedAreaM2": detail_rows.get("kapalialanm2", "-"),
                "roomOrSectionCount": detail_rows.get("bolumsayisi", detail_rows.get("odasayisi", "-")),
                "buildingCondition": detail_rows.get("yapinindurumu", "-"),
                "housingType": detail_rows.get("konuttipi", "-"),
                "housingShape": detail_rows.get("konutsekli", "-"),
                "taks": detail_rows.get("taks", "-"),
                "unitPrice": detail_rows.get("metrekarebirimfiyat", "-"),
                "devren": detail_rows.get("devren", "-"),
            },
        }

        if path in featured_order:
            listing["homepage_featured"] = True
            listing["homepage_order"] = featured_order[path]

        listings.append(listing)

    listings.sort(
        key=lambda item: (
            item.get("homepage_order", 999),
            item.get("createdDate") or "0000-00-00",
            item.get("ilanNo", ""),
        ),
        reverse=False,
    )

    sidebar_seed = sorted(
        listings,
        key=lambda item: (item.get("createdDate") or "0000-00-00", item.get("ilanNo", "")),
        reverse=True,
    )[:6]

    sidebar_listings = [
        {
            "id": item["id"],
            "title": item["title"],
            "price": item["price"],
            "imageUrl": item["imageUrls"][0] if item["imageUrls"] else "",
        }
        for item in sidebar_seed
    ]

    return listings, sidebar_listings


def write_typescript(main_listings: list[dict[str, Any]], sidebar_listings: list[dict[str, Any]]) -> None:
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    generated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    content = (
        'import { Listing, SidebarListing } from "../types";\n\n'
        f"// Generated from {BASE_URL} on {generated_at}.\n"
        "// Run `python3 scripts/sync_adaemlak_listings.py` to refresh.\n\n"
        f"export const LIVE_MAIN_LISTINGS: Listing[] = {json.dumps(main_listings, ensure_ascii=False, indent=2)};\n\n"
        f"export const LIVE_SIDEBAR_LISTINGS: SidebarListing[] = {json.dumps(sidebar_listings, ensure_ascii=False, indent=2)};\n"
    )

    OUTPUT_FILE.write_text(content, encoding="utf-8")


def main() -> None:
    listings, sidebar_listings = build_listings()
    write_typescript(listings, sidebar_listings)
    print(f"Wrote {len(listings)} listings and {len(sidebar_listings)} sidebar listings to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
