
import { ErrorMapper } from "./utils/ErrorMapper";
import { Kernel } from './framework/Kernel';


const kernel: Kernel = new Kernel();

export const loop = ErrorMapper.wrapLoop(() => {
    console.log(`Current game tick is ${Game.time}`);

    kernel.start();
    kernel.run();
    kernel.exit();

    // Automatically delete memory of missing creeps
    // Move to kernel.exit later
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }
});