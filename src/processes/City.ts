
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
        
    }
}