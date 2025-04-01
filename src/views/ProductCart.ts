import { IProduct } from '../types';
import { getCategoryClass } from '../utils/utils';
import { getTemplate } from '../utils/utils';

export class ProductCard {
	private element: HTMLElement;

	constructor(
		private product: IProduct,
		private onClick: (product: IProduct) => void
	) {
		this.element = this.render();
		this.element.addEventListener('click', () => this.onClick(this.product));
	}

	render(): HTMLElement {
		const template = getTemplate('card-catalog');
		const cardFragment = template.content.cloneNode(true) as DocumentFragment;
		const card = cardFragment.firstElementChild as HTMLElement;

		const categoryElement = card.querySelector('.card__category');
		if (categoryElement) {
			// Очистка возможных классов и установка нового
			categoryElement.className = 'card__category';
			categoryElement.classList.add(getCategoryClass(this.product.category));
			categoryElement.textContent = this.product.category;
		}

		const titleElement = card.querySelector('.card__title');
		if (titleElement) {
			titleElement.textContent = this.product.title;
		}

		const imageElement = card.querySelector('.card__image');
		if (imageElement) {
			imageElement.setAttribute('src', 'images' + this.product.image);
		}

		const priceElement = card.querySelector('.card__price');
		if (priceElement) {
			priceElement.textContent =
				this.product.price !== null
					? `${this.product.price} синапсов`
					: 'Бесценно';
		}

		return card;
	}

	getElement(): HTMLElement {
		return this.element;
	}
}
