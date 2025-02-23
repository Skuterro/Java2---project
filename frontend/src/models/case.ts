import { Item } from "./item";

export interface Case{
    id: number;
    name: string;
    price: number;
    itemsList: Item[];
    imageData?: string | null;
}