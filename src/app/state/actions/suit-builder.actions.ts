import { createActionGroup, emptyProps, props } from '@ngrx/store';


export const UserActions = createActionGroup({
    source: 'Suit Builder - User',
    events: {
        'Build': emptyProps(),
        'Build Success': props<{ data: any }>(),
    }
});