
import { CreepProcess } from '../../framework/CreepProcess';


export class Build extends CreepProcess {
    homeName: string;
    homeRoom: Room;

    constructor(pid: string, data: any) {
        super(pid, data);

        this.homeName = data.homeName;
        this.homeRoom = Game.rooms[this.homeName];
    }

    _init() {
        return true;
    }

    _run() {
        super._run();

        for (let i = 0; i < this.data.creepNames.length; i++) {
            const name = this.data.creepNames[i];
            const creep = Game.creeps[name];

            creep.say('build');

            if (creep.carry.energy == 0) {
                creep.memory.mining = true;
            } else if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.mining = false;
            }

            if (creep.memory.mining) {
                this.gatherResources(creep);
            } else {
                this.buildSite(creep);
            }
        }
    }

    gatherResources(creep: Creep) {
        const resources = creep.room.find(FIND_DROPPED_RESOURCES);

        // Try pickup energy off the ground
        if (resources.length > 0) {
            const energy = creep.pos.findClosestByRange(resources);
            if (!creep.pos.isNearTo(energy)) {
                creep.moveTo(energy);
            } else {
                creep.pickup(energy);
            }
        } else {  // Otherwise harvest it directly
            const source = creep.pos.findClosestByRange(creep.room.find(FIND_SOURCES_ACTIVE));

            if (source) {
                if (!creep.pos.isNearTo(source)) {
                    creep.moveTo(source);
                } else {
                    creep.harvest(source);
                }
            }
        }
    }

    buildSite(creep: Creep) {
        const site = creep.pos.findClosestByRange(creep.room.find(FIND_MY_CONSTRUCTION_SITES));

        if (site) {
            if (!creep.pos.inRangeTo(site, 3)) {
                creep.moveTo(site);
            } else {
                creep.build(site);
            }
        }
    }

    needsCreeps() {
        return this.data.creepNames.length < 1;
    }

    assignCreeps() {
        for (const name in Game.creeps) {
            const creep = Game.creeps[name];

            if (!creep.memory.assigned) {
                this.assignCreep(name);

                if (!this.needsCreeps()) {
                    break;
                }
            }
        }
    }
}