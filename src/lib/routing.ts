// lib/routing.ts
export const dynamic = "force-dynamic";
export type PageLite = { title?: string; slug?: string; type?: string };
export type NavItem = { label: string; url: string; is_external: boolean; order: number };

const trimSlashes = (s = "") => s.replace(/\\/g, "").trim().replace(/^\/+|\/+$/g, "");
const toPath = (slug?: string) => !slug || slug === "homepage" ? "/" : `/${trimSlashes(slug)}`;

/** label normalizer, e.g. "About Us" -> "about" */
const norm = (s = "") =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();

/** Build quick lookup from pages */
export function buildPageIndex(pages: PageLite[]) {
  const bySlug = new Map<string, PageLite>();
  const byTitle = new Map<string, PageLite>();

  for (const p of pages) {
    if (p.slug) bySlug.set(trimSlashes(p.slug.toLowerCase()), p);
    if (p.title) byTitle.set(norm(p.title), p);
  }
  return { bySlug, byTitle };
}

/** Try to find a Page for a given nav label/url */
export function matchPageForNav(
  item: NavItem,
  pages: PageLite[],
  aliases: Record<string, string> = {}
): PageLite | null {
  const { bySlug, byTitle } = buildPageIndex(pages);

  // 1) direct URL path -> slug match
  const rawPath = trimSlashes(item.url || "");
  const path = rawPath.toLowerCase();

  // common “about-us” => “about” kind of aliasing
  const aliasHit = aliases[path];
  if (aliasHit && bySlug.get(aliasHit)) return bySlug.get(aliasHit)!;

  if (bySlug.get(path)) return bySlug.get(path)!;

  // handle “home” path mapping to homepage
  if (path === "home" || path === "") {
    const home = pages.find((p) => p.slug === "homepage");
    if (home) return home;
  }

  // 2) label match (e.g. label "About" -> page.title "About")
  const labelKey = norm(item.label);
  const titleHit = byTitle.get(labelKey);
  if (titleHit) return titleHit;

  // 3) heuristics for typical pairs
  const heuristics: Record<string, string> = {
    "about-us": "about",
    "our-services": "service",
    "contact-us": "contact",
    "blogs": "blog",
    "home": "homepage",
  };
  const h = heuristics[path] || heuristics[labelKey];
  if (h && bySlug.get(h)) return bySlug.get(h)!;

  return null;
}

/** Rewrite Header/Footer navigation to our app routes based on page slugs */
export function rewriteNavWithPages(
  nav: NavItem[] = [],
  pages: PageLite[] = [],
  aliasMap: Record<string, string> = {}
): NavItem[] {
  return nav.map((n) => {
    // external? keep as-is
    if (n.is_external || /^https?:\/\//i.test(n.url || "")) return n;

    const matched = matchPageForNav(n, pages, aliasMap);
    if (!matched) return { ...n, url: normalizeInternal(n.url) };

    const href = toPath(matched.slug);
    return { ...n, url: href };
  });
}

export function normalizeInternal(raw?: string) {
  if (!raw) return "/";
  let u = trimSlashes(raw);
  if (!u) return "/";
  if (u.toLowerCase() === "home") return "/";
  return `/${u}`;
}
