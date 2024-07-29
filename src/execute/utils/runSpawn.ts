import { Logger } from "@nestjs/common";
import { spawn } from "child_process";

const logger = new Logger('Run Script')

export const runSpawn = (command: string, args: string[], options: any = {}): Promise<void> => {
    return new Promise((resolve, reject) => {
        const ls = spawn(command, args, { shell: true, ...options });

        ls.stdout.on('data', (data) => {
            logger.log(`stdout: ${data.toString()}`);
        });

        ls.stderr.on('data', (data) => {
            logger.log(`stderr: ${data.toString()}`);
        });

        ls.on('close', (code) => {
            logger.log(`Process exited with code ${code}`);
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Process exited with code ${code}`));
            }
        });
    });
}