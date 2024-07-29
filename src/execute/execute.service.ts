import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DockerManager } from 'src/execute/module/docker-manager';
import { GitManager } from 'src/execute/module/git-manager';
import { ConfigEnvironment } from 'src/types/configEnv';

@Injectable()
export class ExecuteService {
  private readonly logger = new Logger(ExecuteService.name);
  ;
  private readonly configService = new ConfigService()

  async onInitialProject() {
    const configEnv = await this.onGetConfig()
    const gitManager = new GitManager(configEnv)
    await gitManager.onCloneRepository();
    const dockerManager = new DockerManager(configEnv);
    await dockerManager.onDockerBuild();
  }

  async onGetConfig(): Promise<ConfigEnvironment> {
    const envName = [
      'CLONE_REPOSITORY',
      'BUILD_DOCKER_IMAGE',
      'BUILD_DOCKER_COMPOSE',
      'CHECKOUT_DEVELOP',
      'YARN_INSTALL'
    ]

    const config: Partial<ConfigEnvironment> = {};
    envName.forEach((env) => {
      config[env as keyof ConfigEnvironment] = JSON.parse(this.configService.get(env).toLowerCase());
    });

    return config as ConfigEnvironment;
  }
}
