export abstract class BaseForm {
	protected element: HTMLElement;

	constructor(protected onSubmit: (data: any) => void) {
		this.element = this.render();
		this.bindEvents();
	}

	protected abstract render(): HTMLElement;
	protected abstract bindEvents(): void;
	protected abstract validate(): boolean;
	protected abstract updateSubmitButton(): void;

	getElement(): HTMLElement {
		return this.element;
	}
}
