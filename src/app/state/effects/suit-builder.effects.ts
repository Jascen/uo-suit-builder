import { Injectable } from "@angular/core";
import { createEffect, ofType, Actions } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { tap } from "rxjs";
import { Router } from "@angular/router";
import * as suitBuilderActions from '../actions/suit-builder.actions';


@Injectable()
export class SuitBuilderEffects {

    viewSuitsAfterBuild$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(suitBuilderActions.UserActions.buildSuccess),
            tap(action => this.router.navigateByUrl('suits'))
        )
    }, { dispatch: false });

    constructor(
        private actions$: Actions,
        private store: Store,
        private router: Router
    ) {
    }
}