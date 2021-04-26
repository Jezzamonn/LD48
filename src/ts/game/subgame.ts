import { Camera } from "./camera/camera";
import { CANVAS_SCALE, fromPx, Power, PX_SCREEN_HEIGHT, PX_SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_WIDTH } from "./constants";
import { Game } from "./game";
import { Level } from "./level";
import * as Aseprite from "../aseprite";
import * as Images from "../images";
import { Keys } from "../keys";

Aseprite.loadImage({name: 'title', basePath: 'sprites/'});
Aseprite.loadImage({name: 'power_label', basePath: 'sprites/'});

export class SubGame {

    element!: HTMLElement;
    frameElem!: HTMLElement;
    subGameContainer!: HTMLElement;
    canvas!: HTMLCanvasElement;
    context!: CanvasRenderingContext2D;

    index: number;
    game: Game;
    level!: Level;
    camera: Camera = new Camera();
    showingTitle = true;

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
        this.element.classList.add('subgame', 'faded');

        this.canvas = document.createElement('canvas');
        this.canvas.width = PX_SCREEN_WIDTH;
        this.canvas.height = PX_SCREEN_HEIGHT;
        this.canvas.style.width = (CANVAS_SCALE * PX_SCREEN_WIDTH) + 'px';
        this.canvas.style.height = (CANVAS_SCALE * PX_SCREEN_HEIGHT) + 'px';
        this.canvas.style.left = (CANVAS_SCALE * 20) + 'px';
        this.canvas.style.top = (CANVAS_SCALE * 20) + 'px';
        this.canvas.classList.add('canvas');

        this.element.append(this.canvas);

        this.context = this.canvas.getContext('2d')!;
        Aseprite.disableSmoothing(this.context);

        this.frameElem = Images.images['frame'].image?.cloneNode() as HTMLImageElement;
        if (this.frameElem == null) {
            throw Error('Oh no the frame is null!');
        }
        this.frameElem.classList.add('frame');
        this.frameElem.style.width = (Images.images['frame'].image!.width * CANVAS_SCALE) + 'px';
        this.frameElem.style.height = (Images.images['frame'].image!.height * CANVAS_SCALE) + 'px';

        this.element.append(this.frameElem);

        this.subGameContainer = document.createElement('div');
        this.subGameContainer.classList.add('subgame-container');
        // this.subGameContainer.style.left = Math.round(CANVAS_SCALE * 20 + CANVAS_SCALE * PX_SCREEN_WIDTH / 2) + 'px';
        // this.subGameContainer.style.top = Math.round(CANVAS_SCALE * 20 + CANVAS_SCALE * PX_SCREEN_HEIGHT / 2) + 'px';

        this.element.append(this.subGameContainer);

        this.element.style.width = (Images.images['frame'].image!.width * CANVAS_SCALE) + 'px';
        this.element.style.height = (Images.images['frame'].image!.height * CANVAS_SCALE) + 'px';
    }

    update(dt: number) {
        if (this.showingTitle) {
            if (Keys.wasPressedThisFrame('KeyX') || Keys.wasPressedThisFrame('Space')) {
                this.showingTitle = false;
            }
            return;
        }

        this.level.update(dt);

        this.camera.update(dt);
    }

    render() {
        this.context.resetTransform();
        this.context.filter = this.hueRotateFilter;

        if (this.showingTitle) {
            this.renderTitle(this.context);
            return;
        }

        this.camera.applyToContext(this.context);

        this.level.render(this.context);

        this.context.resetTransform();
        this.renderPower(this.context);
    }

    get hueRotateFilter() {
        return `hue-rotate(${60 * this.index}deg)`;
    }

    renderPower(context: CanvasRenderingContext2D) {
        const powerNameMap: {[key: string]: string} = {};
        powerNameMap[Power.DOUBLE_JUMP] = 'double jump';
        powerNameMap[Power.SHOOT] = 'shoot';
        powerNameMap[Power.BIG_JUMP] = 'big jump';

        for (const power of this.game.currentPowers) {
            Aseprite.drawAnimation({
                context,
                image: 'power_label',
                animationName: powerNameMap[power],
                time: 0,
                position: {x: PX_SCREEN_WIDTH, y: 0},
                anchorRatios: {x: 1, y: 0},
            });
        }
    }

    renderTitle(context: CanvasRenderingContext2D) {
        let titleName = `game${this.index+1}`;
        const imageData = Aseprite.images['title'];
        if (!imageData.animations?.hasOwnProperty(titleName)) {
            titleName = 'game?';
        }

        Aseprite.drawAnimation({
            context,
            image: 'title',
            animationName: titleName,
            time: 0,
            position: {x: 0, y: 0}
        });
    }
}