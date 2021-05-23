import { Camera } from "./camera/camera";
import { fromPx, Power, PX_SCREEN_HEIGHT, PX_SCREEN_WIDTH, SCREEN_HEIGHT } from "./constants";
import { Game, subGameScale } from "./game";
import { Level } from "./level";
import * as Aseprite from "../aseprite";
import * as Images from "../images";
import { ImageInfo } from "../images";
import { Keys } from "../keys";

Aseprite.loadImage({name: 'title', basePath: 'sprites/'});
Aseprite.loadImage({name: 'power_label', basePath: 'sprites/'});

export class SubGame {

    frameElem!: HTMLElement;
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

        this.camera.getTargetPosition = () => this.level.player.cameraPos;
    }

    makeElements() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = PX_SCREEN_WIDTH;
        this.canvas.height = PX_SCREEN_HEIGHT;
        this.canvas.classList.add('canvas', 'faded');
        this.canvas.style.transform = `scale(${subGameScale})`;

        this.context = this.canvas.getContext('2d')!;
        Aseprite.disableSmoothing(this.context);

        const frameImage = Images.getFilteredImage('frame', this.hueRotateFilter);

        if (frameImage.image == null) {
            throw Error('Oh no the frame is null!');
        }

        this.frameElem = frameImage.image?.cloneNode() as HTMLImageElement;
        if (this.frameElem == null) {
            throw Error('Oh no the frame is null!');
        }
        this.frameElem.classList.add('frame', 'faded');
        this.frameElem.style.transform = `scale(${subGameScale})`;
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
        const powerAnimations: {[key: string]: string} = {};
        powerAnimations[Power.DOUBLE_JUMP] = 'double jump';
        powerAnimations[Power.SHOOT] = 'shoot';
        powerAnimations[Power.BIG_JUMP] = 'big jump';

        for (const power of this.game.currentPowers) {
            const powerAnimation = powerAnimations[power];
            if (powerAnimation == null) {
                continue;
            }
            Aseprite.drawAnimation({
                context,
                image: 'power_label',
                animationName: powerAnimation,
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
            position: {x: 0, y: 0},
            filter: this.hueRotateFilter,
        });
    }
}