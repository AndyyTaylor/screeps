
export class Process {
    hasInit: boolean;

    constructor(protected readonly pid: string, protected data?: any) {
        this.hasInit = false;
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
}