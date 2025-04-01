export class Modal {
    private element: HTMLElement;
    private contentContainer: HTMLElement;

    constructor(selector: string) {
        const element = document.querySelector(selector);
        if (!element) {
            throw new Error(`Modal element ${selector} not found`);
        }
        this.element = element as HTMLElement;
        const contentContainer = this.element.querySelector('.modal__content');
        if (!contentContainer) {
            throw new Error('Modal content container not found');
        }
        this.contentContainer = contentContainer as HTMLElement;

        const closeButton = this.element.querySelector('.modal__close');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.close());
        }
        this.element.addEventListener('click', (e) => {
            if (e.target === this.element) this.close();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
        });
    }

    open(): void {
        document.body.classList.add('modal-open');
        this.element.classList.add('modal_active');
    }

    close(): void {
        document.body.classList.remove('modal-open');
        this.element.classList.remove('modal_active');
    }

    setContent(content: HTMLElement): void {
        this.contentContainer.innerHTML = '';
        this.contentContainer.appendChild(content);
    }
}
