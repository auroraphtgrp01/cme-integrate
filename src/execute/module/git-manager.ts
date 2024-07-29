import { runSpawn } from 'src/execute/utils/runSpawn';
import { Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigEnvironment } from 'src/types/configEnv';

export class GitManager {
    constructor(configEnv: ConfigEnvironment) {
        this.configEnv = configEnv;
    }

    configEnv: ConfigEnvironment;
    private readonly logger = new Logger('Docker Manager');
    private repositories = [
        'https://github.com/auroraphtgrp01/cme-main',
        'https://github.com/auroraphtgrp01/cme-bff'
    ];
    async onCloneRepository() {
        if (!this.configEnv.CLONE_REPOSITORY) { return }
        for (const repository of this.repositories) {
            const repoName = path.basename(repository, '.git');
            const repoPath = path.resolve(`../${repoName}`);
            if (fs.existsSync(repoPath)) {
                this.logger.log(`Repository ${repoName} already exists at ${repoPath}`);
                return;
            }
            this.logger.log(`Starting clone repository: ${repository}`);
            const currentPath = process.cwd();
            this.logger.log(`Current working directory: ${currentPath}`);
            try {
                await runSpawn('git', ['clone', repository], { cwd: path.resolve(currentPath, '..') });
                this.logger.log(`Successfully cloned repository: ${repository}`);
                if (this.configEnv.CHECKOUT_DEVELOP) {
                    await runSpawn('git', ['checkout', 'develop'], { cwd: repoPath });
                    this.logger.log(`Successfully checkout develop branch for repository: ${repository}`);
                }
                if (this.configEnv.YARN_INSTALL) {
                    await this.runYarnInstall(repoPath);
                }
            } catch (error) {
                this.logger.error(`Failed to clone repository: ${repository}`, error.message);
            }
        }
    }

    async runYarnInstall(repoPath: string) {
        this.logger.log(`Running yarn install in directory: ${repoPath}`);
        try {
            await runSpawn('yarn', ['install'], { cwd: repoPath });
            this.logger.log(`Successfully ran yarn install in ${repoPath}`);
        } catch (error) {
            this.logger.error(`Failed to run yarn install in ${repoPath}`, error.message);
        }
    }
}
