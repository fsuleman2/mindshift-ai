import { useCallback, useSyncExternalStore } from 'react'
import { readStorage, subscribeToStorageChange } from '@/storage/storageCore'
import type { StorageSchema } from '@/storage/schema'

/**
 * Reactive read access to a single storage domain. Re-renders when the
 * domain changes via StorageService (same tab) or another tab's write.
 * Use StorageService methods to mutate; this hook is read-only by design so
 * writes always go through the typed domain methods.
 */
export function useLocalStorage<K extends keyof StorageSchema>(key: K): StorageSchema[K] {
  const subscribe = useCallback(
    (onStoreChange: () => void) => subscribeToStorageChange(key, onStoreChange),
    [key],
  )
  const getSnapshot = useCallback(() => readStorage(key), [key])

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
