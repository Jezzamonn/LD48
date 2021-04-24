export const PX_SCALE = 8;
export const PX_SCREEN_WIDTH = 320;
export const PX_SCREEN_HEIGHT = 288;
export const SCREEN_WIDTH = PX_SCALE * 320;
export const SCREEN_HEIGHT = PX_SCALE * 288;

export function toPx(val: number): number {
    return val / PX_SCALE;
}

export interface Point {
    x: number;
    y: number;
}