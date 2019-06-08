
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
        return true;
    }

    _run() {
        // console.log(JSON.stringify(this.data));
        this.launchOneOfProcesses();
        this.launchHarvestProcesses();
    }

    launchOneOfProcesses() {
        const oneOf = ['roomplanner', 'build', 'feed'];

        for (let i = 0; i < oneOf.length; i++) {
            const processType = oneOf[i];

            // HACK: this will break with multiple cities
            const hasProcess = global.kernel.hasProcessOfType(processType);

            if (!hasProcess) {
                this.launchChildProcess(processType, { homeName: this.homeName });
            }
        }
    }

    launchHarvestProcesses() {
        const sourceIds = this.homeRoom.find(FIND_SOURCES_ACTIVE).map((source) => {
            return source.id;
        });
        const harvestProcs = global.kernel.getProcessDataByType('harvest');
        for (let i = 0; i < sourceIds.length; i++) {
            const sId = sourceIds[i];
            let hasProcess = false;
            for (let j = 0; j < harvestProcs.length; j++) {
                // console.log(JSON.stringify(harvestProcs[j]));
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