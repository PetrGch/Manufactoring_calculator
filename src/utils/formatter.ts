export function roundNumber(value?: number) {
    if (!value) return 0;

    return value.toFixed(2);
}