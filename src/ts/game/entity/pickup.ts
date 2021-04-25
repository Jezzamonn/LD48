import { fromPx, toRoundedPx } from "../constants";
import { Level } from "../level";
import { Entity } from "./entity";
import * as Aseprite from "../../aseprite";

Aseprite.loadImage({name: 'gameboy', basePath: 'sprites/'});

export class Pickup extends Entity {

    subGameIndex?: number;

    constructor(level: Level) {
        super(level);

        this.name = 'Pickup';
        this.w = fromPx(5);
        this.h = fromPx(7);
        this.debugColor = '#387eff';

        this.dxDampen = 0.93;
    }

    render(context: CanvasRenderingContext2D) {
        // super.render(context);

        Aseprite.drawSprite({
            context,
            image: 'gameboy',
            frame: 0,
            position: {
                x: toRoundedPx(this.x),
                y: toRoundedPx(this.y)
            },
        });
    }
}