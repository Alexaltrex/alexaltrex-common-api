import {customAlphabet} from "nanoid";
import {IRating} from "../interfaces/shop-interfaces";

// создание атикула товара
export const articleCreate = (): string => customAlphabet('0123456789', 12)();
export const id = (): string => customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 20)();

// генерация случайного целого цисла на диапазоне [min, max]
export const getRandomIntInclusive = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const colors = [
    '#000000',
    '#ff0000',
    '#008000',
    '#0000ff',
    '#ffff00',
    '#ff69b4',
    '#ffa500',
    '#a52a2a',
    '#808080',
    '#800000',
    '#808000',
    '#800080',
    '#00ff00',
    '#000080',
    '#008b8b',
    '#4b0082'
];

// генерация набора цветов
export const generateColors = (): string[] => {
    const colorsIndex: number[] = [];
    const colorsCount = getRandomIntInclusive(1, 8);
    while (colorsIndex.length < colorsCount) {
        const colorIndex = getRandomIntInclusive(0, colors.length - 1);
        if (!colorsIndex.includes(colorIndex)) {
            colorsIndex.push(colorIndex);
        }
    }
    return colorsIndex.map(index => colors[index]);
};

// генерация случайного булева значения
export const generateBoolean = (): boolean => {
    return getRandomIntInclusive(0, 1) === 0 ? false : true
};

export const elementsPerPage = 4;

export const arraysIsIntersected = (arr1: any[], arr2: any[]): boolean => {
    for (let i = 0; i < arr1.length; i++) {
        if (arr2.includes(arr1[i])) {
            return true;
        }
    }
    return false
};

export const getRate = (rating: IRating): string => {
    let summa = 0;
    Object.values(rating).forEach((value, index) => {
        summa += value * Number(Object.keys(rating)[index])
    });
    const count = Object.values(rating).reduce((prev, curr) => prev + curr);
    const rate = (summa / count).toFixed(2);
    return rate
}