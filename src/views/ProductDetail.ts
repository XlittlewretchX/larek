import { IProduct } from '../types';
import { getCategoryClass } from '../utils/utils';
import { getTemplate } from '../utils/utils';

export class ProductDetail {
	private element: HTMLElement;

	constructor(
		private product: IProduct,
		private onAddToCart: (product: IProduct) => void,
		private inCart: boolean
	) {
		this.element = this.render();
		this.bindEvents();
	}

	render(): HTMLElement {
		const template = getTemplate('card-preview');
		const detailFragment = template.content.cloneNode(true) as DocumentFragment;
		const detail = detailFragment.firstElementChild as HTMLElement;

		const categoryElement = detail.querySelector('.card__category');
		if (categoryElement) {
			categoryElement.className = 'card__category';
			categoryElement.classList.add(getCategoryClass(this.product.category));
			categoryElement.textContent = this.product.category;
		}

		const titleElement = detail.querySelector('.card__title');
		if (titleElement) {
			titleElement.textContent = this.product.title;
		}

		const imageElement = detail.querySelector('.card__image');
		if (imageElement) {
			imageElement.setAttribute('src', 'images' + this.product.image);
		}

		const textElement = detail.querySelector('.card__text');
		if (textElement) {
			textElement.textContent = this.product.description;
		}

		const priceElement = detail.querySelector('.card__price');
		if (priceElement) {
			priceElement.textContent =
				this.product.price !== null
					? `${this.product.price} синапсов`
					: 'Бесценно';
		}

		return detail;
	}

	bindEvents(): void {
		const addButton = this.element.querySelector(
			'.button'
		) as HTMLButtonElement;
		if (addButton) {
			if (this.product.price === null || this.inCart) {
				addButton.disabled = true;
				if (this.inCart) {
					addButton.textContent = 'В корзине';
				}
			} else {
				addButton.addEventListener('click', () =>
					this.onAddToCart(this.product)
				);
			}
		}
	}

	getElement(): HTMLElement {
		return this.element;
	}
}
