
import { CreepProcess } from '../../framework/CreepProcess';


export class Feed extends CreepProcess {
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

            creep.say('feed');

            if (creep.carry.energy == 0) {
                creep.memory.gathering = true;
            } else if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.gathering = false;
            }

            if (creep.memory.gathering) {
                this.gatherResources(creep);
            } else {
                this.feedSite(creep);
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
        }
        // else grab from container near source
        //
    }

    feedSite(creep: Creep) {
        const sites = this.homeRoom.find(FIND_MY_STRUCTURES).filter((struct) => {
            return ((struct.structureType == STRUCTURE_SPAWN || struct.structureType == STRUCTURE_EXTENSION
                    || struct.structureType == STRUCTURE_TOWER)
                    && struct.energy < struct.energyCapacity);
        });

        const site = creep.pos.findClosestByRange(sites);

        if (site) {
            if (!creep.pos.inRangeTo(site, 3)) {
                creep.moveTo(site);
            } else {
                creep.transfer(site, RESOURCE_ENERGY);
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