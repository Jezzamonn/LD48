import * as Images from "../images";
import { lerp } from "../util";
import { Point, rng, SCREEN_HEIGHT, SCREEN_WIDTH, fromPx, toPx, toRoundedPx } from "./constants";
import { DebugEntity } from "./entity/debug-entity";
import { Entity } from "./entity/entity";
import { Pickup } from "./entity/pickup";
import { Player } from "./entity/player";
import { SubGame } from "./subgame";

Images.loadImage({name: 'tiles', path: 'sprites/'});

export const TILE_SIZE = fromPx(12);

const DEBUG_GROUND_COLOR = '#21235e';

export enum Tile {
    AIR,
    GROUND,
}

export class Level {

    subGame: SubGame;
    player: Player;
    entities: Entity[] = [];
    tiles: Tile[][] = [];

    constructor(subGame: SubGame) {
        this.subGame = subGame;

        // Some example set of tiles for the moment?
        for (let y = 0; y < 10; y++) {
            const tileRow: Tile[] = [];
            for (let x = 0; x < 16; x++) {
                tileRow[x] = rng() < 0.1 ? Tile.GROUND : Tile.AIR;
            }
            this.tiles.push(tileRow);
        }

        for (let i = 0; i < 5; i++) {
            const ent = new DebugEntity(this);
            ent.midX = Math.floor(lerp(0, TILE_SIZE * this.width, rng()));
            ent.maxY = Math.floor(lerp(0, TILE_SIZE * this.height, rng()));
            this.entities.push(ent);
        }

        for (let i = 0; i < 5; i++) {
            const ent = new Pickup(this);
            ent.midX = Math.floor(lerp(0, TILE_SIZE * this.width, rng()));
            ent.maxY = Math.floor(lerp(0, TILE_SIZE * this.height, rng()));
            this.entities.push(ent);

            ent.subGameIndex = this.subGame.index + 1;
        }

        this.player = new Player(this);
        this.player.midX = Math.floor(lerp(0, TILE_SIZE * this.width, rng()));
        this.player.maxY = Math.floor(lerp(0, TILE_SIZE * this.height, rng()));
        this.entities.push(this.player);
    }

    get width() {
        return this.tiles[0].length;
    }

    get height() {
        return this.tiles.length;
    }

    update(dt: number) {
        for (const entity of this.entities) {
            entity.update(dt);
        }
    }

    remove(entity: Entity) {
        const index = this.entities.indexOf(entity);
        if (index < 0) {
            console.error(`I cannae remove entity ${entity}`);
            return;
        }
        this.entities.splice(index, 1);
    }

    render(context: CanvasRenderingContext2D) {
        // Just fill the canvas for the mo.
        context.filter = `hue-rotate(${40 * this.subGame.index}deg)`

        context.save();
        context.resetTransform();
        context.fillStyle = '#2ce8f5';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.restore();

        // Just render ALL the tiles for the moment.
        this.renderFrame(context);
        this.renderTiles(context);

        for (const entity of this.entities) {
            entity.render(context);
        }
    }

    renderTiles(context:CanvasRenderingContext2D) {
        for (let y = -1; y <= this.height; y++) {
            for (let x = -1; x <= this.width; x++) {
                const tile = this.getTile({x, y});

                if (tile == Tile.GROUND) {
                    // context.fillStyle = DEBUG_GROUND_COLOR;
                    // context.fillRect(
                    //     toRoundedPx(x * TILE_SIZE),
                    //     toRoundedPx(y * TILE_SIZE),
                    //     toPx(TILE_SIZE),
                    //     toPx(TILE_SIZE),
                    // );
                    if (!Images.images['tiles'].loaded || Images.images['tiles'].image == null) {
                        continue;
                    }

                    context.drawImage(
                        Images.images['tiles'].image,
                        0,
                        0,
                        16,
                        16,
                        toRoundedPx(x * TILE_SIZE) - 2,
                        toRoundedPx(y * TILE_SIZE) - 2,
                        16,
                        16,
                    )

                }
            }
        }
    }

    renderFrame(context: CanvasRenderingContext2D) {
        // hehe not that big yet
        const thickness = 10;
        const extendness = 5;
        context.fillStyle = DEBUG_GROUND_COLOR;
        // Floor
        context.fillRect(
            -extendness,
            toRoundedPx(this.height * TILE_SIZE),
            toRoundedPx(this.width * TILE_SIZE) + 2 * extendness,
            thickness,
        )
        // Left Wall
        context.fillRect(
            -thickness,
            -extendness,
            thickness,
            toRoundedPx(this.height * TILE_SIZE) + 2 * extendness,
        )
        // Right Wall
        context.fillRect(
            toRoundedPx(this.width * TILE_SIZE),
            -extendness,
            thickness,
            toRoundedPx(this.height * TILE_SIZE) + 2 * extendness,
        )

        // No sky for the moment I guess?
    }

    coordIsTouching(coord: Point, type: Tile): boolean {
        const tileValue = this.getTileFromCoord(coord);
        return tileValue == type;
    }

    getTile(tileCoord: Point) {
        if (tileCoord.x < 0 || tileCoord.x >= this.width || tileCoord.y < 0 || tileCoord.y >= this.height) {
            return Tile.GROUND;
        }

        return this.tiles[tileCoord.y][tileCoord.x];
    };

    getTileFromCoord(coord: Point) {
        const tileCoord = {
            x: Math.floor(coord.x / TILE_SIZE),
            y: Math.floor(coord.y / TILE_SIZE),
        }
        return this.getTile(tileCoord);
    }

    getTilePosFromCoord(coord: {x?: number, y?: number}, tilePos: {x?: number, y?: number}): number {
        // For the sec, just return the bottom?
        if (coord.x != null && tilePos.x != null) {
            const tileX = Math.floor(coord.x / TILE_SIZE);
            return tileX * TILE_SIZE + tilePos.x * (TILE_SIZE - 1);
        }
        if (coord.y != null && tilePos.y != null) {
            const tileY = Math.floor(coord.y / TILE_SIZE);
            return tileY * TILE_SIZE + tilePos.y * (TILE_SIZE - 1);
        }
        throw 'You did it wrong you dangus';
    }
}