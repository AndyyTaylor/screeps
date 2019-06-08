
interface Memory {
    masterPID: number;
}

declare module "*.json"
{ const value: any;
  export default value;
}

declare module "json!*"
{ const value: any;
  export default value;
}

interface CreepMemory {
    gathering: boolean;
    mining: boolean;
    assigned: string;
}

declare namespace NodeJS {
    interface Global {
        log: any;
        kernel: any;
        USERNAME: string;
    }
}