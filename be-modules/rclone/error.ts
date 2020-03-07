export enum RCloneErrorRemark {
	Unknown,
	DirectoryNotFound,
}

export class RCloneError extends Error {
	errors: SpawnResult;
	remark: RCloneErrorRemark;
	constructor(errors?: SpawnResult, remark?: RCloneErrorRemark) {
		super(errors ? JSON.stringify(errors) : 'RCloneError');
		this.errors = errors;
		this.remark = remark;
	}
}

export interface SpawnResult {
	spawn: any;
	stdin: any,
	stdout: any,
	stderr: any,
	exit: any,
	process: any,
}
