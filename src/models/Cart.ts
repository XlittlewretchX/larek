import { IProduct } from '../types';
import { EventEmitter } from '../components/base/events';

export class Cart {
    private items: IProduct[] = [];

    constructor(private events: EventEmitter) {}

    addItem(product: IProduct): void {
        if (!this.items.some(item => item.id === product.id)) {
            this.items.push(product);
            this.events.emit('cart:updated', { items: this.items });
        }
    }

    removeItem(productId: string): void {
        this.items = this.items.filter(item => item.id !== productId);
        this.events.emit('cart:updated', { items: this.items });
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getTotal(): number {
        return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
    }

    clear(): void {
        this.items = [];
        this.events.emit('cart:updated', { items: this.items });
    }
}
