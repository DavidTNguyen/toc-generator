import path from 'path';
import { setFailed, getInput } from '@actions/core';
import { context, GitHub } from '@actions/github';
import { isTargetEvent } from '@technote-space/filter-github-action';
import { Logger, Utils, ApiHelper } from '@technote-space/github-action-helper';
import { getChangedFiles } from './utils/command';
import { TARGET_EVENTS } from './constant';
import { getCommitMessage, getWorkDir } from './utils/misc';

const {showActionInfo} = Utils;

/**
 * run
 */
async function run(): Promise<void> {
	try {
		const logger = new Logger();
		showActionInfo(path.resolve(__dirname, '..'), logger, context);

		if (!isTargetEvent(TARGET_EVENTS, context)) {
			logger.info('This is not target event.');
			return;
		}

		const files = await getChangedFiles(context);
		if (false === files) {
			return;
		}
		await (new ApiHelper(logger)).commit(getWorkDir(), getCommitMessage(), files, new GitHub(getInput('GITHUB_TOKEN', {required: true})), context);
	} catch (error) {
		setFailed(error.message);
	}
}

run();