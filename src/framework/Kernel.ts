
import _ from 'lodash';
import { Process } from './Process';
import { Empire } from '../processes/Empire';
import { City } from '../processes/City';

// Need a better way to handle this
const processClasses: any = {
    'empire': Empire,
    'city': City
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

    constructor() {
        this.processes = {};
        this.procData = {};

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
        for (let pid in this.procData) {
            console.log(`Running process ${pid}`);
            const process: Process = this.getProcess(pid);

            process.run();
        }
    }

    // Should save everything in memory incase runtime memory resets
    // Should also clear uneccessary memory
    public exit() {

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

    private genPID(): string {
        const pid = Memory.masterPID;
        Memory.masterPID += 1;

        return pid.toString();
    }

    private hasProcessOfType(type: string) {
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