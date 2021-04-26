import * as Images from "../images";
import { lerp } from "../util";
import { Point, rng, SCREEN_HEIGHT, SCREEN_WIDTH, fromPx, toPx, toRoundedPx } from "./constants";
import { Boss } from "./entity/boss";
import { DebugEntity } from "./entity/debug-entity";
import { Entity } from "./entity/entity";
import { FlyingEye } from "./entity/flying-eye";
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

    levelImage: HTMLImageElement;
    subGame: SubGame;
    player!: Player;
    entities: Entity[] = [];
    tiles: Tile[][] = [];

    constructor(subGame: SubGame, levelImage: HTMLImageElement) {
        this.subGame = subGame;
        this.levelImage = levelImage;

        this.initFromImage(levelImage);
    }

    initFromImage(levelImage: HTMLImageElement) {
        for (let y = 0; y < levelImage.height; y++) {
            const tileRow: Tile[] = [];
            for (let x = 0; x < levelImage.width; x++) {
                tileRow[x] = Tile.AIR;
            }
            this.tiles.push(tileRow);
        }


        // Gotta draw it to a canvas to get the pixels
        const canvas = document.createElement('canvas');
        canvas.width = levelImage.width;
        canvas.height = levelImage.height;
        const context = canvas.getContext('2d')!
        context.drawImage(levelImage, 0, 0, levelImage.width, levelImage.height);

        for (let y = 0; y < levelImage.height; y++) {
            for (let x = 0; x < levelImage.width; x++) {
                const colorArray = context.getImageData(x, y, 1, 1);
                const colorString = Array.from(colorArray.data.slice(0, 3))
                    .map(d => d.toString(16))
                    .map(s => {
                        while(s.length < 2) {
                            s = '0' + s;
                        }
                        return s;
                    })
                    .join('');
                const b = colorArray.data[2];

                if (colorString == '000000') {
                    this.tiles[y][x] = Tile.GROUND;
                }
                else if (colorString == 'ff00ff') {
                    console.log('add player')
                    this.player = this.addEntity(Player, {x, y});
                }
                else if (colorString.startsWith('00ff')) {
                    const pickup = this.addEntity(Pickup, {x, y});
                    pickup.subGameIndex = b;
                }
                else if (colorString == 'ff0000') {
                    this.addEntity(FlyingEye, {x, y}, {tilePos: {x: 0.5, y: 0.5}});
                }
                else if (colorString == 'ff9900') {
                    const b = this.addEntity(Boss, {x, y}, {tilePos: {x: 0.5, y: 0.5}});
                    b.makeTargets();
                }
            }
        }

        if (this.player == null) {
            throw new Error(`No player for level ${this.subGame.index}`);
        }
    }

    addEntity<T extends Entity>(clazz: new (...args: any[]) => T, tileCoord:Point, {tilePos = {x: 0.5, y: 1}}: {tilePos?: Point} = {}): T {
        const ent: T = new clazz(this);
        ent.midX = tileCoord.x * TILE_SIZE + tilePos.x * (TILE_SIZE - 1);
        ent.maxY = tileCoord.y * TILE_SIZE + tilePos.y * (TILE_SIZE - 1);
        this.entities.push(ent);

        return ent;
    }


    entitiesOfType<T extends Entity>(clazz: new (...args: any[]) => T): T[] {
        return this.entities.filter(ent => ent instanceof clazz) as T[];
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

    // TODO: This should probably save to a separate list instead of directly removing.
    remove(entity: Entity) {
        const index = this.entities.indexOf(entity);
        if (index < 0) {
            console.error(`I cannae remove entity ${entity}`);
            return;
        }
        this.entities.splice(index, 1);
    }

    render(context: CanvasRenderingContext2D) {
        context.save();
        context.resetTransform();
        context.fillStyle = '#2ce8f5';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.restore();

        // Just render ALL the tiles for the moment.
        // this.renderFrame(context);
        this.renderTiles(context);

        for (const entity of this.entities) {
            entity.render(context);
        }
    }

    renderTiles(context:CanvasRenderingContext2D) {
        if (!Images.images['tiles'].loaded || Images.images['tiles'].image == null) {
            return;
        }

        const extraTiles = 8;
        for (let y = -extraTiles; y <= this.height + extraTiles; y++) {
            for (let x = -extraTiles; x <= this.width + extraTiles; x++) {

                // A little more efficient.
                if ((x + 1) * TILE_SIZE < this.subGame.camera.minVisibleX ||
                    (x - 1) * TILE_SIZE > this.subGame.camera.maxVisibleX ||
                    (y + 1) * TILE_SIZE < this.subGame.camera.minVisibleY ||
                    (y - 1) * TILE_SIZE > this.subGame.camera.maxVisibleY) {
                    continue;
                }

                const tile = this.getTile({x, y});

                if (tile == Tile.GROUND) {
                    // context.fillStyle = DEBUG_GROUND_COLOR;
                    // context.fillRect(
                    //     toRoundedPx(x * TILE_SIZE),
                    //     toRoundedPx(y * TILE_SIZE),
                    //     toPx(TILE_SIZE),
                    //     toPx(TILE_SIZE),
                    // );
                    const tileAbove = this.getTile({x, y: y-1});

                    if (tileAbove == Tile.GROUND) {
                        this.renderTile(context, {x, y}, {x: 1, y: 0});
                        continue;
                    }

                    this.renderTile(context, {x, y}, {x: 0, y: 0});

                }
            }
        }
    }

    renderTile(context: CanvasRenderingContext2D, renderPos: Point, tileGraphicPos: Point) {
        context.drawImage(
            Images.images['tiles'].image!,
            tileGraphicPos.x * 16,
            tileGraphicPos.y * 16,
            16,
            16,
            toRoundedPx(renderPos.x * TILE_SIZE) - 3,
            toRoundedPx(renderPos.y * TILE_SIZE) - 3,
            16,
            16,
        )
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
        if (tileCoord.x < 0 || tileCoord.x >= this.width || tileCoord.y >= this.height) {
            return Tile.GROUND;
        }
        if (tileCoord.y < 0) {
            return Tile.AIR;
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

    reset() {
        this.subGame.level = new Level(this.subGame, this.levelImage);
    }
}