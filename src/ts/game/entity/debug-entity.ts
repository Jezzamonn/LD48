import { fromPx } from "../constants";
import { Level } from "../level";
import { Entity } from "./entity";

export class DebugEntity extends Entity {
    constructor(level: Level) {
        super(level);

        this.w = fromPx(10);
        this.h = fromPx(10);
    }
}