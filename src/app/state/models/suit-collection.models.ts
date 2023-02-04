import { Item } from "./item-collection.models";


export interface Suit {
    id?: string;
    score: number;
    items: Item[];
    summary: Record<string, number>
}