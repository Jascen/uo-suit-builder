import { Injectable } from "@angular/core";
import { createEffect, ofType, concatLatestFrom, Actions } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { filter, map } from "rxjs";
import { StatConfiguration } from "../models/suit-config.models";
import * as suitConfigActions from '../actions/suit-config.actions';
import * as fromSuitConfig from '../selectors/suit-config.selectors';


@Injectable()
export class SuitConfigEffects {

    initializeSuitConfig$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(suitConfigActions.Actions.initialize),
            concatLatestFrom(() => this.store.select(fromSuitConfig.selectLoaded)),
            filter(([action, loaded]) => !loaded),

            map(() => {
                // TODO: Make configurable
                const configurationOptions = [
                    // Resistances
                    {
                        id: "phys_res",
                        name: "Physical Resist",
                        minimum: 60,
                        target: 70,
                        maximum: 70,
                        scalingFactor: 1.0
                    },
                    {
                        id: "fire_res",
                        name: "Fire Resist",
                        minimum: 85,
                        target: 95,
                        maximum: 110,
                        scalingFactor: 1.0
                    },
                    {
                        id: "cold_res",
                        name: "Cold Resist",
                        minimum: 60,
                        target: 70,
                        maximum: 70,
                        scalingFactor: 1.0
                    },
                    {
                        id: "poison_res",
                        name: "Poison Resist",
                        minimum: 40,
                        target: 70,
                        maximum: 70,
                        scalingFactor: 1.0
                    },
                    {
                        id: "energy_res",
                        name: "Energy Resist",
                        minimum: 60,
                        target: 70,
                        maximum: 70,
                        scalingFactor: 1.0
                    },

                    // Anyone
                    {
                        id: "lmc",
                        name: "Lower Mana Cost",
                        minimum: 10,
                        target: 40,
                        maximum: 40,
                        scalingFactor: 1.5
                    },
                    {
                        id: "hp_inc",
                        name: "Hit Points Increase",
                        minimum: 0,
                        target: 20,
                        maximum: 40,
                        scalingFactor: 1.1
                    },
                    {
                        id: "mana_inc",
                        name: "Mana Increase",
                        minimum: 0,
                        target: 20,
                        maximum: 40,
                        scalingFactor: 1.1
                    },
                    {
                        id: "dci",
                        name: "Defense Chance Increase",
                        minimum: 0,
                        target: 20,
                        maximum: 45,
                        scalingFactor: 1.5
                    },

                    // str, dex, int

                    // Caster
                    {
                        id: "lrc",
                        name: "Lower Reagent Cost",
                        minimum: 0,
                        target: 0,
                        maximum: 0,
                        scalingFactor: 1.0
                    },
                    {
                        id: "mana_regen",
                        name: "Mana Regen",
                        minimum: 0,
                        target: 5,
                        maximum: 20,
                        scalingFactor: 1.0
                    },

                    // Dexxer
                    {
                        id: "stam_inc",
                        name: "Stamina Increase",
                        minimum: 0,
                        target: 20,
                        maximum: 40,
                        scalingFactor: 1.25
                    },
                    {
                        id: "dmg_inc",
                        name: "Damage Increase",
                        minimum: 0, // 30
                        target: 65,
                        maximum: 65,
                        scalingFactor: 1.2
                    },
                    {
                        id: "hci",
                        name: "Hit Chance Increase",
                        minimum: 0,
                        target: 20,
                        maximum: 45,
                        scalingFactor: 1.5
                    },
                ] as StatConfiguration[];

                return suitConfigActions.Actions.initializeSuccess({ configurationOptions });
            })
        )
    });

    constructor(
        private actions$: Actions,
        private store: Store
    ) {
    }
}