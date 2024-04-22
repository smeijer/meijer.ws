import * as colors from 'tailwindcss/colors';
import fs from 'fs';
import path from 'path';
import dracula from 'shiki/themes/dracula-soft.mjs';

const tokenColors = {};
for (const token of dracula.tokenColors) {
  if (!token.settings.foreground) continue;

  const scopes = Array.isArray(token.scope) ? token.scope : [token.scope];
  for (const scope of scopes) {
    if (scope.includes(' ')) continue;
    tokenColors[scope] = token.settings.foreground;
  }
}

type ColorScheme = Record<string, string | [string, string]>

const prettyLights: ColorScheme = {
  'comment': tokenColors['comment'],
  'constant': tokenColors['keyword'], // should be `constant`, but this matches darcula better
  'entity': tokenColors['entity.name.function'],
  'storage-modifier-import': tokenColors['entity.name.class'], // should be `storage.modifier.import`
  'entity-tag': tokenColors['entity.name.tag'],
  'keyword': tokenColors['keyword'],
  'string': tokenColors['string'],
  'variable': tokenColors['variable'],
  'brackethighlighter-unmatched': tokenColors['invalid'],
  'invalid-illegal-text': 'inherit',
  'invalid-illegal-bg': tokenColors['invalid'],
  'carriage-return-text': 'inherit',
  'carriage-return-bg': tokenColors['invalid'],
  'string-regexp': tokenColors['string.regexp'],
  'markup-list': tokenColors['beginning.punctuation.definition.list.markdown'],
  'markup-heading': tokenColors['markup.heading'],
  'markup-italic': tokenColors['markup.italic'],
  'markup-bold': tokenColors['markup.bold'],
  'markup-deleted-text': tokenColors['markup.deleted'],
  'markup-deleted-bg': 'inherit',
  'markup-inserted-text': tokenColors['markup.inserted'],
  'markup-inserted-bg': 'inherit',
  'markup-changed-text': tokenColors['markup.changed'],
  'markup-changed-bg': 'inherit',
  'markup-ignored-text': tokenColors['meta.diff'],
  'markup-ignored-bg': 'inherit',
  'meta-diff-range': tokenColors['meta.diff'],
  'brackethighlighter-angle': 'inherit',
  'sublimelinter-gutter-mark': 'inherit',
  'constant-other-reference-link': tokenColors['support'],
}

const colorVariables: ColorScheme = {
  'btn-text': [colors.zinc['900'], colors.zinc['300']],
  'btn-bg': [colors.zinc['50'], colors.zinc['800']],
  'btn-border': [colors.zinc['300'], colors.zinc['700']],
  'btn-shadow': 'none',
  'btn-inset-shadow': 'none',
  'btn-svg': [colors.zinc['500'], colors.zinc['500']],
  'btn-hover-bg': [colors.zinc['100'], colors.zinc['800']],
  'btn-hover-border': 'transparent',
  'btn-active-bg': [colors.zinc['100'], colors.zinc['800']],
  'btn-active-border': [colors.zinc['600'], colors.zinc['400']],
  'btn-selected-bg': [colors.zinc['600'], colors.zinc['400']],
  'btn-primary-text': [colors.zinc['100'], colors.zinc['300']],
  'btn-primary-bg': [colors.zinc['800'], colors.zinc['700']],
  'btn-primary-border': 'none',
  'btn-primary-shadow': 'none',
  'btn-primary-inset-shadow': 'none',
  'btn-primary-hover-bg': [colors.zinc['700'], colors.zinc['600']],
  'btn-primary-hover-border': 'none',
  'btn-primary-selected-bg': [colors.zinc['800'], colors.zinc['700']],
  'btn-primary-selected-shadow': 'none',
  'btn-primary-disabled-text': colors.zinc['50'],
  'btn-primary-disabled-bg': colors.zinc['500'],
  'btn-primary-disabled-border': 'transparent',
  'action-list-item-default-hover-bg': 'rgb(208 215 222 / 32%)',
  'segmented-control-bg': ['transparent', 'transparent'],
  'segmented-control-button-bg': [colors.zinc['50'], colors.zinc['800']],
  'segmented-control-button-selected-border': 'transparent',
  'fg-default': [colors.zinc['600'], colors.zinc['400']],
  'fg-muted': [colors.zinc['400'], colors.zinc['500']],
  'fg-subtle': [colors.zinc['400'], colors.zinc['500']],
  'fg-code': [colors.zinc['100'], colors.zinc['100']],
  'canvas-default': [colors.white, colors.black],
  'canvas-overlay': [colors.white, colors.black],
  'canvas-inset': [colors.zinc['50'], colors.zinc['900']],
  // background on code blocks, behind tabs, and around reply input
  'canvas-subtle': [colors.zinc['50'], colors.zinc['950']],
  'canvas-code': [colors.zinc['700'], colors.zinc['700']],
  // border around inputs and reaction button
  'border-default': [colors.zinc['100'], colors.zinc['700']],
  // border around comments
  'border-muted': [colors.zinc['100'], colors.zinc['700']],
  'border-btn': [colors.zinc['300'], colors.zinc['900']],
  'neutral-muted': 'rgb(175 184 193 / 20%)',
  'accent-fg': [colors.zinc['600'], colors.zinc['400']],
  'accent-emphasis': [colors.zinc['400'], colors.zinc['600']],
  'accent-muted': [colors.zinc['100'], colors.zinc['700']],
  'accent-subtle': [colors.sky['100'], colors.sky['900']],
  'success-fg': '#059669',
  'attention-fg': '#d97706',
  'attention-muted': '#d9770640',
  'attention-subtle': '#d9770610',
  'danger-fg': '#dc2626',
  'danger-muted': '#dc262640',
  'danger-subtle': '#dc262610',
  'primer-shadow-inset': 'none',
  'scale-gray-1': [colors.zinc['100'], colors.zinc['900']],
  'scale-blue-1': [colors.zinc['100'], colors.zinc['900']],
  /*! Extensions from @primer/css/alerts/flash.scss */
  'social-reaction-bg-hover': 'var(--color-scale-gray-1)',
  'social-reaction-bg-reacted-hover': 'var(--color-scale-blue-1)',
  'svg-fill': [colors.zinc['600'], colors.zinc['400']],
}


function getVariable(prefix: string, name: string, value: string | [string, string], mode: 'light' | 'dark') {
  const colors = Array.isArray(value) ? value : [value, value];
  value = mode === 'dark' ? (colors[1] || colors[0]) : colors[0];
  return `--${prefix}-${name}: ${value};`
}

function getVariables(object: ColorScheme, prefix: string, mode: 'light' | 'dark') {
  const entries = Object.entries(object);
  return entries.map(([k, v]) => getVariable(prefix, k, v, mode)).join('\n  ')
}

function generateStyleSheet(mode: 'light' | 'dark') {
  return `
main {
  ${getVariables(prettyLights, 'color-prettylights-syntax', mode)}
  ${getVariables(colorVariables, 'color', mode)}
}

main .pagination-loader-container {
  background-image: url("https://github.com/images/modules/pulls/progressive-disclosure-line.svg");
}

main .gsc-loading-image {
  background-image: url("https://github.githubassets.com/images/mona-loading-default.gif");
}

.BtnGroup-item.BtnGroup-item--selected {
  font-weight: 500;
}

.gsc-reactions .gsc-reactions-count {
  display: none;
}

.gsc-reactions-count, .gsc-comments-count, .gsc-replies-count {
  font-size: 0.875rem;
  line-height: 1.5;
}

.gsc-left-header .text-sm {
  font-size: 0.6875rem !important;
}

.gsc-comment-content.markdown .highlight pre,
.gsc-reply-content.markdown .highlight pre{
  background-color: var(--color-canvas-code);
  color: var(--color-fg-code);
  line-height: 1.75rem;
  font-size: .875rem;
}

.gsc-social-reaction-summary-item {
  border-color: var(--color-btn-border);
  color: var(--color-btn-text);
}

.gsc-social-reaction-summary-item svg {
  fill: var(--color-btn-svg);
}

.ClipboardButton {
  background: none;
}
`.trimStart();
}

fs.writeFile(path.join(process.cwd(), 'public', 'giscus-light.css'), generateStyleSheet('light'), { encoding: 'utf-8' }, () => null);
fs.writeFile(path.join(process.cwd(), 'public', 'giscus-dark.css'), generateStyleSheet('dark'), { encoding: 'utf-8' }, () => null);
console.log('generated', new Date().toISOString());
