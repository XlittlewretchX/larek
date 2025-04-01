import { BaseForm } from "./BaseForm";
import { getTemplate } from '../utils/utils';

export class ContactsForm extends BaseForm {
    private email = '';
    private phone = '';

    constructor(onSubmit: (data: { email: string; phone: string }) => void) {
        super(onSubmit);
    }

    protected render(): HTMLElement {
        const template = getTemplate('contacts');
        const fragment = template.content.cloneNode(true) as DocumentFragment;
        const form = fragment.querySelector('form') as HTMLFormElement;
        if (!form) {
            console.error('Форма в шаблоне #contacts не найдена');
            throw new Error('Form not found in template #contacts');
        }
        return form;
    }

    protected bindEvents(): void {
        const form = this.element as HTMLFormElement;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validate()) {
                this.onSubmit({ email: this.email, phone: this.phone });
            }
        });

        const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
        if (emailInput) {
            emailInput.addEventListener('input', () => {
                this.email = emailInput.value;
                this.updateSubmitButton();
            });
        } else {
            console.error('Поле email не найдено');
        }

        const phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement;
        if (phoneInput) {
            phoneInput.addEventListener('input', () => {
                this.phone = phoneInput.value;
                this.updateSubmitButton();
            });
        } else {
            console.error('Поле phone не найдено');
        }
    }

    protected validate(): boolean {
        return !!(this.email && this.phone);
    }

    protected updateSubmitButton(): void {
        const submitButton = this.element.querySelector('.button') as HTMLButtonElement;
        const errorElement = this.element.querySelector('.form__errors');
        let errorMessage = '';

        if (!this.email) {
            errorMessage += 'Пожалуйста, введите email. ';
        }
        if (!this.phone) {
            errorMessage += 'Пожалуйста, введите телефон. ';
        }

        if (errorElement) {
            errorElement.textContent = errorMessage;
        }

        if (submitButton) {
            submitButton.disabled = !(this.email && this.phone);
        } else {
            console.error('Кнопка .button не найдена');
        }
    }
}
