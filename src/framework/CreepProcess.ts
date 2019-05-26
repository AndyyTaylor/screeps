
import { Process } from "./Process";

export class CreepProcess extends Process {

    constructor(pid: string, data?: any) {
        super(pid, data);

        if (_.isUndefined(this.data.creepNames)) {
            this.data.creepNames = [];
        }
    }

    protected _run() {
        this.removeOldCreeps();
        if (this.needsCreeps()) {
            this.assignCreeps();
        }
    }

    private removeOldCreeps(): void {
        const toRemove: string[] = [];
        for (let i = 0; i < this.data.creepNames.length; i++) {
            const name = this.data.creepNames[i];
            if (!(name in Game.creeps)) {
                toRemove.push(name);
            }
        }

        for (let i = 0; i < toRemove.length; i++) {
            const index = this.data.creepNames.indexOf(toRemove[i]);
            if (index != -1) {
                this.data.creepNames.splice(index, 1);
            } else {
                throw new Error(`Bad index in CreepProcess._run()`);
            }
        }
    }

    protected assignCreep(name: string): void {
        this.data.creepNames.push(name);
        Game.creeps[name].memory.assigned = this.pid;
    }

    protected _init() {};
    protected needsCreeps(): boolean { return false; };
    protected assignCreeps() {};
}