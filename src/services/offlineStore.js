import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const DATABASE_NAME = 'relieftrack-offline.db';
const DATABASE_KEY_NAME = 'relieftrack.offline.database_key';
const WEB_PREFIX = 'relieftrack.offline.';
let databasePromise;

export function createOfflineActionId() {
  const pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  return pattern.replace(/[xy]/g, (character) => {
    const random = Math.floor(Math.random() * 16);
    return (character === 'x' ? random : ((random & 0x3) | 0x8)).toString(16);
  });
}

async function getDatabase() {
  if (Platform.OS === 'web') return null;
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(DATABASE_NAME).then(async (database) => {
      const cipher = await database.getFirstAsync('PRAGMA cipher_version');
      if (!cipher?.cipher_version) {
        throw new Error('Encrypted offline storage is not available in this app build. Install a rebuilt ReliefTrack app to use offline data safely.');
      }
      let databaseKey = await SecureStore.getItemAsync(DATABASE_KEY_NAME);
      if (!databaseKey) {
        databaseKey = Array.from(await Crypto.getRandomBytesAsync(32))
          .map((byte) => byte.toString(16).padStart(2, '0'))
          .join('');
        await SecureStore.setItemAsync(DATABASE_KEY_NAME, databaseKey);
      }
      await database.execAsync(`PRAGMA key = '${databaseKey}';`);
      await database.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS cached_resources (
          beneficiary_id TEXT NOT NULL,
          resource_key TEXT NOT NULL,
          payload TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          PRIMARY KEY (beneficiary_id, resource_key)
        );
        CREATE TABLE IF NOT EXISTS pending_actions (
          id TEXT PRIMARY KEY NOT NULL,
          beneficiary_id TEXT NOT NULL,
          kind TEXT NOT NULL,
          payload TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
      `);
      return database;
    });
  }
  return databasePromise;
}

function webKey(beneficiaryId, suffix) {
  return `${WEB_PREFIX}${beneficiaryId}.${suffix}`;
}

export async function saveCachedResource(beneficiaryId, resourceKey, value) {
  const updatedAt = new Date().toISOString();
  const payload = JSON.stringify(value);
  const database = await getDatabase();
  if (database) {
    await database.runAsync(
      `INSERT INTO cached_resources (beneficiary_id, resource_key, payload, updated_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(beneficiary_id, resource_key) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at`,
      String(beneficiaryId), resourceKey, payload, updatedAt
    );
  } else {
    globalThis.localStorage?.setItem(webKey(beneficiaryId, `resource.${resourceKey}`), JSON.stringify({ value, updatedAt }));
  }
  return updatedAt;
}

export async function getCachedResource(beneficiaryId, resourceKey) {
  const database = await getDatabase();
  if (database) {
    const row = await database.getFirstAsync(
      'SELECT payload, updated_at FROM cached_resources WHERE beneficiary_id = ? AND resource_key = ?',
      String(beneficiaryId), resourceKey
    );
    return row ? { value: JSON.parse(row.payload), updatedAt: row.updated_at } : null;
  }
  const raw = globalThis.localStorage?.getItem(webKey(beneficiaryId, `resource.${resourceKey}`));
  return raw ? JSON.parse(raw) : null;
}

export async function enqueueOfflineAction(action) {
  const database = await getDatabase();
  const item = { ...action, createdAt: action.createdAt || new Date().toISOString() };
  if (database) {
    await database.runAsync(
      'INSERT OR IGNORE INTO pending_actions (id, beneficiary_id, kind, payload, created_at) VALUES (?, ?, ?, ?, ?)',
      item.id, String(item.beneficiaryId), item.kind, JSON.stringify(item.payload), item.createdAt
    );
  } else {
    const actions = await getOfflineActions(item.beneficiaryId);
    if (!actions.some((entry) => entry.id === item.id)) actions.push(item);
    globalThis.localStorage?.setItem(webKey(item.beneficiaryId, 'actions'), JSON.stringify(actions));
  }
  return item;
}

export async function getOfflineActions(beneficiaryId) {
  const database = await getDatabase();
  if (database) {
    const rows = await database.getAllAsync(
      'SELECT id, beneficiary_id, kind, payload, created_at FROM pending_actions WHERE beneficiary_id = ? ORDER BY created_at ASC',
      String(beneficiaryId)
    );
    return rows.map((row) => ({
      id: row.id,
      beneficiaryId: row.beneficiary_id,
      kind: row.kind,
      payload: JSON.parse(row.payload),
      createdAt: row.created_at,
    }));
  }
  try {
    return JSON.parse(globalThis.localStorage?.getItem(webKey(beneficiaryId, 'actions')) || '[]');
  } catch {
    return [];
  }
}

export async function removeOfflineAction(beneficiaryId, actionId) {
  const database = await getDatabase();
  if (database) {
    await database.runAsync('DELETE FROM pending_actions WHERE beneficiary_id = ? AND id = ?', String(beneficiaryId), actionId);
    return;
  }
  const actions = (await getOfflineActions(beneficiaryId)).filter((item) => item.id !== actionId);
  globalThis.localStorage?.setItem(webKey(beneficiaryId, 'actions'), JSON.stringify(actions));
}

export async function clearCachedResources(beneficiaryId) {
  const database = await getDatabase();
  if (database) {
    await database.runAsync('DELETE FROM cached_resources WHERE beneficiary_id = ?', String(beneficiaryId));
    return;
  }
  const prefix = webKey(beneficiaryId, 'resource.');
  const keys = [];
  for (let index = 0; index < (globalThis.localStorage?.length || 0); index += 1) {
    const key = globalThis.localStorage.key(index);
    if (key?.startsWith(prefix)) keys.push(key);
  }
  keys.forEach((key) => globalThis.localStorage.removeItem(key));
}
