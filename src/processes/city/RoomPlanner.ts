
import { Process } from '../../framework/Process';
import { base } from '../../base';

export class RoomPlanner extends Process {
    homeName: string;
    homeRoom: Room;

    constructor(pid: string, data: any) {
        super(pid, data);

        this.homeName = data.homeName;
        this.homeRoom = Game.rooms[this.homeName];
    }

    _init() {
        if (!this.homeRoom) {
            return false;
        }

        if (this.homeRoom.controller && this.homeRoom.controller.owner && this.homeRoom.controller.owner.username == 'Lisp') {
            this.initCityLayout();
        } else {
            this.initRemoteLayout();
        }


        return false;
    }

    initCityLayout() {
        if (!this.homeRoom.memory.basePos) {
            console.log(`Calculating new position`);

            const roomTerrain: RoomTerrain = this.homeRoom.getTerrain();
            const validWidth = this.getValidByWidth(base.width, roomTerrain);
            const validHeight = this.getValidByHeight(base.height, roomTerrain);

            const valid = validWidth.filter((pos) => {
                let vertCount = 0;
                for (let i = 0; i < validHeight.length; i++) {
                    if (validHeight[i].y == pos.y
                            && validHeight[i].x <= pos.x
                            && validHeight[i].x >= pos.x - base.width) {
                        vertCount += 1;
                    }
                }

                let horCount = 0;
                for (let i = 0; i < validWidth.length; i++) {
                    if (validWidth[i].x == pos.x
                            && validWidth[i].y <= pos.y
                            && validWidth[i].y >= pos.y - base.height) {
                        horCount += 1;
                    }
                }

                return vertCount >= base.height && horCount >= base.width;
            });

            const vis = this.homeRoom.visual;
            for (let i = 0; i < valid.length; i++) {
                const polyPoints: any = [];

                polyPoints.push([valid[i].x, valid[i].y]);
                polyPoints.push([valid[i].x - base.width, valid[i].y]);
                polyPoints.push([valid[i].x - base.width, valid[i].y - base.height]);
                polyPoints.push([valid[i].x, valid[i].y - base.height]);
                polyPoints.push([valid[i].x, valid[i].y]);

                for (let j = 0; j < polyPoints.length; j++) {
                    polyPoints[j] = [
                        polyPoints[j][0] + 0.5,
                        polyPoints[j][1] + 0.5
                    ];
                }

                vis.poly(polyPoints, { fill: 'aqua', opacity: 0.05 });
            }

            let bestScore = 0;
            let bestPos = null;
            for (let i = 0; i < valid.length; i++) {
                const pos = valid[i];

                const centre = { x: valid[i].x - base.width / 2, y: valid[i].y - base.height / 2 };

                if (!this.homeRoom.controller) return;

                const dist = Math.sqrt((Math.pow(centre.x - this.homeRoom.controller.pos.x, 2) + Math.pow(centre.y - this.homeRoom.controller.pos.y, 2)));

                const score = -dist;

                if (bestPos == null || score > bestScore) {
                    bestScore = score;
                    bestPos = pos;
                }
            }

            if (bestPos == null) return;

            const polyPoints: any = [];

            polyPoints.push([bestPos.x, bestPos.y]);
            polyPoints.push([bestPos.x - base.width, bestPos.y]);
            polyPoints.push([bestPos.x - base.width, bestPos.y - base.height]);
            polyPoints.push([bestPos.x, bestPos.y - base.height]);

            for (let j = 0; j < polyPoints.length; j++) {
                polyPoints[j] = [
                    polyPoints[j][0] + 0.5,
                    polyPoints[j][1] + 0.5
                ];
            }

            vis.poly(polyPoints, { fill: 'red', opacity: 0.8 });
            vis.circle(bestPos.x, bestPos.y);

            this.homeRoom.memory.basePos = bestPos;
        } else {
            const vis = this.homeRoom.visual;

            const polyPoints: any = [];

            polyPoints.push([this.homeRoom.memory.basePos.x, this.homeRoom.memory.basePos.y]);
            polyPoints.push([this.homeRoom.memory.basePos.x - base.width, this.homeRoom.memory.basePos.y]);
            polyPoints.push([this.homeRoom.memory.basePos.x - base.width, this.homeRoom.memory.basePos.y - base.height]);
            polyPoints.push([this.homeRoom.memory.basePos.x, this.homeRoom.memory.basePos.y - base.height]);
            polyPoints.push([this.homeRoom.memory.basePos.x, this.homeRoom.memory.basePos.y]);

            for (let j = 0; j < polyPoints.length; j++) {
                polyPoints[j] = [
                    polyPoints[j][0] + 0.5,
                    polyPoints[j][1] + 0.5
                ];
            }

            vis.poly(polyPoints, { fill: 'green', opacity: 0.1 });
        }
    }

    getValidByWidth(width: number, roomTerrain: RoomTerrain) {
        const validWidth = [];

        for (let yy = 3; yy < 47; yy++) {
            let unbroken = 0;
            for (let xx = 3; xx < 47; xx++) {
                const terrain = roomTerrain.get(xx, yy);

                if (terrain !== TERRAIN_MASK_WALL) {  // is walkable
                    unbroken += 1;
                } else {
                    unbroken = 0;
                }

                if (unbroken >= base.width) {
                    validWidth.push({ x: xx, y: yy });
                }
            }
        }

        return validWidth;
    }

    getValidByHeight(height: number, roomTerrain: RoomTerrain) {
        const validHeight = [];

        for (let xx = 3; xx < 47; xx++) {
            let unbroken = 0;
            for (let yy = 3; yy < 47; yy++) {
                const terrain = roomTerrain.get(xx, yy);

                if (terrain !== TERRAIN_MASK_WALL) {  // is walkable
                    unbroken += 1;
                } else {
                    unbroken = 0;
                }

                if (unbroken >= base.width) {
                    validHeight.push({ x: xx, y: yy });
                }
            }
        }

        return validHeight;
    }

    initRemoteLayout() {
        return;
    }

    _run() {
        // console.log('RoomPlanner: ' + JSON.stringify(this.data));
        const basePos = { x: this.homeRoom.memory.basePos.x, y: this.homeRoom.memory.basePos.y };

        basePos.x -= base.width;
        basePos.y -= base.height;

        if (this.homeRoom.find(FIND_MY_CONSTRUCTION_SITES).length == 0) {
            this.createConstructionSite(basePos);
        }

        this.visualiseBase(basePos);
    }

    visualiseBase(basePos: any) {
        const vis = this.homeRoom.visual;

        for (let i = 0; i < base.buildPriority.length; i++) {
            const buildType = base.buildPriority[i];

            for (let j = 0; j < base.buildings[buildType].pos.length; j++) {
                const relativePos = base.buildings[buildType].pos;
                const buildPos = {
                    x: basePos.x + base.buildings[buildType].pos[j].x,
                    y: basePos.y + base.buildings[buildType].pos[j].y
                };

                if (buildType == STRUCTURE_EXTENSION) {
                    vis.circle(buildPos.x, buildPos.y, { 'fill': 'yellow' });
                } else if (buildType == STRUCTURE_TOWER) {
                    vis.rect(buildPos.x - 0.4, buildPos.y - 0.4, 0.8, 0.8, { 'fill': 'yellow' });
                }
            }
        }
    }

    createConstructionSite(basePos: any) {
        for (let i = 0; i < base.buildPriority.length; i++) {
            const buildType = base.buildPriority[i];

            let hasBuilt = false;
            for (let j = 0; j < base.buildings[buildType].pos.length; j++) {
                const relativePos = base.buildings[buildType].pos;
                const buildPos = {
                    x: basePos.x + base.buildings[buildType].pos[j].x,
                    y: basePos.y + base.buildings[buildType].pos[j].y
                };

                let exists = false;
                const structs = this.homeRoom.lookForAt(LOOK_STRUCTURES, buildPos.x, buildPos.y);
                structs.forEach((struct) => {
                    if (struct.structureType == buildType) {
                        exists = true;
                    }
                });

                if (!exists) {
                    this.homeRoom.createConstructionSite(buildPos.x, buildPos.y, buildType);
                    hasBuilt = true;
                    break;
                }
            }

            if (hasBuilt) {
                break;
            }
        }
    }
}