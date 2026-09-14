import { readFileSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';
import { describe, expect, test } from 'vitest';

/**
 * `vercel.json` is deployed as static, declarative configuration — there is
 * no application code to import here. This test reads and JSON-parses the
 * file directly, then mimics Vercel's documented redirect-matching
 * semantics for the subset of features this project uses:
 *   - exact `source` path match (no wildcards/params are used here)
 *   - every `has` condition (all are `type: "query"`) must match the
 *     request's query string
 *   - the first matching rule in array order wins
 *
 * See https://vercel.com/docs/project-configuration/vercel-json#redirects
 */

interface HasCondition {
  type: string;
  key: string;
  value?: string;
}

interface RedirectRule {
  source: string;
  destination: string;
  statusCode?: number;
  permanent?: boolean;
  has?: HasCondition[];
}

interface VercelConfig {
  $schema?: string;
  redirects?: RedirectRule[];
  regions?: string[];
}

const vercelJsonPath = resolvePath(import.meta.dirname, '../../../vercel.json');
const config = JSON.parse(readFileSync(vercelJsonPath, 'utf-8')) as VercelConfig;
const redirects = config.redirects ?? [];

interface ResolvedRedirect {
  destination: string;
  statusCode: number | undefined;
}

function resolveRedirect(url: string): ResolvedRedirect | null {
  const { pathname, searchParams } = new URL(url, 'https://mansurney.com');

  for (const rule of redirects) {
    if (rule.source !== pathname) continue;

    const conditions = rule.has ?? [];
    const matches = conditions.every((condition) => {
      if (condition.type !== 'query') return false;
      const actual = searchParams.get(condition.key);
      if (actual === null) return false;
      if (condition.value !== undefined && actual !== condition.value) return false;
      return true;
    });

    if (matches) {
      return { destination: rule.destination, statusCode: rule.statusCode };
    }
  }

  return null;
}

describe('vercel.json redirects', () => {
  test.each([
    ['/index.php', '/'],
    ['/icerik.php?id=10', '/ney-rehberi/tarihce'],
    ['/icerik.php?id=10&s=neyin-tarihcesi', '/ney-rehberi/tarihce'],
    ['/icerik.php?id=11', '/ney-rehberi/yapimi'],
    ['/icerik.php?id=11&s=neyin-yapimi', '/ney-rehberi/yapimi'],
    ['/icerik.php?id=12', '/ney-rehberi/bolumleri'],
    ['/icerik.php?id=13', '/ney-rehberi/bakimi'],
    ['/icerik.php?id=13&s=neyin-bakimi', '/ney-rehberi/bakimi'],
    ['/icerik.php?id=14', '/ney-cantasi'],
    ['/icerik.php?id=53', '/akortlar'],
    ['/icerik.php?id=54', '/akortlar'],
    ['/icerik.php?id=999', '/ney-rehberi'],
    ['/icerik.php', '/ney-rehberi'],
    ['/siparis.php', '/siparis'],
    ['/iletisim.php', '/iletisim'],
    ['/fotogaleri.php', '/galeri'],
    ['/fotogaleri.php?id=3', '/galeri'],
    ['/galeri.php', '/galeri'],
    ['/galeri.php?id=13', '/galeri'],
    ['/haberler.php', '/'],
    ['/haber.php?id=4', '/'],
    ['/haber.php?id=5', '/ney-cantasi'],
    ['/haber.php', '/'],
    ['/kategori.php', '/'],
    ['/kategori.php?id=92&s=haberler', '/'],
  ])('%s → %s', (from, to) => {
    expect(resolveRedirect(from)?.destination).toBe(to);
  });

  test.each(['/', '/siparis', '/en/contact', '/02.htm', '/d/10/neyin-tarihcesi'])(
    '%s yönlendirilmez',
    (path) => {
      expect(resolveRedirect(path)).toBeNull();
    },
  );

  test('her yönlendirme 301 statusCode kullanır', () => {
    expect(redirects.length).toBeGreaterThan(0);
    for (const rule of redirects) {
      expect(rule.statusCode).toBe(301);
    }
  });

  test('regions yalnızca fra1 içerir', () => {
    expect(config.regions).toEqual(['fra1']);
  });
});
