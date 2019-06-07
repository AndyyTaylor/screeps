
export class Process {
    hasInit: boolean;

    constructor(protected readonly pid: string, protected data?: any) {
        this.hasInit = false;
    }

    public init(): void {
        this.hasInit = this._init();
    }

    public run(): void {
        if (!this.hasInit) {
            this.init();
        }

        this._run();
    }

    protected launchChildProcess(type: string, data?: any): void {
        global.kernel.launchProcess(type, Object.assign({ parentPID: this.pid }, data));
    }

    public isComplete(): boolean { return false; }
    protected _init(): boolean { return true; };
    protected _run(): void {};
}