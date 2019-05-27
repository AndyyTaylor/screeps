
import { Process } from '../framework/Process';


export class City extends Process {
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
        const sourceIds = this.homeRoom.find(FIND_SOURCES_ACTIVE).map((source) => {
            return source.id;
        });
        const harvestProcs = global.kernel.getProcessDataByType('harvest');
        for (let i = 0; i < sourceIds.length; i++) {
            const sId = sourceIds[i];
            let hasProcess = false;
            for (let j = 0; j < harvestProcs.length; j++) {
                if (harvestProcs[j].parentPID == this.pid && harvestProcs[j].sourceId == sId) {
                    hasProcess = true;
                    break;
                }
            }

            if (!hasProcess) {
                this.launchChildProcess('harvest', { sourceId: sId });
            }
        }
    }
}