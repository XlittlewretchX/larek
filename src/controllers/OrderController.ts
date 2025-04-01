import { Api } from '../components/base/api';
import { Cart } from '../models/Cart';
import { CustomerData } from '../models/CustomerData';
import { Order } from '../models/Order';
import { Modal } from '../views/Modal';
import { OrderForm } from '../views/OrderForm';
import { ContactsForm } from '../views/ContactsForm';
import { OrderSuccess } from '../views/OrderSuccess';
import { IApiOrderRequest } from '../types';

export class OrderController {
    private customerData: CustomerData = new CustomerData();

    constructor(
        private cart: Cart,
        private modal: Modal,
        private api: Api
    ) {}

    startOrder(): void {
        const orderForm = new OrderForm((data) => {
            this.customerData.payment = data.payment;
            this.customerData.address = data.address;
            this.openContactsForm();
        });
        this.modal.setContent(orderForm.getElement());
        this.modal.open();
    }

    openContactsForm(): void {
        const contactsForm = new ContactsForm((data) => {
            this.customerData.email = data.email;
            this.customerData.phone = data.phone;
            this.submitOrder();
        });
        this.modal.setContent(contactsForm.getElement());
        this.modal.open();
    }

    async submitOrder(): Promise<void> {
        const items = this.cart.getItems();
        const total = this.cart.getTotal();
        console.log('Товары в корзине перед оформлением заказа:', items);

        if (items.length === 0) {
            console.error('Ошибка: корзина пуста');
            return;
        }
        if (total <= 0) {
            console.error('Ошибка: некорректная сумма заказа');
            return;
        }

        const order = new Order(items, this.customerData, total);
        const request: IApiOrderRequest = {
            payment: order.customerData.payment,
            email: order.customerData.email,
            phone: order.customerData.phone,
            address: order.customerData.address,
            total: order.total,
            items: order.products.map((p) => p.id)
        };

        try {
            console.log('Отправляемый запрос:', request);
            await this.api.post('/order', request);
            this.cart.clear();
            this.updateCartCounter();
            this.openOrderSuccess(order.total);
        } catch (error: any) {
            console.error('Ошибка при оформлении заказа:', error);
        }
    }

    private updateCartCounter(): void {
        const cartCounter = document.querySelector('.cart-counter');
        if (cartCounter) {
            cartCounter.textContent = '0';
        }
    }

    openOrderSuccess(total: number): void {
        const success = new OrderSuccess(total, () => this.modal.close());
        this.modal.setContent(success.getElement());
        this.modal.open();
    }
}
