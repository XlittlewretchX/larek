/**
 * Товар, приходящий от API (например, в ответ на GET /product/)
 */
export interface IApiProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

/**
 * Список товаров, возвращаемый с бэкенда
 */
export interface IApiProductList {
    total: number;        // Общее количество товаров
    items: IApiProduct[]; // Массив товаров
}

/**
 * Товар, используемый внутри приложения (UI).
 */
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

/**
 * Данные покупателя, приходящие от API или отправляемые на бэкенд
 */
export interface IApiCustomerData {
    payment: string;
    email: string;
    phone: string;
    address: string;
}

/**
 * Данные покупателя внутри приложения (UI).
 */
export interface ICustomerData {
    payment: string;
    email: string;
    phone: string;
    address: string;
}

/**
 * Тело запроса для создания заказа (POST /order)
 */
export interface IApiOrderRequest {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;       // общая сумма заказа
    items: string[];     // список ID товаров
}

/**
 * Ответ от сервера при успешном создании заказа
 */
export interface IApiOrderResponse {
    id: string;    // идентификатор созданного заказа
    total: number; // подтверждённая сумма заказа
}

/**
 * Структура ошибки при неудачном оформлении заказа (400 Bad Request)
 */
export interface IApiOrderError {
    error: string;
}

/**
 * Заказ, используемый внутри приложения (UI).
 */
export interface IOrder {
    products: IProduct[];     // товары, добавленные в корзину
    customerData: ICustomerData; // данные покупателя
    total: number;            // итоговая сумма заказа
}