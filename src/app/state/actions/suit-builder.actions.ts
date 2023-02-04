import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Suit } from 'src/app/state/models/suit-collection.models';

export const UserActions = createActionGroup({
    source: 'Suit Builder - User',
    events: {
        'Build': emptyProps(),
        'Build Success': props<{ suits: Suit[] }>(),
    }
});