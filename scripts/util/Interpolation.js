function capToRange(number, min = 0, max = 1) {
    if (!number || isNaN(number)) return min;
    if (number <= min) return min;
    if (number >= max) return max;

    return number;
}

function normalizeToRange(number, min = 0, max = 1) {
    return (capToRange(number, min, max) - min) / (max - min)
}

export function linearInterpolate(ratio, minOutput = 0, maxOutput = 1, minInput = 0, maxInput = 1) {
    ratio = normalizeToRange(ratio, minInput, maxInput);
    return ratio * (maxOutput - minOutput) + minOutput;
}