import { spawn } from 'child_process';
import { SpawnResult, RCloneErrorRemark, RCloneError } from './rclone/error';


const getExitCode = (code: number): string => {
	switch (code) {
		case 1: return 'Uncaught Fatal Exception';
		case 3: return 'Internal JavaScript Parse Error';
		case 4: return 'Internal JavaScript Evaluation Failure';
		case 5: return 'Fatal Error';
		case 6: return 'Non-function Internal Exception Handler';
		case 7: return 'Internal Exception Handler Run-Time Failure';
		case 9: return 'Invalid Argument';
		case 10: return 'Internal JavaScript Run-Time Failure';
		case 12: return 'Invalid Debug Argument';
	}
	return 'Unknown exception code';
};

const isEmpty = (data: SpawnResult): boolean => {
	return !data.exit && !data.process && !data.spawn && !data.stderr && !data.stdin && !data.stdout;
};

const spawnPromise = async (command: string, args?: any, input?: any) => {
    const child = spawn(command, args);

    const errors: SpawnResult = {
        spawn: null,
        stdin: null,
        stdout: null,
        stderr: null,
        exit: null,
        process: null,
    };
    const stderrOutput = {
        process: '',
    };

    child.on('error', error => errors.spawn = error);
	child.stdin.on('error', error => errors.stdin = error);
	child.stdout.on('error', error => errors.stdout = error);
	child.stderr.setEncoding('utf8');
	child.stderr.on('error', error => errors.stderr = error);
	child.stderr.on('data', data => {
		if (!stderrOutput.process) stderrOutput.process = '';
		stderrOutput.process += data;
	});

	// Capture output
	const buffers: any[] = [];
	child.stdout.on('data', data => buffers.push(data));

	// Run
	const exitCode = await new Promise<number>(resolve => {
		child.on('close', (code) => resolve(code));
		child.stdin.end(input);
	});
	if (exitCode !== 0) {
		errors.exit = `Command failed: ${exitCode}: ${getExitCode(exitCode)}`;
		errors.process = stderrOutput.process;
	}

	// Return
	if (!isEmpty(errors)) {
		let remark = RCloneErrorRemark.Unknown;
		if (errors.process) {
			if (/directory\snot\sfound/.test(errors.process)) {
				remark = RCloneErrorRemark.DirectoryNotFound;
			}
		}
		throw new RCloneError(errors, remark);
	};
	return Buffer.concat(buffers);
}

export default spawnPromise;
