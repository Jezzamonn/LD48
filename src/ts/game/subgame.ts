import { Camera } from "./camera/camera";
import { CANVAS_SCALE, fromPx, PX_SCREEN_HEIGHT, PX_SCREEN_WIDTH, SCREEN_HEIGHT } from "./constants";
import { Game } from "./game";
import { Level } from "./level";
import * as Aseprite from "../aseprite";
import * as Images from "../images";

export class SubGame {

    element!: HTMLElement;
    canvas!: HTMLCanvasElement;
    context!: CanvasRenderingContext2D;

    index: number;
    game: Game;
    level!: Level;
    camera: Camera = new Camera();

    constructor(game: Game, index: number) {
        this.game = game;
        this.index = index;

        this.makeElements();

        this.camera.getTargetPosition = () => ({
            x: this.level.player.midX + this.level.player.facingDirMult * fromPx(20),
            y: this.level.player.midY - Math.round(0.15 * SCREEN_HEIGHT),
        });
    }

    makeElements() {
        this.element = document.createElement('div');
        this.element.classList.add('subgame');

        this.canvas = document.createElement('canvas');
        this.canvas.width = PX_SCREEN_WIDTH;
        this.canvas.height = PX_SCREEN_HEIGHT;
        this.canvas.style.width = (CANVAS_SCALE * PX_SCREEN_WIDTH) + 'px';
        this.canvas.style.height = (CANVAS_SCALE * PX_SCREEN_HEIGHT) + 'px';
        this.canvas.style.top = (CANVAS_SCALE * 20) + 'px';
        this.canvas.style.left = (CANVAS_SCALE * 20) + 'px';
        this.canvas.classList.add('canvas');

        this.element.append(this.canvas);

        this.context = this.canvas.getContext('2d')!;
        Aseprite.disableSmoothing(this.context);

        let frameElem = Images.images['frame'].image?.cloneNode() as HTMLImageElement;
        if (frameElem == null) {
            throw Error('Oh no the frame is null!');
        }
        frameElem.classList.add('frame');
        frameElem.style.width = (Images.images['frame'].image!.width * CANVAS_SCALE) + 'px';
        frameElem.style.height = (Images.images['frame'].image!.height * CANVAS_SCALE) + 'px';

        this.element.append(frameElem);

        this.element.style.width = (Images.images['frame'].image!.width * CANVAS_SCALE) + 'px';
        this.element.style.height = (Images.images['frame'].image!.height * CANVAS_SCALE) + 'px';
    }

    update(dt: number) {
        this.level.update(dt);

        this.camera.update(dt);
    }

    render() {
        this.context.resetTransform();

        this.camera.applyToContext(this.context);

        this.level.render(this.context);
    }
}