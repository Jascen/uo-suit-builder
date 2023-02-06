import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Item } from '../models/item-collection.models';
import { StatConfigurationUpdate } from '../models/suit-config.models';


export const UserActions = createActionGroup({
    source: 'Item Collection - User',
    events: {
        'Import': props<{ items: (Item & { [id: string]: number })[] }>(),
        'Import Success': props<{ items: Item[] }>(),
        'Select Items': props<{ itemIds: number[] }>(),
        'Build': emptyProps(),
        'Build Approved': props<{ properties: StatConfigurationUpdate[] }>(),
    }
});
