import { getTemplate } from '../utils/utils';

export class OrderSuccess {
    private element: HTMLElement;

    constructor(private total: number, private onClose: () => void) {
        this.element = this.render();
        this.bindEvents();
    }

    render(): HTMLElement {
        const template = getTemplate('success');
        const fragment = template.content.cloneNode(true) as DocumentFragment;
        const successElement = fragment.firstElementChild as HTMLElement;
        const description = successElement.querySelector('.order-success__description');
        if (description) {
            description.textContent = `Списано ${this.total} синапсов`;
        }
        return successElement;
    }

    bindEvents(): void {
        const closeButton = this.element.querySelector('.order-success__close') as HTMLButtonElement;
        if (closeButton) {
            closeButton.addEventListener('click', this.onClose);
        }
    }

    getElement(): HTMLElement {
        return this.element;
    }
}
