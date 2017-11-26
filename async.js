'use strict';

exports.isStar = true;
exports.runParallel = runParallel;

function runParallel(jobs, parallelNum, timeout = 1000) {
    return new Promise(resolve => {
        if (!jobs.length) {
            resolve([]);
        }

        let currentJob = 0;
        let results = [];

        for (let i = 0; i < parallelNum; i++) {
            start(jobs[currentJob], currentJob++);
        }

        function start(job, currentJobIndex) {
            let onFinish = result => finish(result, currentJobIndex);

            new Promise((resolveJob, rejectJob) => {
                job().then(resolveJob, rejectJob);
                setTimeout(rejectJob, timeout, new Error('Promise timeout'));
            })
                .then(onFinish)
                .catch(onFinish);
        }

        function finish(result, index) {
            results[index] = result;
            if (results.length === jobs.length) {
                resolve(results);

                return;
            }

            if (currentJob < jobs.length) {
                start(jobs[currentJob], currentJob++);
            }
        }
    });
}
