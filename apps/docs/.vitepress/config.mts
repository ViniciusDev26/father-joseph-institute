import { readdirSync, statSync } from 'node:fs';
import { basename, extname, join, relative, resolve } from 'node:path';
import { defineConfig } from 'vitepress';

const docsRoot = resolve(__dirname, '..');

type SidebarItem = {
  text: string;
  link?: string;
  items?: SidebarItem[];
  collapsed?: boolean;
};

const LABEL_OVERRIDES: Record<string, string> = {
  IDEA: 'Visão Geral',
  README: 'Introdução',
  adr: 'ADRs',
  api: 'API',
  backend: 'Backend',
  frontend: 'Frontend',
  site: 'Site',
};

function toTitleCase(value: string) {
  const normalized = value
    .replace(/^\d+[-_]?/, '')
    .replace(/[-_]/g, ' ')
    .trim();

  if (!normalized) {
    return value;
  }

  return normalized
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getLabel(name: string, parent?: string) {
  if (LABEL_OVERRIDES[name]) return LABEL_OVERRIDES[name];

  if (parent === 'specs' && name === 'api') return 'API Contract';
  if (parent === 'specs' && name === 'backend') return 'Backend Specs';
  if (parent === 'specs' && name === 'frontend') return 'Frontend Specs';

  return toTitleCase(name);
}

function toDocLink(filePath: string) {
  const relativePath = relative(docsRoot, filePath).replace(/\\/g, '/');

  if (relativePath === 'index.md') {
    return '/';
  }

  // Com cleanUrls: true, removemos .md e o sufixo /README
  if (relativePath.endsWith('/README.md')) {
    return `/${relativePath.slice(0, -'/README.md'.length)}`;
  }
  
  if (relativePath === 'README.md') {
    return '/';
  }

  return `/${relativePath.replace(/\.md$/, '')}`;
}

function buildSidebarItems(dirPath: string): SidebarItem[] {
  const entries = readdirSync(dirPath)
    .filter((entry) => !entry.startsWith('.'))
    .sort((left, right) => left.localeCompare(right, 'en'));

  const items: SidebarItem[] = [];

  for (const entry of entries) {
    const fullPath = join(dirPath, entry);
    const stats = statSync(fullPath);
    const name = basename(entry, '.md');

    if (stats.isDirectory()) {
      const childItems = buildSidebarItems(fullPath);
      if (childItems.length > 0) {
        items.push({
          text: getLabel(entry, basename(dirPath)),
          collapsed: true,
          items: childItems,
        });
      }
      continue;
    }

    if (extname(entry) !== '.md' || entry === 'index.md' || entry === 'README.md' || entry.startsWith('_')) {
      continue;
    }

    items.push({
      text: getLabel(name, basename(dirPath)),
      link: toDocLink(fullPath),
    });
  }

  return items;
}

const sidebar: SidebarItem[] = [
  { text: 'Início', link: '/' },
  { text: 'Visão Geral', link: '/IDEA' },
  {
    text: 'ADRs',
    link: '/adr',
    items: buildSidebarItems(join(docsRoot, 'adr'))
  },
  {
    text: 'Specs',
    link: '/specs',
    items: buildSidebarItems(join(docsRoot, 'specs'))
  },
];

export default defineConfig({
  title: 'Instituto Padre José',
  description: 'Documentação técnica do projeto Instituto Padre José',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Início', link: '/' },
      { text: 'Visão Geral', link: '/IDEA' },
      { text: 'ADRs', link: '/adr' },
      { text: 'Specs', link: '/specs' },
    ],
    sidebar,
    outline: {
        label: 'Nesta página',
        level: [2, 3]
    },
    docFooter: {
        prev: 'Anterior',
        next: 'Próxima'
    },
    search: {
      provider: 'local',
    },
  },
});
