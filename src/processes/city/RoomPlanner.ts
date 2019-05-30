
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
        console.log(`initing a city layout for ${this.homeName}`);

        console.log(`Width: ${base.width}, Height: ${base.height}`);
    }

    initRemoteLayout() {
        return;
    }

    _run() {
        // console.log('RoomPlanner: ' + JSON.stringify(this.data));

    }
}