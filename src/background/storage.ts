/* eslint-disable @typescript-eslint/no-explicit-any */
class ExtensionStorage {
  private storageKey: string;

  constructor() {
    this.storageKey = "extensionStorage";
  }

  // Set an item in storage
  setItem(key: string, value: any): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.get(this.storageKey, (result) => {
        const data = result[this.storageKey] || {};
        data[key] = value;
        chrome.storage.local.set({ [this.storageKey]: data }, () => {
          resolve();
        });
      });
    });
  }

  // Get an item from storage
  getItem(key: string): Promise<any> {
    return new Promise((resolve) => {
      chrome.storage.local.get(this.storageKey, (result) => {
        const data = result[this.storageKey] || {};
        resolve(data[key] || null);
      });
    });
  }

  // Remove an item from storage
  removeItem(key: string): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.get(this.storageKey, (result) => {
        const data = result[this.storageKey] || {};
        delete data[key];

        chrome.storage.local.set({ [this.storageKey]: data }, () => {
          resolve();
        });
      });
    });
  }

  // Clear all items in storage
  clear(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.remove(this.storageKey, () => {
        resolve();
      });
    });
  }

  // Get the length of the storage
  length(): Promise<number> {
    return new Promise((resolve) => {
      chrome.storage.local.get(this.storageKey, (result) => {
        const data = result[this.storageKey] || {};
        resolve(Object.keys(data).length);
      });
    });
  }

  // Get all keys in storage
  keys(): Promise<string[]> {
    return new Promise((resolve) => {
      chrome.storage.local.get(this.storageKey, (result) => {
        const data = result[this.storageKey] || {};
        resolve(Object.keys(data));
      });
    });
  }
}

// Example usage
export const extensionStorage = new ExtensionStorage();
export const enum PersistenceType {
  SESSION = "SESSION",
  LOCAL = "LOCAL",
  NONE = "NONE",
}

export const STORAGE_AVAILABLE_KEY = "__sak";

export type PersistedBlob = Record<string, unknown>;

export interface Instantiator<T> {
  (blob: PersistedBlob): T;
}

export type PersistenceValue = PersistedBlob | string;
export abstract class BrowserPersistenceClass {
  protected constructor(
    protected readonly storageRetriever: () => ExtensionStorage,
    readonly type: PersistenceType
  ) {}

  async _isAvailable(): Promise<boolean> {
    try {
      if (!this.storage) {
        return false;
      }
      await this.storage.setItem(STORAGE_AVAILABLE_KEY, "1");
      await this.storage.removeItem(STORAGE_AVAILABLE_KEY);
      return true;
    } catch {
      return false;
    }
  }

  async _set(key: string, value: PersistenceValue): Promise<void> {
    await this.storage.setItem(key, JSON.stringify(value));
  }

  async _get<T extends PersistenceValue>(key: string): Promise<T | null> {
    const json = await this.storage.getItem(key);
    return json ? JSON.parse(json) : null;
  }

  async _remove(key: string): Promise<void> {
    await this.storage.removeItem(key);
  }

  protected get storage(): ExtensionStorage {
    return this.storageRetriever();
  }
}

export class ExtensionPersistence extends BrowserPersistenceClass {
  // eslint-disable-next-line @typescript-eslint/prefer-as-const
  static type: "LOCAL" = "LOCAL";

  constructor() {
    super(() => new ExtensionStorage(), PersistenceType.LOCAL);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _addListener(_key: string, _listener: any): void {
    // Listeners are not supported for session storage since it cannot be shared across windows
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _removeListener(_key: string, _listener: any): void {
    // Listeners are not supported for session storage since it cannot be shared across windows
    return;
  }
}
