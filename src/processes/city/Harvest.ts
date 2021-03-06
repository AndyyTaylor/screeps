
import { CreepProcess } from '../../framework/CreepProcess';


export class Harvest extends CreepProcess {
    homeName: string;
    homeRoom: Room;
    source: Source | null;

    constructor(pid: string, data: any) {
        super(pid, data);

        this.homeName = data.homeName;
        this.homeRoom = Game.rooms[this.homeName];
        this.source = Game.getObjectById(this.data.sourceId);

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
            creep.say('I do 4 Bob');

            //If there is no source say no source and continue with program
            if (!this.source){
              creep.say('No source');
              continue;
            }

            // If there is a source, move to source and mine it
            creep.moveTo(this.source);
            creep.harvest(this.source);

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
