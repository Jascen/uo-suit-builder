import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map } from "rxjs";
import { Item } from "../models/item-collection.models";
import * as fromActions from '../actions/item-collection.actions'


@Injectable()
export class ItemCollectionEffects {

    importData$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(fromActions.UserActions.import),
            map(action => {
                return fromActions.UserActions.importSuccess({
                    items: action.items.map((item, index) => {
                        const result = {
                            id: index,
                            name: item.name,
                            slot: item.slot,
                            properties: {}
                        } as Item;

                        Object.keys(item).forEach(key => {
                            if (item[key] === null || (item[key] as any) === '') { return; }
                            if (key === 'name' || key === 'slot') { return; }

                            result.properties[key] = item[key];
                        });

                        return result;
                    })
                });
            })
        );
    });

    constructor(
        private actions$: Actions,
        private store: Store
    ) {
    }
}