export function roundNumber(value?: number, prefix: string = "",  suffix: string = "") {
    if (!value) return 0;

    return `${prefix}${value.toFixed(2)}${suffix}`;
}