import { IOrder, IProduct, ICustomerData } from '../types';

export class Order implements IOrder {
    constructor(
        public products: IProduct[],
        public customerData: ICustomerData,
        public total: number
    ) {}
}