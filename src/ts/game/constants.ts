import { seededRandom } from "../util";

export const PX_SCALE = 8;
export const PX_SCREEN_WIDTH = 320;
export const PX_SCREEN_HEIGHT = 288;
export const SCREEN_WIDTH = fromPx(320);
export const SCREEN_HEIGHT = fromPx(288);

export function toPx(val: number): number {
    return val / PX_SCALE;
}

export function fromPx(val: number): number {
    return val * PX_SCALE;
}

export interface Point {
    x: number;
    y: number;
}

export const rng = seededRandom("wahoo!");