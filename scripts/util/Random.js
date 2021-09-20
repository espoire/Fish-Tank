export function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function random(min, max) {
    return Math.random() * (max - min) + min;
}

export function randomArrayIndex(array) {
    return randInt(0, array.length - 1);
}

export function randomElementFromArray(array) {
    return array[randomArrayIndex(array)];
}