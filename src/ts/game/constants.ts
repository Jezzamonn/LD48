import { seededRandom } from "../util";

export const PX_SCALE = 8;
export const PX_SCREEN_WIDTH = 320;
export const PX_SCREEN_HEIGHT = 240;
export const SCREEN_WIDTH = fromPx(PX_SCREEN_WIDTH);
export const SCREEN_HEIGHT = fromPx(PX_SCREEN_HEIGHT);

export enum Dir {
    LEFT = 0,
    UP,
    RIGHT,
    DOWN,
}

export function toPx(val: number): number {
    return val / PX_SCALE;
}

export function toRoundedPx(val: number): number {
    return Math.round(val / PX_SCALE);
}

export function fromPx(val: number): number {
    return val * PX_SCALE;
}

export interface Point {
    x: number;
    y: number;
}

export const rng = seededRandom("wahoo!");
