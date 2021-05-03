import { seededRandom } from "../util";

export const PX_SCALE = 8;
export const PX_SCREEN_WIDTH = 60 * 3;
export const PX_SCREEN_HEIGHT = 60 * 2;
export const PX_FRAME_WIDTH = 220;
export const PX_FRAME_HEIGHT = 220;
export const SCREEN_WIDTH = fromPx(PX_SCREEN_WIDTH);
export const SCREEN_HEIGHT = fromPx(PX_SCREEN_HEIGHT);

export enum Dir {
    LEFT = 0,
    UP,
    RIGHT,
    DOWN,
}

export enum Power {
    DOUBLE_JUMP = 0,
    DASH, // Unsupported at the mo
    SHOOT,
    BIG_JUMP,
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
