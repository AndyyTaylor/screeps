
import { CreepProcess } from '../../framework/CreepProcess';


export class Upgrade extends CreepProcess {
    homeName: string;
    homeRoom: Room;
    source: Source | null;
    resource: Source | Mineral<MineralConstant>;

    constructor(pid: string, data: any) {
        super(pid, data);

        this.homeName = data.homeName;
        this.homeRoom = Game.rooms[this.homeName];
        this.source = Game.getObjectById(this.data.sourceId);
        this.resource = Game.getObjectById(this.data.resourceId);

    }
    //will run once for complex tasks that we can store in memory
    _init() {
        return true;
    }
    //will run every tick
    _run() {
        super._run();

        //Running through each creep
        for (let i = 0; i < this.data.creepNames.length; i++) {
            //Initialize Creep/Get Creep Object
            const name = this.data.creepNames[i];
            const creep = Game.creeps[name];
            creep.say('Power Time');

            //If there is no source say no source and continue with program
            if (!this.resource){
              creep.say('No Resource');
              continue;
            }

            // If there is a source, move to source and mine it
            creep.moveTo(this.resource);
            creep.harvest(this.resource);

        }
    }
    // Check for total of 6 workparts working on source
    needsCreeps() {

        return this.data.creepNames.length < 1;
    }

    //Preference creeps with more workparts to work on source
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
