
import { BaseStorageService } from './baseStorageService';
import { StoredContent } from '../localStorageService';

export class ContentStorageService extends BaseStorageService {
  getContent(): StoredContent[] {
    return this.get<StoredContent>(this.getKey('content'));
  }

  setContent(content: StoredContent[]): void {
    this.set(this.getKey('content'), content);
  }

  addContent(item: StoredContent): void {
    this.addItem(this.getKey('content'), item);
  }

  deleteContent(id: string): void {
    this.deleteItem(this.getKey('content'), id);
  }
}
