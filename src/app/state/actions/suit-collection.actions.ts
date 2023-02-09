import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Suit } from '../models/suit-collection.models';

export const Actions = createActionGroup({
    source: 'Suit Collection',
    events: {
        'Initialize': emptyProps(),
        'Add Suits': props<{ suits: Suit[] }>(),
    }
});

export const UserActions = createActionGroup({
    source: 'Suit Collection - User',
    events: {
        'Select Suit': props<{ suitId: string }>(),
        'Update Grid Filter': props<{ gridFilter: {} }>(),
        'Reset Grid Filter': emptyProps(),
        'Set Baseline Items': props<{ items: number[] }>(),
        'Create Suit Variations': props<{ items: number[] }>(),
    }
});