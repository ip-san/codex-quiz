type WritableStorage = Pick<Storage, "setItem" | "removeItem">;

export function writeStoredJson(key: string, value: unknown, storage?: WritableStorage): boolean {
  try {
    (storage ?? window.localStorage).setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeStoredItem(key: string, storage?: WritableStorage): boolean {
  try {
    (storage ?? window.localStorage).removeItem(key);
    return true;
  } catch {
    return false;
  }
}
