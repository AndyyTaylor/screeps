
import { Process } from '../framework/Process';


export class Empire extends Process {

    constructor(pid: string, data: any) {
        super(pid, data);

    }

    _init() {
        console.log("empire is initializing");

        return true;
    }

    _run() {
        const cityData = global.kernel.getProcessDataByType('city');
        const assigned = _.map(cityData, (data: any) => {
            return data.homeName;
        });

        for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName];
            if (room.controller && room.controller.owner && room.controller.owner.username == global.USERNAME
                && !assigned.includes(roomName)) {
                    console.log(`Launching city for ${roomName}`);
                    this.launchChildProcess('city', { homeName: roomName });
            }
        }
    }
}
