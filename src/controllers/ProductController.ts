import { Api } from '../components/base/api';
import { IProduct, IApiProduct } from '../types';
import { Product } from '../models/Product';
import { ProductCard } from '../views/ProductCart';
import { Modal } from '../views/Modal';
import { ProductDetail } from '../views/ProductDetail';
import { CartController } from './CartController';

export class ProductController {
	private products: Product[] = [];
	private gallery: HTMLElement;

	constructor(
		gallerySelector: string,
		private modal: Modal,
		private cartController: CartController,
		private api: Api
	) {
		const gallery = document.querySelector(gallerySelector);
		if (!gallery) {
			throw new Error(`Gallery element ${gallerySelector} not found`);
		}
		this.gallery = gallery as HTMLElement;
	}

	async loadProducts(): Promise<void> {
		try {
			const response = (await this.api.get('/product')) as {
				items: IApiProduct[];
			};
			this.products = response.items.map(
				(item) =>
					new Product(
						item.id,
						item.description,
						item.image,
						item.title,
						item.category,
						item.price
					)
			);
			this.renderGallery();
		} catch (error) {
			console.error('Ошибка при загрузке товаров:', error);
		}
	}

	renderGallery(): void {
		this.gallery.innerHTML = '';
		this.products.forEach((product) => {
			const card = new ProductCard(product, () =>
				this.openProductDetail(product)
			);
			this.gallery.appendChild(card.getElement());
		});
	}

	openProductDetail(product: Product): void {
		const inCart = this.cartController.isInCart(product.id);
		const detail = new ProductDetail(
			product,
			(p) => this.cartController.addToCart(p),
			inCart
		);
		this.modal.setContent(detail.getElement());
		this.modal.open();
	}
}
