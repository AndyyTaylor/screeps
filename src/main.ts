
import { ErrorMapper } from "./utils/ErrorMapper";
import { Kernel } from './framework/Kernel';


function basicLive() {
    const room = Game.rooms['W37N8'];
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }

    const spawns = room.find(FIND_MY_SPAWNS);
    for (let i = 0; i < spawns.length; i++) {
        const spawn = spawns[i];
        if (spawn.energy >= 300) {
            spawn.spawnCreep([MOVE, WORK, CARRY, CARRY], Math.floor(Math.random() * 1000).toString());
        }
    }

    for (const name in Game.creeps) {
        const creep = Game.creeps[name];

        creep.say('Basic Live');

        if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.mining = false;
        } else if (creep.carry.energy == 0) {
            creep.memory.mining = true;
        }

        if (creep.memory.mining) {
            const source = creep.pos.findClosestByRange(room.find(FIND_SOURCES_ACTIVE));
            if (!source) {
                return;
            }

            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        } else {
            if (!room.controller) {
                return;
            }

            if (creep.upgradeController(room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(room.controller);
            }
        }
    }
}


const kernel: Kernel = new Kernel();
global.kernel = kernel;

export const loop = ErrorMapper.wrapLoop(() => {
    console.log(`Current game tick is ${Game.time}`);

    kernel.start();
    kernel.run();
    kernel.exit();

    // Will remove this ASAP, just so I don't loose the room
    // while I work on the framework
    basicLive();
});