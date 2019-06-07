
import _ from 'lodash';
import { Process } from './Process';
import { Empire } from '../processes/Empire';
import { City } from '../processes/City';
import { Harvest } from '../processes/city/Harvest';
import { RoomPlanner } from '../processes/city/RoomPlanner';
import { Build } from '../processes/city/Build';

// Need a better way to handle this
const processClasses: any = {
    'empire': Empire,
    'city': City,
    'harvest': Harvest,
    'build': Build,
    'roomplanner': RoomPlanner
};

/*
    The Kernel class will be responsible for running & managing
    all the processes, and will handle some high-level monitoring
*/
export class Kernel {
    // Declare variables etc
    // Validate memory & create defaults if necessary
    // actual loading done in start() so we have more control over
    // when that happens
    processes: { [id: string]: Process; };
    procData: { [id: string]: any };
    finished: string[];

    constructor() {
        this.processes = {};
        this.procData = {};
        this.finished = [];

        Kernel.validateMemory();
    }

    // If runtime mem has reset, pull from Memory
    // General pre-run init stuff idk
    public start() {
        if (!this.hasProcessOfType('empire')) {
            this.launchProcess('empire');
        }
    }

    // Should execute the process in order of priority
    public run() {
        for (const pid in this.procData) {
            // console.log(`Running process ${pid}`);
            const process: Process = this.getProcess(pid);

            try {
                process.run();

                if (process.isComplete()) {
                    this.finished.push(pid);
                    console.log(`${pid} is finished.`);
                }
            } catch (ex) {
                console.log(`${pid} failed: ${ex}`);
            }
        }
    }

    // Should save everything in memory incase runtime memory resets
    // Should also clear uneccessary memory
    public exit() {
        this.clearFinishedProcesses();
        this.clearDeadCreepMemory();
        this.clearCreepAssignments();
    }

    public launchProcess(type: string, data?: any) {
        console.log(`Creating process of type ${type}`);
        this.procData[this.genPID()] = Object.assign({ type: type }, data || {});
    }

    public getProcess(id: string) {
        if (id in this.processes) {
            return this.processes[id];
        } else if (id in this.procData) {
            return this.initProcess(id);
        } else {
            throw new Error(`Process ${id} not found`);
        }
    }

    public getProcessDataByType(type: string) {
        const data = [];
        for (const pid in this.procData) {
            const procData = this.procData[pid];
            if (procData.type == type) {
                data.push(procData);
            }
        }

        return data;
    }

    private clearFinishedProcesses() {
        for (let i = 0; i < this.finished.length; i++) {
            const pid = this.finished[i];

            this.deleteProcess(pid);
        }

        this.finished = [];
    }

    private deleteProcess(pid: string) {
        delete this.procData[pid];
        delete this.processes[pid];

        const pids = Object.keys(this.procData);
        pids.forEach((pid2) => {
            if (this.procData[pid2].parentPID == pid) {
                this.deleteProcess(pid2);
            }
        });
    }

    private clearDeadCreepMemory() {
        for (const name in Memory.creeps) {
            if (!(name in Game.creeps)) {
                delete Memory.creeps[name];
            }
        }
    }

    private clearCreepAssignments() {
        for (const name in Memory.creeps) {
            if (Memory.creeps[name].assigned
                && !(Memory.creeps[name].assigned in this.procData)) {
                    delete Memory.creeps[name].assigned;
            }
        }
    }

    private genPID(): string {
        const pid = Memory.masterPID;
        Memory.masterPID += 1;

        return pid.toString();
    }

    public hasProcessOfType(type: string) {
        for (let pid in this.procData) {
            if (this.procData[pid].type == type) {
                return true;
            }
        }

        return false;
    }

    private initProcess(id: string) {
        let process: Process;
        let type: string = this.procData[id].type;

        if (type in processClasses) {
            process = new processClasses[type](id, this.procData[id]);
        } else {
            throw new Error(`Unknown process type ${type}`);
        }

        // Cache the process instance
        this.processes[id] = process;

        return process;
    }

    static validateMemory() {
        if (_.isUndefined(Memory.masterPID)) {
            Memory.masterPID = 0;
        }
    }
}