import argparse
import os
import sys

import httpx

ASSETS = {
    "tailwind.js": "https://cdn.tailwindcss.com",
    "htmx.min.js": "https://unpkg.com/htmx.org@2.0.0",
    "htmx-loading-states.js": "https://unpkg.com/htmx-ext-loading-states@2.0.0/loading-states.js",
    "alpine.min.js": "https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js",
}

FONTS_CSS_URL = (
    "https://fonts.googleapis.com/css2?"
    "family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700"
    "&family=Instrument+Serif:ital@0;1"
    "&family=IBM+Plex+Mono:wght@400;500"
    "&display=swap"
)


def download(url: str) -> bytes:
    resp = httpx.get(url, headers={"User-Agent": "dotmac-platform-fetch/1.0"}, timeout=30.0, follow_redirects=True)
    resp.raise_for_status()
    return resp.content


def write_file(path: str, content: bytes) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(content)


def main() -> int:
    parser = argparse.ArgumentParser(description="Fetch CDN assets into static/vendor.")
    parser.add_argument(
        "--dest",
        default=os.path.join("static", "vendor"),
        help="Destination directory for vendor assets.",
    )
    parser.add_argument(
        "--include-fonts",
        action="store_true",
        help="Download Google Fonts CSS into fonts.css (still references fonts.gstatic.com).",
    )
    args = parser.parse_args()

    dest_dir = args.dest
    os.makedirs(dest_dir, exist_ok=True)

    for filename, url in ASSETS.items():
        print(f"Fetching {url} -> {filename}")
        content = download(url)
        write_file(os.path.join(dest_dir, filename), content)

    fonts_path = os.path.join(dest_dir, "fonts.css")
    if args.include_fonts:
        print(f"Fetching {FONTS_CSS_URL} -> fonts.css")
        write_file(fonts_path, download(FONTS_CSS_URL))
    elif not os.path.exists(fonts_path):
        write_file(fonts_path, b"/* Placeholder for self-hosted fonts. */\n")

    print("Done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
