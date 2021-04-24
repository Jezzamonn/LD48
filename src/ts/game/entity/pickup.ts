import { fromPx } from "../constants";
import { Level } from "../level";
import { Entity } from "./entity";

export class Pickup extends Entity {
    constructor(level: Level) {
        super(level);

        this.name = 'Pickup';
        this.w = fromPx(4);
        this.h = fromPx(6);
        this.debugColor = '#387eff';

        this.dxDampen = 0.93;
    }
}