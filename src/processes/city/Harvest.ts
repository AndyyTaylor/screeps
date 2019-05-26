
import { CreepProcess } from '../../framework/CreepProcess';


export class Harvest extends CreepProcess {
    homeName: string;
    homeRoom: Room;

    constructor(pid: string, data: any) {
        super(pid, data);

        this.homeName = data.homeName;
        this.homeRoom = Game.rooms[this.homeName];
    }

    _init() {

    }

    _run() {
        super._run();

        for (let i = 0; i < this.data.creepNames.length; i++) {
            const name = this.data.creepNames[i];
            const creep = Game.creeps[name];

            creep.say('harvest');
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