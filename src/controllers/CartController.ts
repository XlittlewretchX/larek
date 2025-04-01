import { Cart } from '../models/Cart';
import { IProduct } from '../types';
import { Modal } from '../views/Modal';
import { CartView } from '../views/CartView';
import { OrderController } from './OrderController';
import { EventEmitter } from '../components/base/events';

export class CartController {
    constructor(
        private modal: Modal,
        private orderController: OrderController,
        private events: EventEmitter,
        private cart: Cart
    ) {}

    addToCart(product: IProduct): void {
        this.cart.addItem(product);
        this.updateCounter();
        console.log('Товары в корзине после добавления:', this.cart.getItems());
        this.modal.close();
    }

    removeFromCart(productId: string): void {
        this.cart.removeItem(productId);
        this.updateCounter();
        this.openCart();
    }

    openCart(): void {
        console.log('Товары в корзине перед открытием:', this.cart.getItems());
        const cartView = new CartView(
            this.cart.getItems(),
            (productId) => this.removeFromCart(productId),
            () => this.orderController.startOrder()
        );
        this.modal.setContent(cartView.getElement());
        this.modal.open();
    }

    isInCart(productId: string): boolean {
        return this.cart.getItems().some((item) => item.id === productId);
    }

    private updateCounter(): void {
        this.events.emit('cart:updated', { items: this.cart.getItems() });
    }
}
