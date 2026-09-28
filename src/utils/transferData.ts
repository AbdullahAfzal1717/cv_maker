const STORAGE_PREFIX = "cvmaker_transfer_";

export function setTransferData<T>(key: string, data: T): void {
  try {
    sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(data));
  } catch {
    // Silently fail if sessionStorage is full
  }
}

export function getTransferData<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function clearTransferData(key: string): void {
  sessionStorage.removeItem(`${STORAGE_PREFIX}${key}`);
}
