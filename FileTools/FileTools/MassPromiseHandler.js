
function PromiseSource() {
    return new Promise();
}


class MassPromiseHandler {
    /**
     * 
     * @param {PromiseSource[]} promiseSources
     */
    constructor(promiseSources) {
        this.sources = promiseSources;
        this.started = false;
        this.countDone = 0;
        this.onPromisesDone = (results) => { };
        this.batchSize = 20;
        this.results = [];

    }
    async all() {
        if (!this.started) {
            this.started = true;
            const batch = [];
            batch.length = this.batchSize;
            let currentIndex = 0;

            while (this.countDone < this.length) {
                const thisBatchSize = Math.min(this.length - currentIndex, this.batchSize);
                // start a batch of promises
                for (let i = 0; i < this.batchSize; ++i) {
                    if (i < thisBatchSize) {
                        batch[i] = this.sources[currentIndex]();
                        currentIndex++;
                    }
                    else {
                        batch.length = i;
                        break;
                    }
                }
                // wait for the promises
                const results = await Promise.all(batch);
                this.results.push(...results);
                this.countDone = currentIndex;
                this.onPromisesDone(results, this);
            }
        }
    }
    get length() {
        return this.sources.length;
    }
    get fractionDone() {
        return this.countDone / this.length;
    }
    get percentDone() {
        return this.fractionDone * 100;
    }
}

export default MassPromiseHandler;