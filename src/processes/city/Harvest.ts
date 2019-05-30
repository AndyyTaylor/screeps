
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

    }
    //will run every tick
    _run() {
        super._run();

        //Running through each creep
        for (let i = 0; i < this.data.creepNames.length; i++) {
            //Initialize Creep/Get Creep Object
            const name = this.data.creepNames[i];
            const creep = Game.creeps[name];
            creep.say('harvest');

            if (!this.source){
              continue;
            }
            creep.moveTo(this.source);
            //Check if already mining
              //If not mining, move to closes source
              //Else, check if full
                //If full, dump in Container
                //else, continue mining

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
