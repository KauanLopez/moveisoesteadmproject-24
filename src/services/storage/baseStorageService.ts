
// Base storage service with generic methods
export class BaseStorageService {
  protected getKey(type: string): string {
    return `moveis_oeste_${type}`;
  }

  protected get<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return [];
    }
  }

  protected set<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
    }
  }

  protected addItem<T extends { id: string }>(key: string, item: T): void {
    const items = this.get<T>(key);
    const existingIndex = items.findIndex(i => i.id === item.id);
    if (existingIndex >= 0) {
      items[existingIndex] = item;
    } else {
      items.push(item);
    }
    this.set(key, items);
  }

  protected deleteItem<T extends { id: string }>(key: string, id: string): void {
    const items = this.get<T>(key);
    const filtered = items.filter((item: T) => item.id !== id);
    this.set(key, filtered);
  }

  clearAllData(): void {
    localStorage.removeItem(this.getKey('content'));
    localStorage.removeItem(this.getKey('catalogs'));
    localStorage.removeItem(this.getKey('catalog_items'));
    localStorage.removeItem(this.getKey('external_catalogs'));
    localStorage.removeItem(this.getKey('pdf_catalogs'));
  }
}
