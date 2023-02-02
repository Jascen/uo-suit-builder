import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { StatConfiguration } from '../models/suit-config.models';

export const Actions = createActionGroup({
    source: 'Suit Config',
    events: {
        'Initialize': emptyProps(),
        'Initialize Success': props<{ configurationOptions: StatConfiguration[] }>(),
    }
});
