import { Transform, Writable } from 'stream';

export function preventEmptyStream(output: Writable) {
    let started = false;
    const transform = new Transform({
        transform(chunk, _encoding, callback) {
            if (!started) {
                started = true;
                this.pipe(output);
            }
            this.push(chunk);
            callback();
        }
    });
    return transform;
}
