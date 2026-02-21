"""Playwright script to register the local server and platform instance via the web UI.

Prerequisites:
    1. App running (e.g. docker compose up, or uvicorn)
    2. RBAC seeded:  poetry run python scripts/seed_rbac.py
    3. Admin user:   poetry run python scripts/seed_admin.py \
                       --email admin@dotmac.local --first-name Admin \
                       --last-name User --username admin --password admin123

Usage:
    poetry run python scripts/setup_local_platform.py

Environment variables (all optional):
    BASE_URL        default http://localhost:8100
    ADMIN_USER      default admin
    ADMIN_PASSWORD  default admin123
"""

from __future__ import annotations

import os
import socket
import sys

from playwright.sync_api import Page, sync_playwright

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
BASE_URL: str = os.getenv("BASE_URL", "http://localhost:8100")
ADMIN_USER: str = os.getenv("ADMIN_USER", "admin")
ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "admin123")

LOCAL_SERVER_NAME: str = "Local Server"
LOCAL_HOSTNAME: str = socket.gethostname()

GIT_REPO_LABEL: str = "DotMac Platform"
GIT_REPO_URL: str = "https://github.com/dotmac/platform.git"

RELEASE_NAME: str = "v1.0.0"
RELEASE_VERSION: str = "1.0.0"
RELEASE_GIT_REF: str = "main"

BUNDLE_NAME: str = "Platform Core"

CATALOG_LABEL: str = "DotMac Platform"

INSTANCE_ORG_CODE: str = "dotmac-platform"
INSTANCE_ORG_NAME: str = "DotMac Platform"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def log(msg: str) -> None:
    print(f"  → {msg}")


def _do_login(page: Page) -> None:
    """Submit login form credentials."""
    page.wait_for_selector("input[name='username']")
    page.fill("input[name='username']", ADMIN_USER)
    page.fill("input[name='password']", ADMIN_PASSWORD)
    page.click("button[type='submit']")
    page.wait_for_load_state("networkidle")


def login(page: Page) -> None:
    """Log in as admin via the web UI."""
    page.goto(f"{BASE_URL}/login")
    _do_login(page)
    if "/login" in page.url:
        page.screenshot(path="playwright-login-debug.png")
        print(f"ERROR: Login failed — landed on {page.url}")
        error_el = page.locator(".text-red-700, .text-red-500, [role='alert']")
        if error_el.count() > 0:
            print(f"  Error message: {error_el.first.text_content()}")
        sys.exit(1)
    log(f"Logged in as {ADMIN_USER}")


def ensure_auth(page: Page) -> None:
    """Re-login if the current page is the login page."""
    if "/login" in page.url:
        log("Session expired — re-authenticating")
        _do_login(page)


def navigate(page: Page, path: str) -> None:
    """Navigate to a path and re-login if redirected to login."""
    page.goto(f"{BASE_URL}{path}")
    page.wait_for_load_state("networkidle")
    ensure_auth(page)
    # After re-login we may be on /dashboard; retry the target path
    if path not in page.url:
        page.goto(f"{BASE_URL}{path}")
        page.wait_for_load_state("networkidle")


def create_git_repo(page: Page) -> None:
    """Create a git repository entry for the platform."""
    navigate(page, "/git-repos")

    # Check if repo already exists (look inside the repos table, not sidebar)
    repo_table = page.locator("table")
    if repo_table.count() > 0 and repo_table.locator(f"text={GIT_REPO_LABEL}").count() > 0:
        log(f"Git repo '{GIT_REPO_LABEL}' already exists — skipping")
        return

    repo_form = page.locator("form[action='/git-repos/create']")
    repo_form.locator("input[name='label']").fill(GIT_REPO_LABEL)
    repo_form.locator("input[name='url']").fill(GIT_REPO_URL)
    repo_form.locator("select[name='auth_type']").select_option("none")
    repo_form.locator("input[name='default_branch']").fill("main")

    # Check the "platform default" checkbox
    default_cb = repo_form.locator("input[name='is_platform_default']")
    if default_cb.count() > 0 and not default_cb.is_checked():
        default_cb.check()

    with page.expect_navigation():
        repo_form.locator("button[type='submit']").click()
    page.wait_for_load_state("networkidle")
    log(f"Created git repo '{GIT_REPO_LABEL}'")


def create_catalog(page: Page) -> None:
    """Create a release, bundle, and catalog item."""
    navigate(page, "/catalog")

    # --- Release ---
    releases_section = page.locator("h2:has-text('Releases') + *")  # sibling after Releases heading
    release_exists = releases_section.count() > 0 and releases_section.locator(f"text={RELEASE_NAME}").count() > 0
    if not release_exists:
        release_form = page.locator("form[action='/catalog/releases/create']")
        release_form.locator("input[name='name']").fill(RELEASE_NAME)
        release_form.locator("input[name='version']").fill(RELEASE_VERSION)
        release_form.locator("input[name='git_ref']").fill(RELEASE_GIT_REF)
        release_form.locator("select[name='git_repo_id']").select_option(index=1)
        with page.expect_navigation():
            release_form.locator("button[type='submit']").click()
        page.wait_for_load_state("networkidle")
        log(f"Created release '{RELEASE_NAME}'")
    else:
        log(f"Release '{RELEASE_NAME}' already exists — skipping")

    # Reload after release creation to refresh dropdowns
    navigate(page, "/catalog")

    # --- Bundle ---
    bundles_section = page.locator("h2:has-text('Bundles') + *")
    bundle_exists = bundles_section.count() > 0 and bundles_section.locator(f"text={BUNDLE_NAME}").count() > 0
    if not bundle_exists:
        bundle_form = page.locator("form[action='/catalog/bundles/create']")
        bundle_form.locator("input[name='name']").fill(BUNDLE_NAME)
        with page.expect_navigation():
            bundle_form.locator("button[type='submit']").click()
        page.wait_for_load_state("networkidle")
        log(f"Created bundle '{BUNDLE_NAME}'")
    else:
        log(f"Bundle '{BUNDLE_NAME}' already exists — skipping")

    # --- Catalog Item ---
    # Reload catalog page to pick up newly created release/bundle
    navigate(page, "/catalog")

    items_section = page.locator("h2:has-text('Catalog Items') + *")
    item_exists = items_section.count() > 0 and items_section.locator(f"text={CATALOG_LABEL}").count() > 0
    if not item_exists:
        item_form = page.locator("form[action='/catalog/items/create']")
        item_form.locator("input[name='label']").fill(CATALOG_LABEL)
        # Select the first available release and bundle (index 0 — no empty placeholder)
        item_form.locator("select[name='release_id']").select_option(index=0)
        item_form.locator("select[name='bundle_id']").select_option(index=0)
        with page.expect_navigation():
            item_form.locator("button[type='submit']").click()
        page.wait_for_load_state("networkidle")
        log(f"Created catalog item '{CATALOG_LABEL}'")
    else:
        log(f"Catalog item '{CATALOG_LABEL}' already exists — skipping")


def _test_server_connectivity(page: Page) -> None:
    """Click the 'Test Connection' button on the server detail page."""
    test_btn = page.locator("[data-testid='server-test-connection']")
    if test_btn.count() > 0:
        test_btn.click()
        # HTMX request — wait for network + SSH round-trip
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(2000)
        log("Tested SSH connectivity")


def create_local_server(page: Page) -> None:
    """Register the local server via the web UI."""
    navigate(page, "/servers")

    # Check if server already exists (look in main content, not sidebar)
    content = page.locator("[data-testid], table, .rounded-xl")
    if content.locator(f"text='{LOCAL_SERVER_NAME}'").count() > 0:
        log(f"Server '{LOCAL_SERVER_NAME}' already exists — testing connectivity")
        # Click into the server detail page to run the connectivity test
        content.locator(f"a:has-text('{LOCAL_SERVER_NAME}')").first.click()
        page.wait_for_load_state("networkidle")
        _test_server_connectivity(page)
        return

    navigate(page, "/servers/new")

    form = page.locator("[data-testid='server-form']")
    form.locator("input[name='name']").fill(LOCAL_SERVER_NAME)
    form.locator("input[name='hostname']").fill(LOCAL_HOSTNAME)
    form.locator("input[name='ssh_port']").fill("22")
    form.locator("input[name='ssh_user']").fill("root")

    # Check "is_local" checkbox
    is_local_cb = form.locator("input[name='is_local']")
    if not is_local_cb.is_checked():
        is_local_cb.check()

    # Submit and wait for navigation (302 redirect after success)
    with page.expect_navigation():
        form.locator("[data-testid='server-submit']").click()
    page.wait_for_load_state("networkidle")

    # Verify success — should redirect to /servers/<id>, not stay on /servers/new
    if "/servers/new" in page.url:
        page.screenshot(path="playwright-server-error.png")
        print("ERROR: Server creation failed — still on /servers/new")
        sys.exit(1)
    log(f"Created local server '{LOCAL_SERVER_NAME}' ({LOCAL_HOSTNAME})")

    _test_server_connectivity(page)


def create_platform_instance(page: Page) -> None:
    """Create the DotMac Platform instance on the local server."""
    navigate(page, "/instances")

    # Check if instance already exists (org_code is unique enough)
    content = page.locator("[data-testid], table, .rounded-xl")
    if content.locator(f"text='{INSTANCE_ORG_CODE}'").count() > 0:
        log(f"Instance '{INSTANCE_ORG_CODE}' already exists — skipping")
        return

    navigate(page, "/instances/new")

    # Select the local server from the dropdown (label is "Name (hostname)")
    server_select = page.locator("select[name='server_id']")
    local_option = server_select.locator(f"option:has-text('{LOCAL_SERVER_NAME}')")
    if local_option.count() > 0:
        server_select.select_option(value=local_option.get_attribute("value") or "")
    else:
        server_select.select_option(index=1)

    # Select catalog item
    catalog_select = page.locator("select[name='catalog_item_id']")
    catalog_option = catalog_select.locator(f"option:has-text('{CATALOG_LABEL}')")
    if catalog_option.count() > 0:
        catalog_select.select_option(value=catalog_option.get_attribute("value") or "")
    else:
        catalog_select.select_option(index=1)

    form = page.locator("[data-testid='instance-form']")
    form.locator("input[name='org_code']").fill(INSTANCE_ORG_CODE)
    form.locator("input[name='org_name']").fill(INSTANCE_ORG_NAME)

    # ERP fields are now optional — leave them empty for the platform instance

    # Expand Custom Ports section and fill in known ports
    ports_summary = page.locator("summary:has-text('Custom Ports')")
    if ports_summary.count() > 0:
        ports_summary.click()
        page.wait_for_timeout(300)
        form.locator("input[name='app_port']").fill("8001")
        form.locator("input[name='db_port']").fill("5432")
        form.locator("input[name='redis_port']").fill("6379")

    # Submit and wait for navigation
    with page.expect_navigation():
        form.locator("[data-testid='instance-submit']").click()
    page.wait_for_load_state("networkidle")
    log(f"Created instance '{INSTANCE_ORG_NAME}' ({INSTANCE_ORG_CODE})")

    # Set instance status to running (it's the platform itself)
    if "/instances/" in page.url and "/instances/new" not in page.url:
        log("Setting platform instance status to running")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main() -> None:
    print(f"Setting up local platform at {BASE_URL}\n")

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            login(page)
            create_git_repo(page)
            create_catalog(page)
            create_local_server(page)
            create_platform_instance(page)
        except Exception as exc:
            # Screenshot for debugging
            page.screenshot(path="playwright-error.png")
            print(f"\nERROR: {exc}")
            print("Screenshot saved to playwright-error.png")
            sys.exit(1)
        finally:
            browser.close()

    print("\nLocal platform setup complete.")


if __name__ == "__main__":
    main()
