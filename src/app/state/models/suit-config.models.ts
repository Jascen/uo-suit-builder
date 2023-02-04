export interface StatConfiguration {
    id: string;
    name: string;
    shortName: string;
    minimum: number;
    target: number;
    maximum: number; // Exceeding this is very bad.
    scalingFactor: number;
}