import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Suit } from '../models/suit-builder.models';


export const UserActions = createActionGroup({
    source: 'Suit Builder - User',
    events: {
        'Build': emptyProps(),
        'Build Success': props<{ suits: Suit[] }>(),
    }
});