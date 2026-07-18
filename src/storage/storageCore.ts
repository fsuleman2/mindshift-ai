import { SCHEMA_VERSION, STORAGE_DEFAULTS, STORAGE_PREFIX, type StorageSchema } from './schema'

interface StorageEnvelope<T> {
  v: number
  data: T
}

const CHANGE_EVENT = 'mindshift:storage-change'

export interface StorageChangeDetail<K extends keyof StorageSchema = keyof StorageSchema> {
  key: K
}

function fullKey(key: keyof StorageSchema): string {
  return `${STORAGE_PREFIX}:${key}`
}

function isLocalStorageAvailable(): boolean {
  try {
    const testKey = `${STORAGE_PREFIX}:__test__`
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

export const storageAvailable = isLocalStorageAvailable()

// Caches the last-parsed value per key, keyed by its raw string, so repeated
// reads of an unchanged key return the same object reference. This matters
// for useSyncExternalStore consumers: a fresh object on every call would
// look like a change on every render and loop forever.
const parseCache = new Map<string, { raw: string; value: unknown }>()

/**
 * Reads a domain value from localStorage. Falls back to the schema default on
 * missing data, JSON corruption, or a schema version mismatch (no migration
 * path exists yet for v1, so mismatched envelopes are treated as corrupt).
 */
export function readStorage<K extends keyof StorageSchema>(key: K): StorageSchema[K] {
  if (!storageAvailable) return STORAGE_DEFAULTS[key]

  const raw = window.localStorage.getItem(fullKey(key))
  if (!raw) return STORAGE_DEFAULTS[key]

  const cached = parseCache.get(key)
  if (cached && cached.raw === raw) {
    return cached.value as StorageSchema[K]
  }

  try {
    const envelope = JSON.parse(raw) as StorageEnvelope<StorageSchema[K]>
    if (!envelope || typeof envelope !== 'object' || envelope.v !== SCHEMA_VERSION) {
      return STORAGE_DEFAULTS[key]
    }
    const value = envelope.data ?? STORAGE_DEFAULTS[key]
    parseCache.set(key, { raw, value })
    return value
  } catch {
    return STORAGE_DEFAULTS[key]
  }
}

export function writeStorage<K extends keyof StorageSchema>(key: K, data: StorageSchema[K]): void {
  if (!storageAvailable) return

  const envelope: StorageEnvelope<StorageSchema[K]> = { v: SCHEMA_VERSION, data }
  try {
    window.localStorage.setItem(fullKey(key), JSON.stringify(envelope))
    window.dispatchEvent(new CustomEvent<StorageChangeDetail<K>>(CHANGE_EVENT, { detail: { key } }))
  } catch {
    // Storage full or unavailable mid-session; fail silently rather than crash the app.
  }
}

export function clearStorageKey(key: keyof StorageSchema): void {
  if (!storageAvailable) return
  window.localStorage.removeItem(fullKey(key))
  window.dispatchEvent(new CustomEvent<StorageChangeDetail>(CHANGE_EVENT, { detail: { key } }))
}

export function clearAllStorage(): void {
  if (!storageAvailable) return
  for (const key of Object.keys(STORAGE_DEFAULTS) as (keyof StorageSchema)[]) {
    window.localStorage.removeItem(fullKey(key))
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { key: 'all' } }))
}

export function subscribeToStorageChange(
  key: keyof StorageSchema,
  callback: () => void,
): () => void {
  const handler = (event: Event) => {
    const detail = (event as CustomEvent<StorageChangeDetail | { key: 'all' }>).detail
    if (detail.key === key || detail.key === 'all') callback()
  }
  const nativeHandler = (event: StorageEvent) => {
    if (event.key === fullKey(key)) callback()
  }

  window.addEventListener(CHANGE_EVENT, handler)
  window.addEventListener('storage', nativeHandler)
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler)
    window.removeEventListener('storage', nativeHandler)
  }
}
