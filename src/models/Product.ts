import { IProduct } from '../types';

export class Product implements IProduct {
    constructor(
        public id: string,
        public description: string,
        public image: string,
        public title: string,
        public category: string,
        public price: number | null
    ) {}
}