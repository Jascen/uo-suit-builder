export interface StatConfiguration {
    id: string;
    commonProperty: boolean;
    name: string;
    shortName: string;
    minimum: number;
    target: number;
    maximum: number; // Exceeding this is very bad.
    scalingFactor: number;
}

export interface StatConfigurationUpdate {
    id: string;
    minimum: number;
    target: number;
    maximum: number;
    scalingFactor: number;
}