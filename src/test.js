const async = require('async');

async.concat([0, 1, 2, 3, 4], (val, done) => {
    // const r = Math.floor(Math.random() * 10000);
    new Promise((resolve, reject) => {
        const r = (4 - val) * 300;
        console.log(`${val} looping ${r} times`);

        setTimeout(() => {
            console.log(`${val} is finished`);
            resolve(val);
        }, r);
    }).then((val) => {
        done(null, [ val ]);
    });
}, (err, res) => {
    if (err)
        console.log(`Async Error: ${err}`);
    else
        console.log(`Async Res: ${res}`);
});