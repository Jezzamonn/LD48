import { fromPx, Power, toRoundedPx } from "../constants";
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

        this.dxDampen = 1000;
    }

    get power(): Power | undefined {
        switch (this.subGameIndex) {
            case 3:
                return Power.DOUBLE_JUMP;
            case 6:
                return Power.SHOOT;
        }
        return undefined;
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