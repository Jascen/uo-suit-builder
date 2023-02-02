export function copyObjectKeys<TValue, TKey extends keyof any = any>(object: Record<TKey, any>) {
    return Object.keys(object).reduce((acc, key) => {
        (acc as any)[key] = undefined;
        return acc;
    }, {} as Record<TKey, TValue>);
}