
import { Process } from "./Process";

export class CreepProcess extends Process {

    constructor(pid: string, data?: any) {
        super(pid, data);

        if (_.isUndefined(this.data.creepNames)) {
            this.data.creepNames = [];
        }
    }

    public init() {
        this.hasInit = true;

        this._init();
    }

    public run() {
        if (!this.hasInit) {
            this.init();
        }

        this._run();
    }

    protected launchChildProcess(type: string, data?: any) {
        global.kernel.launchProcess(type, Object.assign({ parentPID: this.pid }, data));
    }

    protected _init() {};
    protected _run() {};
    protected needsCreeps(): boolean { return false; };
    protected assignCreeps() {};

    
}