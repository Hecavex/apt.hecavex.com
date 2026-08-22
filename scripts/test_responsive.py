#!/usr/bin/env python3
"""Browser-level responsive, navigation and focus checks for APT Notes."""

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
import threading

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parent.parent
PUBLIC_ROOT = ROOT / "dist"
RESULTS = ROOT / "test-results" / "responsive.json"
WIDTHS = (320, 360, 390, 768, 1024, 1440)
HEIGHT = 900
ROUTES = ("/", "/about/", "/about/methodology/", "/actors/", "/actors/apt28/", "/sources/aivd-mivd-laundry-bear-2025/", "/search/", "/licence/", "/security/")
PROJECT_LINKS = (
    "https://hecavex.com/en/research/",
    "https://radar.hecavex.com/",
    "https://apt.hecavex.com/",
    "https://labs.hecavex.com/",
    "https://labs.hecavex.com/data/",
)
ACCESSIBLE_NAME_AUDIT = """elements => elements.filter(element => {
  const style = getComputedStyle(element);
  const closedDetails = element.closest('details:not([open])');
  const hiddenByDetails = closedDetails && !element.matches('summary') && !element.closest('summary');
  if (style.display === 'none' || style.visibility === 'hidden' || !element.getClientRects().length || element.closest('[inert], [aria-hidden="true"]') || hiddenByDetails) return false;
  const labelledBy = (element.getAttribute('aria-labelledby') || '').split(/\\s+/).filter(Boolean).map(id => document.getElementById(id)?.textContent || '').join(' ');
  const explicitLabel = element.id ? document.querySelector(`label[for="${CSS.escape(element.id)}"]`)?.textContent || '' : '';
  const wrappedLabel = element.closest('label')?.textContent || '';
  const ariaLabel = element.getAttribute('aria-label');
  const name = ariaLabel !== null ? ariaLabel : labelledBy || explicitLabel || wrappedLabel || element.innerText || element.getAttribute('title') || element.querySelector('img')?.getAttribute('alt') || '';
  return !name.trim();
}).map(element => `${element.tagName.toLowerCase()}#${element.id || '(no-id)'}${element.className ? '.' + String(element.className).trim().replace(/\\s+/g, '.') : ''}[href=${element.getAttribute('href') || ''}]`)"""
FOCUS_INDICATOR_AUDIT = """element => {
  if (document.activeElement !== element) return false;
  const candidates = [element, element.parentElement, element.closest('form')].filter(Boolean);
  return candidates.some(candidate => {
    const style = getComputedStyle(candidate);
    const outline = style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) >= 2;
    const shadow = style.boxShadow && style.boxShadow !== 'none';
    return outline || shadow;
  });
}"""
SCROLL_CONTAINMENT_AUDIT = """() => {
  const problems = [];
  const selector = element => `${element.tagName.toLowerCase()}${element.id ? '#' + element.id : ''}${element.className && typeof element.className === 'string' ? '.' + element.className.trim().replace(/\\s+/g, '.') : ''}`;
  for (const container of document.querySelectorAll('.table-wrap, pre, .identity-chain')) {
    if (!container.getClientRects().length || container.scrollWidth <= container.clientWidth + 1) continue;
    if (!['auto', 'scroll'].includes(getComputedStyle(container).overflowX)) problems.push(`${selector(container)} does not contain horizontal scrolling`);
  }
  for (const table of document.querySelectorAll('table')) {
    if (!table.getClientRects().length) continue;
    const container = table.closest('.table-wrap');
    if (container && table.getBoundingClientRect().width > container.clientWidth + 1 && !['auto', 'scroll'].includes(getComputedStyle(container).overflowX)) problems.push(`${selector(table)} is clipped instead of scrolling`);
    if (!container && table.getBoundingClientRect().right > innerWidth + 1) problems.push(`${selector(table)} escapes the viewport without a scroll container`);
  }
  return problems;
}"""


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


def normalise_project_link(value):
    if value.startswith("http://127.0.0.1:"):
        path = value.split("/", 3)[-1]
        return "https://apt.hecavex.com/" + path
    return value


def assert_focus_visible(locator, context):
    locator.focus()
    assert locator.evaluate(FOCUS_INDICATOR_AUDIT), f"focus indicator missing: {context}"


if not (PUBLIC_ROOT / "index.html").is_file():
    raise SystemExit("dist/index.html is missing; run npm run build first")

handler = partial(QuietHandler, directory=PUBLIC_ROOT)
server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
thread = threading.Thread(target=server.serve_forever, daemon=True)
thread.start()
base_url = f"http://127.0.0.1:{server.server_port}"
results = []
no_javascript_results = []
print_results = []

try:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        for width in WIDTHS:
            page = browser.new_page(viewport={"width": width, "height": HEIGHT})
            page_errors = []
            page.on("pageerror", lambda error, bucket=page_errors: bucket.append(str(error)))
            for route in ROUTES:
                page.goto(base_url + route, wait_until="domcontentloaded")
                page.wait_for_timeout(100)

                assert page.locator("h1").count() == 1, f"{route} at {width}px must have one h1"
                overflow = page.evaluate("""() => ({
                  documentWidth: document.documentElement.scrollWidth,
                  viewportWidth: document.documentElement.clientWidth,
                  layout: Object.fromEntries(['body', 'main', '.shell', '.profile-grid', '.profile-body', '.identity-chain', '.table-wrap'].map(selector => {
                    const element = document.querySelector(selector); const box = element?.getBoundingClientRect();
                    return [selector, element ? { left: box.left, right: box.right, width: box.width, clientWidth: element.clientWidth, scrollWidth: element.scrollWidth, overflowX: getComputedStyle(element).overflowX } : null];
                  })),
                  offenders: [...document.querySelectorAll('body *')].filter(element => {
                    const style = getComputedStyle(element);
                    const box = element.getBoundingClientRect();
                    return style.display !== 'none' && style.visibility !== 'hidden' && box.width && box.right > innerWidth + 1;
                  }).slice(0, 12).map(element => ({ selector: `${element.tagName.toLowerCase()}${element.id ? '#' + element.id : ''}${element.className && typeof element.className === 'string' ? '.' + element.className.trim().replace(/\\s+/g, '.') : ''}`, box: element.getBoundingClientRect().toJSON() }))
                })""")
                assert overflow["documentWidth"] <= overflow["viewportWidth"], f"page overflow: {route} at {width}px: {overflow}"
                heading_height = page.locator("h1").bounding_box()["height"]
                assert heading_height < HEIGHT * 0.55, f"heading consumes the viewport: {route} at {width}px"
                containment = page.evaluate(SCROLL_CONTAINMENT_AUDIT)
                assert not containment, f"wide content is not contained: {route} at {width}px: {containment}"

                assert_focus_visible(page.locator(".skip-link"), f"skip link on {route} at {width}px")
                page.locator(".skip-link").evaluate("element => element.blur()")
                unnamed = page.locator("a[href], button, summary, input:not([type=hidden]), select, textarea").evaluate_all(ACCESSIBLE_NAME_AUDIT)
                assert not unnamed, f"visible controls without accessible names: {route} at {width}px: {unnamed}"

                if route == "/actors/" and width <= 650:
                    advanced = page.locator("#advanced-actor-filters")
                    assert advanced.is_visible(), f"compact filter disclosure missing: {route} at {width}px"
                    assert not advanced.evaluate("element => element.open"), f"advanced filters should start collapsed: {route} at {width}px"
                    first_row = page.locator(".actor-row:not([hidden])").first.bounding_box()
                    assert first_row and first_row["y"] < HEIGHT, f"first actor result is still below the first viewport: {route} at {width}px: {first_row}"
                    summary = advanced.locator("summary")
                    assert_focus_visible(summary, f"advanced filter disclosure on {route} at {width}px")
                    page.keyboard.press("Enter")
                    assert advanced.evaluate("element => element.open"), f"advanced filters did not open: {route} at {width}px"
                    origin = advanced.locator('select[name="origin"]')
                    assert origin.is_visible(), f"advanced origin filter is hidden after opening: {route} at {width}px"
                    option = origin.locator("option").nth(1).get_attribute("value")
                    origin.select_option(option)
                    assert page.locator("[data-active-filter-count]").inner_text() == "1", f"active filter count did not update: {route} at {width}px"
                    page.locator(".filter-reset").focus()
                    page.keyboard.press("Enter")
                    page.wait_for_timeout(50)
                    assert page.locator("[data-active-filter-count]").inner_text() == "0", f"filter reset did not clear state: {route} at {width}px"
                    assert not advanced.evaluate("element => element.open"), f"filter reset did not collapse disclosure: {route} at {width}px"
                    assert page.locator(".actor-row:not([hidden])").count() == 4, f"filter reset did not restore actor rows: {route} at {width}px"

                if route == "/actors/" and width > 650:
                    advanced = page.locator("#advanced-actor-filters")
                    summary = advanced.locator("summary")
                    assert summary.is_visible(), f"advanced filter disclosure missing: {route} at {width}px"
                    assert not advanced.locator('select[name="origin"]').is_visible(), f"advanced filters should start collapsed: {route} at {width}px"
                    assert_focus_visible(summary, f"advanced filter disclosure on {route} at {width}px")
                    page.keyboard.press("Enter")
                    assert advanced.locator('select[name="origin"]').is_visible(), f"advanced filters did not open: {route} at {width}px"
                    page.keyboard.press("Enter")

                if route == "/actors/apt28/" and width <= 849:
                    mobile_toc = page.locator(".profile-toc-mobile")
                    assert mobile_toc.is_visible(), f"mobile profile contents missing: {route} at {width}px"
                    assert not page.locator(".profile-toc").is_visible(), f"desktop profile contents should be hidden on mobile: {route} at {width}px"
                    summary = mobile_toc.locator("summary")
                    assert_focus_visible(summary, f"mobile profile contents on {route} at {width}px")
                    page.keyboard.press("Enter")
                    assert mobile_toc.evaluate("element => element.open"), f"mobile profile contents did not open: {route} at {width}px"
                    sources_link = mobile_toc.locator('a[href="#sources"]')
                    assert sources_link.is_visible(), f"mobile profile contents omit Sources: {route} at {width}px"
                    sources_link.focus()
                    page.keyboard.press("Enter")
                    assert not mobile_toc.evaluate("element => element.open"), f"mobile profile contents did not close after navigation: {route} at {width}px"
                    assert page.evaluate("location.hash") == "#sources", f"mobile profile contents did not navigate: {route} at {width}px"

                if route == "/actors/apt28/" and width > 849:
                    assert page.locator(".profile-toc").is_visible(), f"desktop profile contents missing: {route} at {width}px"
                    assert not page.locator(".profile-toc-mobile").is_visible(), f"mobile profile contents should be hidden on desktop: {route} at {width}px"

                if route == "/about/":
                    summary_box = page.locator(".about-summary").bounding_box()
                    facts_box = page.locator(".about-head .project-facts").bounding_box()
                    assert summary_box and facts_box, f"about introduction or status context is missing: {route} at {width}px"
                    assert page.locator(".about-stats .stat").count() == 6, f"about catalogue statistics are incomplete: {route} at {width}px"
                    assert page.locator('.profile-toc a[href="#purpose"]').count() == 1, f"about contents omit Purpose: {route} at {width}px"
                    if width <= 849:
                        assert page.locator(".profile-toc-mobile").is_visible(), f"mobile about contents missing: {route} at {width}px"
                        assert not page.locator(".profile-toc").is_visible(), f"desktop about rail should be hidden on mobile: {route} at {width}px"
                        assert facts_box["y"] > summary_box["y"], f"about context does not stack below its introduction: {route} at {width}px"
                    else:
                        assert page.locator(".profile-toc").is_visible(), f"desktop about rail missing: {route} at {width}px"
                        assert not page.locator(".profile-toc-mobile").is_visible(), f"mobile about contents should be hidden on desktop: {route} at {width}px"
                        assert facts_box["x"] > summary_box["x"], f"about context does not occupy the right column: {route} at {width}px"

                if route.startswith("/sources/"):
                    facts = page.locator("[data-source-facts]")
                    assert facts.locator(".fact").count() == 6, f"source metadata is incomplete: {route} at {width}px"
                    language_box = facts.locator(".fact--language").bounding_box()
                    authors_box = facts.locator(".fact--authors").bounding_box()
                    grid_box = facts.bounding_box()
                    assert language_box and authors_box and grid_box, f"source metadata is not rendered: {route} at {width}px"
                    assert abs((authors_box["x"] + authors_box["width"]) - (grid_box["x"] + grid_box["width"] - 1)) <= 2, f"source metadata leaves a blank trailing track: {route} at {width}px"
                    if width > 849:
                        assert authors_box["width"] > language_box["width"] * 2.8, f"authors field does not span the remaining source tracks: {route} at {width}px"
                    else:
                        assert abs(authors_box["width"] - language_box["width"]) <= 2, f"source facts do not follow the responsive column count: {route} at {width}px"

                if width <= 1160:
                    navigation = page.locator(".mobile-navigation")
                    menu = navigation.locator("summary")
                    assert menu.is_visible(), f"mobile menu missing: {route} at {width}px"
                    assert_focus_visible(menu, f"menu control on {route} at {width}px")
                    page.keyboard.press("Enter")
                    assert navigation.evaluate("element => element.open"), f"mobile menu did not open: {route} at {width}px"
                    panel = navigation.locator(".mobile-navigation-panel")
                    assert panel.is_visible(), f"navigation panel hidden after opening: {route} at {width}px"
                    assert abs(menu.bounding_box()["height"] - 44) <= 1, f"mobile menu trigger height drifted: {route} at {width}px"
                    if width == 320:
                        assert abs(panel.bounding_box()["width"] - 288) <= 1, f"mobile menu panel width drifted: {route} at {width}px"
                    links = navigation.locator(".mobile-portfolio-navigation a").evaluate_all("links => links.map(link => link.href)")
                    links = tuple(normalise_project_link(value) for value in links)
                    assert links == PROJECT_LINKS, f"project navigation differs: {route} at {width}px: {links}"
                    current = navigation.locator('.mobile-portfolio-navigation a[aria-current="page"]')
                    assert current.count() == 1, f"project navigation must identify one current project: {route} at {width}px"
                    assert_focus_visible(navigation.locator(".mobile-product-navigation a").first, f"product link on {route} at {width}px")
                    unnamed = panel.locator("a[href], button, summary").evaluate_all(ACCESSIBLE_NAME_AUDIT)
                    assert not unnamed, f"open navigation controls without accessible names: {route} at {width}px: {unnamed}"
                    menu.focus()
                    page.keyboard.press("Escape")
                    assert not navigation.evaluate("element => element.open"), f"Escape did not close navigation: {route} at {width}px"
                    assert menu.evaluate("element => document.activeElement === element"), f"menu focus was not restored: {route} at {width}px"
                    assert menu.evaluate(FOCUS_INDICATOR_AUDIT), f"restored menu focus is invisible: {route} at {width}px"
                else:
                    header = page.locator('.site-header[data-portfolio-shell="v1"]')
                    assert abs(header.locator(".network-bar").bounding_box()["height"] - 64) <= 1, f"network row height drifted: {route} at {width}px"
                    assert abs(header.locator(".product-bar").bounding_box()["height"] - 52) <= 1, f"product row height drifted: {route} at {width}px"
                    assert abs(header.bounding_box()["height"] - 116) <= 1, f"masthead height drifted: {route} at {width}px"
                    project_navigation = page.locator(".portfolio-navigation")
                    assert project_navigation.is_visible(), f"desktop portfolio navigation missing: {route} at {width}px"
                    links = project_navigation.locator("a").evaluate_all("links => links.map(link => link.href)")
                    links = tuple(normalise_project_link(value) for value in links)
                    assert links == PROJECT_LINKS, f"desktop project navigation differs: {route} at {width}px: {links}"
                    assert project_navigation.locator('a[aria-current="page"]').count() == 1, f"desktop project navigation must identify one current project: {route} at {width}px"
                    assert_focus_visible(project_navigation.locator("a").first, f"desktop project link on {route} at {width}px")
                    if route == "/":
                        assert page.locator(".brand-hero").bounding_box()["height"] <= 430, f"home hero exceeds 430px at {width}px"

                results.append({"route": route, "width": width, "overflow": False, "scroll_containment": "pass", "keyboard_navigation": "pass", "accessibility_names": "pass", "focus": "pass"})

            assert not page_errors, f"browser errors at {width}px: {page_errors}"
            page.close()

        no_javascript = browser.new_context(java_script_enabled=False, viewport={"width": 390, "height": HEIGHT})
        page = no_javascript.new_page()
        page.goto(base_url + "/actors/", wait_until="domcontentloaded")
        navigation = page.locator(".mobile-navigation")
        navigation.locator("summary").click()
        assert navigation.locator(".mobile-navigation-panel").is_visible(), "no-JavaScript portfolio navigation cannot be disclosed"
        assert navigation.locator(".mobile-product-navigation a").count() == 10, "no-JavaScript product navigation is incomplete"
        navigation.locator("summary").click()
        assert page.locator(".actor-row").count() == 4, "no-JavaScript actor catalogue lost public rows"
        assert page.locator(".actor-row").evaluate_all("rows => rows.every(row => getComputedStyle(row).display !== 'none')"), "no-JavaScript actor rows are hidden"
        advanced = page.locator("#advanced-actor-filters")
        advanced.locator("summary").click()
        assert advanced.locator('select[name="origin"]').is_visible(), "no-JavaScript advanced filters cannot be disclosed"
        no_javascript_results.append({"route": "/actors/", "rows": 4, "native_navigation": "pass", "native_disclosure": "pass"})

        page.goto(base_url + "/actors/apt28/", wait_until="domcontentloaded")
        mobile_toc = page.locator(".profile-toc-mobile")
        mobile_toc.locator("summary").click()
        assert mobile_toc.locator('a[href="#sources"]').is_visible(), "no-JavaScript mobile profile contents cannot be disclosed"
        assert mobile_toc.locator("a").count() >= 10, "no-JavaScript mobile profile contents are incomplete"
        no_javascript_results.append({"route": "/actors/apt28/", "native_disclosure": "pass", "fragment_links": mobile_toc.locator("a").count()})

        page.goto(base_url + "/about/", wait_until="domcontentloaded")
        mobile_toc = page.locator(".profile-toc-mobile")
        mobile_toc.locator("summary").click()
        assert mobile_toc.locator("a").count() == 5, "no-JavaScript About contents are incomplete"
        purpose_link = mobile_toc.locator('a[href="#purpose"]')
        assert purpose_link.is_visible(), "no-JavaScript About contents omit Purpose"
        purpose_link.click()
        assert page.evaluate("location.hash") == "#purpose", "no-JavaScript About contents did not navigate"
        no_javascript_results.append({"route": "/about/", "native_disclosure": "pass", "fragment_links": mobile_toc.locator("a").count()})
        no_javascript.close()

        print_context = browser.new_context(viewport={"width": 1280, "height": HEIGHT})
        page = print_context.new_page()
        page.emulate_media(media="print")
        for route in ("/", "/actors/", "/actors/apt28/"):
            page.goto(base_url + route, wait_until="domcontentloaded")
            styles = page.evaluate("""() => Object.fromEntries(['body', 'h1', '.lead', '.fact', '.fact dd', '.assessment-strip', '.panel', 'th', 'td'].map(selector => {
              const element = document.querySelector(selector);
              if (!element) return [selector, null];
              const style = getComputedStyle(element);
              return [selector, { color: style.color, background: style.backgroundColor }];
            }))""")
            assert styles["body"]["background"] == "rgb(255, 255, 255)", f"print body is not white: {route}: {styles}"
            assert styles["body"]["color"] == "rgb(17, 17, 17)", f"print body text is not readable: {route}: {styles}"
            assert styles["h1"]["color"] == "rgb(0, 0, 0)", f"print heading is not black: {route}: {styles}"
            for selector in (".fact", ".assessment-strip", ".panel", "th", "td"):
                if not styles[selector]:
                    continue
                assert styles[selector]["background"] == "rgb(255, 255, 255)", f"print surface is not white: {route}: {selector}: {styles[selector]}"
                assert styles[selector]["color"] in ("rgb(0, 0, 0)", "rgb(17, 17, 17)"), f"print surface text is not readable: {route}: {selector}: {styles[selector]}"
            print_results.append({"route": route, "paper_background": "pass", "core_text": "pass", "surfaces": "pass"})
        print_context.close()
        browser.close()
finally:
    server.shutdown()
    server.server_close()

RESULTS.parent.mkdir(exist_ok=True)
RESULTS.write_text(json.dumps({"checked_widths": WIDTHS, "routes": ROUTES, "results": results, "no_javascript": no_javascript_results, "print": print_results}, indent=2) + "\n", encoding="utf-8")
print(f"Responsive checks passed for {len(ROUTES)} routes at {len(WIDTHS)} widths; evidence: {RESULTS.relative_to(ROOT)}")
