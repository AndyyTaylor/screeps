
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