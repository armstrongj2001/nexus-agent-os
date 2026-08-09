import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

const pluginUrl = new URL('./plugin.js', import.meta.url)
const source = await readFile(pluginUrl, 'utf8')

test('plugin is valid JavaScript', () => {
  const result = spawnSync(process.execPath, ['--check', pluginUrl.pathname], {
    encoding: 'utf8',
  })
  assert.equal(result.status, 0, result.stderr)
})

test('plugin registers the native NEXUS page and navigation surfaces', () => {
  assert.match(source, /id:\s*ID/)
  assert.match(source, /const ID = ['"]nexus-control['"]/)
  for (const token of ['ROUTES_AREA', 'SIDEBAR_NAV_AREA', 'PALETTE_AREA', 'STATUSBAR_AREAS']) {
    assert.match(source, new RegExp(`\\b${token}\\b`), `missing ${token}`)
  }
  assert.match(source, /const ROUTE = ['"]\/nexus['"]/)
  assert.match(source, /path:\s*ROUTE/)
})

test('mission control reads Hermes state instead of recreating it', () => {
  for (const atom of ['gateway', 'profile', 'model', 'cwd', 'activeSessionId']) {
    assert.match(source, new RegExp(`host\\.state\\.${atom}`), `missing ${atom} state`)
  }
  assert.match(source, /host\.status\(\)/)
  assert.match(source, /useQuery\s*\(/)
})

test('mission control links to native Hermes capabilities', () => {
  for (const route of ['/kanban', '/cron', '/skills', '/artifacts', '/settings']) {
    assert.match(source, new RegExp(`host\\.navigate\\(['"]${route}['"]\\)`), `missing native route ${route}`)
  }
})

test('mission map reflects the current operating priorities', () => {
  for (const priority of ['Pulled, Phase 2', 'Pricing leverage', 'Close before opening']) {
    assert.match(source, new RegExp(priority.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
  }
})

test('plugin preserves the safety boundary', () => {
  const forbidden = [
    /child_process/,
    /\bfetch\s*\(/,
    /ctx\.rest\s*\(/,
    /useMutation\s*\(/,
    /host\.request\s*\(/,
    /host\.restartGateway\s*\(/,
    /config\.set/,
    /--yolo/,
    /--accept-hooks/,
    /openExternal\s*\(/,
    /#[0-9a-fA-F]{3,8}\b/,
    /\brgb\s*\(/,
  ]
  for (const pattern of forbidden) {
    assert.doesNotMatch(source, pattern, `forbidden capability found: ${pattern}`)
  }
})

test('disk plugin imports only supported SDK modules', () => {
  const specifiers = [...source.matchAll(/from\s+['"]([^'"]+)['"]/g)].map(match => match[1])
  assert.deepEqual([...new Set(specifiers)].sort(), ['@hermes/plugin-sdk', 'react/jsx-runtime'])
})
