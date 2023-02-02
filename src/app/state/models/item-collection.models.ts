export enum ItemSlot {
    // Main body parts
    Head = 'head',
    Neck = 'neck',
    Chest = 'chest',
    Arms = 'arms',
    Hands = 'hands',
    Legs = 'legs',

    // Accessories
    Ring = 'ring',
    Bracelet = 'bracelet',
    Sash = 'sash',
    Feet = 'feet',
    Apron = 'apron',
}

export interface RawItem {
    name: string;
    slot: ItemSlot;
}

export interface Item {
    id: number; // Computed during import process
    name: string; // User defined
    slot: ItemSlot;
    properties: Record<string, number>; // { id: int value }
}