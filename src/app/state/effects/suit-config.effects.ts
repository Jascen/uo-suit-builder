import { Injectable } from "@angular/core";
import { createEffect, ofType, concatLatestFrom, Actions } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { filter, map, tap } from "rxjs";
import { StatConfiguration } from "../models/suit-config.models";
import * as suitConfigActions from '../actions/suit-config.actions';
import * as fromSuitConfig from '../selectors/suit-config.selectors';
import * as FileSaver from "file-saver";
import { Router } from "@angular/router";


@Injectable()
export class SuitConfigEffects {

  initializeSuitConfig$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(suitConfigActions.Actions.initialize),
      concatLatestFrom(() => this.store.select(fromSuitConfig.selectLoaded)),
      filter(([action, loaded]) => !loaded),

      map(() => {
        // TODO: Make configurable
        const properties = [
          // Resistances
          {
            id: "phys_res",
            name: "Physical Resist",
            shortName: "Phys",
            minimum: 60,
            target: 70,
            maximum: 75,
            scalingFactor: 1
          },
          {
            id: "fire_res",
            name: "Fire Resist",
            shortName: "Fire",
            minimum: 60,
            target: 70,
            maximum: 75,
            scalingFactor: 1.5
          },
          {
            id: "cold_res",
            name: "Cold Resist",
            shortName: "Cold",
            minimum: 60,
            target: 70,
            maximum: 75,
            scalingFactor: 1
          },
          {
            id: "poison_res",
            name: "Poison Resist",
            shortName: "Psn",
            minimum: 50,
            target: 60,
            maximum: 75,
            scalingFactor: 1
          },
          {
            id: "energy_res",
            name: "Energy Resist",
            shortName: "Energy",
            minimum: 60,
            target: 70,
            maximum: 75,
            scalingFactor: 1.5
          },
          {
            id: "lmc",
            name: "Lower Mana Cost",
            shortName: "LMC",
            minimum: 20,
            target: 40,
            maximum: 40,
            scalingFactor: 2
          },
          {
            id: "hp_inc",
            name: "Hit Points Increase",
            shortName: "HPI",
            minimum: 0,
            target: 40,
            maximum: 40,
            scalingFactor: 1.2
          },
          {
            id: "str",
            name: "Strength",
            shortName: "Str",
            minimum: 0,
            target: 0,
            maximum: 0,
            scalingFactor: 1
          },
          {
            id: "mana_inc",
            name: "Mana Increase",
            shortName: "Mana",
            minimum: 0,
            target: 0,
            maximum: 0,
            scalingFactor: 1
          },
          {
            id: "int",
            name: "Intelligence",
            shortName: "Int",
            minimum: 0,
            target: 0,
            maximum: 0,
            scalingFactor: 1
          },
          {
            id: "dci",
            name: "Defense Chance Increase",
            shortName: "DCI",
            minimum: 0,
            target: 0,
            maximum: 45,
            scalingFactor: 1
          },
          {
            id: "lrc",
            name: "Lower Reagent Cost",
            shortName: "LRC",
            minimum: 0,
            target: 0,
            maximum: 0,
            scalingFactor: 1.0
          },
          {
            id: "mana_regen",
            name: "Mana Regen",
            shortName: "MR",
            minimum: 0,
            target: 10,
            maximum: 20,
            scalingFactor: 1.5
          },
          {
            id: "stam_inc",
            name: "Stamina Increase",
            shortName: "Stam",
            minimum: 0,
            target: 0,
            maximum: 0,
            scalingFactor: 1
          },
          {
            id: "dex",
            name: "Dexterity",
            shortName: "Dex",
            minimum: 0,
            target: 0,
            maximum: 0,
            scalingFactor: 1
          },
          {
            id: "dmg_inc",
            name: "Damage Increase",
            shortName: "DI",
            minimum: 0,
            target: 0,
            maximum: 0,
            scalingFactor: 1
          },
          {
            id: "hci",
            name: "Hit Chance Increase",
            shortName: "HCI",
            minimum: 0,
            target: 0,
            maximum: 0,
            scalingFactor: 1
          }
        ] as StatConfiguration[];

        return suitConfigActions.Actions.initializeSuccess({ properties });
      })
    )
  });

  exportProperties$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(suitConfigActions.UserActions.exportSettings),
      concatLatestFrom(() => this.store.select(fromSuitConfig.selectAllProperties)),

      map(([action, properties]) => {
        const file = new File([JSON.stringify(properties, null, '\t')], "uo-suit-builder--properties.json", { type: "application/json;charset=utf-8" });
        FileSaver.saveAs(file);

        return suitConfigActions.Actions.initializeSuccess({ properties });
      })
    )
  });

  navigateToSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(suitConfigActions.Actions.navigateToSettings),
      tap(action => this.router.navigateByUrl('/settings'))
    )
  }, { dispatch: false });

  constructor(
    private actions$: Actions,
    private store: Store,
    private router: Router
  ) {
  }
}