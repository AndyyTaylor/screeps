
import { ErrorMapper } from "./utils/ErrorMapper";
import { Kernel } from './framework/Kernel';


function basicLive() {
    const room = Game.rooms['W37N8'];

    const spawns = room.find(FIND_MY_SPAWNS);
    for (let i = 0; i < spawns.length; i++) {
        const spawn = spawns[i];
        if (spawn.energy >= 300) {
            spawn.spawnCreep([MOVE, WORK, CARRY, CARRY], Math.floor(Math.random() * 1000).toString());
        }
    }

    for (const name in Game.creeps) {
        const creep = Game.creeps[name];

        if (creep.memory.assigned) {
            continue;
        }

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

import async from 'async';

const kernel: Kernel = new Kernel();
global.kernel = kernel;

export const loop = ErrorMapper.wrapLoop(() => {
    // console.log(`Current game tick is ${Game.time}`);

    async.concatSeries([0, 1, 2, 3, 4, 5], (val, done) => {
        // const r = Math.floor(Math.random() * 10000);
        const r = (4 - val) * 100000;
        console.log(`${val} looping ${r} times`);

        let total = 0;
        for (let i = 0; i < r; i++) {
            total += Math.random();
        }

        console.log(`${val} is finished (${Math.floor(total)})`);
        done(null, [ val ]);
    }, (err, res) => {
        if (err)
            console.log(`Async Error: ${err}`);
        else
            console.log(`Async Res: ${res}`);
    });

    kernel.start();
    kernel.run();
    kernel.exit();

    // Will remove this ASAP, just so I don't loose the room
    // while I work on the framework
    basicLive();
});