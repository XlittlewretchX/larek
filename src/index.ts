import './scss/styles.scss';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { ProductController } from './controllers/ProductController';
import { CartController } from './controllers/CartController';
import { OrderController } from './controllers/OrderController';
import { Cart } from './models/Cart';
import { Modal } from './views/Modal';
import { API_URL } from './utils/constants';

const events = new EventEmitter();
const cart = new Cart(events);
const modal = new Modal('#modal-container');
const api = new Api(API_URL);

const orderController = new OrderController(cart, modal, api);
const cartController = new CartController(modal, orderController, events, cart);
const productController = new ProductController('.gallery', modal, cartController, api);

productController.loadProducts();

const basketButton = document.querySelector('.header__basket') as HTMLElement;
basketButton.addEventListener('click', () => cartController.openCart());

events.on('cart:updated', (data: { items: any[] }) => {
    const counter = document.querySelector('.header__basket-counter') as HTMLElement;
    if (counter) {
        counter.textContent = data.items.length.toString();
    }
});
