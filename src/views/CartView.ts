import { IProduct } from '../types';
import { getTemplate } from '../utils/utils';

export class CartView {
    private element: HTMLElement;

    constructor(
        private cartItems: IProduct[],
        private onRemoveFromCart: (productId: string) => void,
        private onCheckout: () => void
    ) {
        this.element = this.render();
        this.bindEvents();
    }

    render(): HTMLElement {
        console.log('Товары для рендеринга:', this.cartItems);
        const template = getTemplate('basket');
        const basketFragment = template.content.cloneNode(true) as DocumentFragment;
        const basketElement = basketFragment.querySelector('.basket') as HTMLElement;
        const list = basketFragment.querySelector('.basket__list') as HTMLElement;
        if (!list) {
            console.error('Элемент .basket__list не найден в шаблоне');
            return basketElement;
        }

        if (this.cartItems.length === 0) {
            list.innerHTML = '<h2 class="modal__title">Пока тут пусто...</h2>';
        } else {
            const itemsHtml = this.cartItems.map((item, index) => {
                const itemTemplate = getTemplate('card-basket');
                const itemFragment = itemTemplate.content.cloneNode(true) as DocumentFragment;
                const itemElement = itemFragment.querySelector('.basket__item') as HTMLElement;
                if (itemElement) {
                    const indexElement = itemElement.querySelector('.basket__item-index');
                    const titleElement = itemElement.querySelector('.card__title');
                    const priceElement = itemElement.querySelector('.card__price');
                    if (indexElement) indexElement.textContent = (index + 1).toString();
                    if (titleElement) titleElement.textContent = item.title;
                    if (priceElement) priceElement.textContent = `${item.price} синапсов`;
                    itemElement.setAttribute('data-id', item.id);
                    return itemElement.outerHTML;
                } else {
                    console.error('Не найден элемент .basket__item в шаблоне');
                    return '';
                }
            }).join('');
            list.innerHTML = itemsHtml;
        }

        const total = this.cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
        const priceElement = basketFragment.querySelector('.basket__price');
        if (priceElement) {
            priceElement.textContent = `${total} синапсов`;
        } else {
            console.error('Элемент .basket__price не найден');
        }

        return basketElement;
    }

    bindEvents(): void {
        this.element.querySelectorAll('.basket__item-delete').forEach((button) => {
            button.addEventListener('click', (e) => {
                const item = (e.target as HTMLElement).closest('.basket__item') as HTMLElement;
                const productId = item.dataset.id!;
                this.onRemoveFromCart(productId);
            });
        });

        const checkoutButton = this.element.querySelector('.basket__button') as HTMLButtonElement;
        if (checkoutButton) {
            checkoutButton.disabled = this.cartItems.length === 0;
            checkoutButton.addEventListener('click', this.onCheckout);
        }
    }

    getElement(): HTMLElement {
        return this.element;
    }
}
