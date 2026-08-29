import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const client = await readFile(new URL('../payload/token-overview/profile/token-overview/lib/client.js', import.meta.url), 'utf8')

test('uses the shared Settings title contract with an older-host fallback', () => {
  assert.match(client, /SettingsSectionHeader: SharedSettingsSectionHeader/)
  assert.match(client, /SettingsSectionHeaderFallback/)
  assert.match(client, /React\.createElement\(SettingsSectionHeader/)
  assert.match(client, /data-settings-section-header/)
  assert.doesNotMatch(client, /to-title|to-head-main|to-title-row/)
})
