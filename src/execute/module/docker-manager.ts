import { runSpawn } from 'src/execute/utils/runSpawn';
import { Logger } from '@nestjs/common';
import { ConfigEnvironment } from 'src/types/configEnv';

export class DockerManager {
    constructor(
        configEnv: ConfigEnvironment
    ) {
        this.configEnv = configEnv;
    }

    configEnv: ConfigEnvironment;
    private readonly logger = new Logger('Docker Manager');
    private volumes = [
        'cme-integrate_kafka-data',
        'cme-integrate_postgres-data',
        'cme-integrate_redis-data',
        'cme-integrate_zookeeper-data',
    ];
    private containers = ['kafka', 'zookeeper', 'redis', 'postgres'];


    async deleteVolumes(): Promise<void> {
        for (const container of this.containers) {
            try {
                await runSpawn('docker', ['kill', container]);
                this.logger.log(`Successfully killed container: ${container}`);
            } catch (error) {
                this.logger.error(`Failed to kill container ${container}: ${error.message}`);
            }

            try {
                await runSpawn('docker', ['rm', container]);
                this.logger.log(`Successfully removed container: ${container}`);
            } catch (error) {
                this.logger.error(`Failed to remove container ${container}: ${error.message}`);
            }
        }
        for (const volume of this.volumes) {
            this.logger.log(`Deleting volume: ${volume}`);
            try {
                await runSpawn('docker', ['volume', 'rm -f', volume]);
                this.logger.log(`Successfully deleted volume: ${volume}`);
            } catch (error) {
                this.logger.error(`Failed to delete volume: ${volume}: ${error.message}`);
                throw error;
            }
        }
    }

    async onDockerComposeUp() {
        const currentPath = process.cwd();
        try {
            await runSpawn('docker-compose', ['up', '-d'], { cwd: currentPath });
            this.logger.log(`Docker compose up completed`);
        } catch (error) {
            this.logger.error(`Failed to run docker-compose up`, error.message);
        }
    }

    async onDockerBuild() {
        if (this.configEnv.BUILD_DOCKER_COMPOSE) {
            await this.deleteVolumes();
            await this.onDockerComposeUp();
        } else {
            this.logger.verbose('Skip build docker image !');
        }
    }
}
