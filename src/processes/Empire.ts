
import { Process } from '../framework/Process';


export class Empire extends Process {

    constructor(pid: string, data: any) {
        super(pid, data);

    }

    _init() {
        console.log("empire is initializing");
    }

    _run() {
        console.log("Empire is running");
    }
}