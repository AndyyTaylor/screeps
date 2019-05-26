
interface Memory {
    masterPID: number;
}

interface CreepMemory {
    mining: boolean;
    assigned: string;
}

declare namespace NodeJS {
    interface Global {
        log: any;
        kernel: any;
    }
}