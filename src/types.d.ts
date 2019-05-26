interface Memory {
    masterPID: number;
}


declare namespace NodeJS {
    interface Global {
        log: any;
    }
}