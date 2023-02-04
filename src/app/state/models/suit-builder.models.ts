import { StatConfiguration } from "./suit-config.models";


export interface SuitScoringOptions {
    mustMeetAllMinimums: boolean;
    requiredProperties?: StatConfiguration[]; // Every item must have these
}
