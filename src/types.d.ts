interface Memory {
    masterPID: number;
}

interface CreepMemory {
    mining: boolean;
}


declare namespace NodeJS {
    interface Global {
        log: any;
    }
}