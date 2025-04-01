import { BaseForm } from "./BaseForm";
import { getTemplate } from '../utils/utils';

export class OrderForm extends BaseForm {
    private payment = '';
    private address = '';

    constructor(onSubmit: (data: { payment: string; address: string }) => void) {
        super(onSubmit);
    }

    protected render(): HTMLElement {
        const template = getTemplate('order');
        const fragment = template.content.cloneNode(true) as DocumentFragment;
        const form = fragment.querySelector('form') as HTMLFormElement;
        if (!form) {
            console.error('Форма в шаблоне #order не найдена');
            throw new Error('Form not found in template #order');
        }
        return form;
    }

    protected bindEvents(): void {
        const form = this.element as HTMLFormElement;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validate()) {
                this.onSubmit({ payment: this.payment, address: this.address });
            }
        });

        const paymentButtons = form.querySelectorAll('.order__buttons button');
        if (paymentButtons.length === 0) {
            console.error('Кнопки оплаты не найдены');
        }
        paymentButtons.forEach((button) => {
            button.addEventListener('click', () => {
                this.payment = button.getAttribute('name')!;
                paymentButtons.forEach((btn) => btn.classList.remove('button_alt-active'));
                button.classList.add('button_alt-active');
                this.updateSubmitButton();
            });
        });

        const addressInput = form.querySelector('input[name="address"]') as HTMLInputElement;
        if (addressInput) {
            addressInput.addEventListener('input', () => {
                this.address = addressInput.value;
                this.updateSubmitButton();
            });
        } else {
            console.error('Поле address не найдено');
        }
    }

    protected validate(): boolean {
        return !!(this.payment && this.address);
    }

    protected updateSubmitButton(): void {
        const submitButton = this.element.querySelector('.order__button') as HTMLButtonElement;
        const errorElement = this.element.querySelector('.form__errors');
        let errorMessage = '';

        if (!this.payment) {
            errorMessage += 'Пожалуйста, выберите способ оплаты. ';
        }
        if (!this.address) {
            errorMessage += 'Пожалуйста, введите адрес. ';
        }

        if (errorElement) {
            errorElement.textContent = errorMessage;
        }

        if (submitButton) {
            submitButton.disabled = !(this.payment && this.address);
        } else {
            console.error('Кнопка .order__button не найдена');
        }
    }
}
