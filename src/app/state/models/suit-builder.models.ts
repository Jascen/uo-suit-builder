import { Item } from "./item-collection.models";
import { StatConfiguration } from "./suit-config.models";


export interface Suit {
    score: number;
    items: Item[];
    summary: Record<string, number>
}

export interface SuitScoringOptions {
    mustMeetAllMinimums: boolean;
    requiredProperties?: StatConfiguration[]; // Every item must have these
}
