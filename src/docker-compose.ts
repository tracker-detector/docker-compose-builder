import { Service } from './service';
import { Volumes } from './volumes';
import { stringify } from 'yaml';
import { existsSync, unlinkSync, appendFileSync } from 'fs';

export type DockerComposeConfig = {
  [propName: string]: any;
  version?: string;
  services?: Service[];
  volumes?: Volumes;
};

export class DockerCompose {
  static DockerComposeBuilder = class {
    dockerComposeConfig: DockerComposeConfig = {};
    withVersion(version: string): this {
      this.dockerComposeConfig['version'] = version;
      return this;
    }
    withServices(...services: Service[]): this {
      this.dockerComposeConfig['services'] = services;
      return this;
    }
    withVolumes(volumes: Volumes): this {
      this.dockerComposeConfig['volumes'] = volumes;
      return this;
    }

    build(): DockerCompose {
      return new DockerCompose(this.dockerComposeConfig);
    }
  };

  private constructor(private readonly dockerComposeConfig: DockerComposeConfig) {}

  static builder() {
    return new this.DockerComposeBuilder();
  }

  private generateYAMLJSON() {
    const resultYaml: any = {};
    const services: any = {};
    if (this.dockerComposeConfig.version != null) {
      resultYaml['version'] = this.dockerComposeConfig.version;
    }
    this.dockerComposeConfig.services?.forEach((service) => {
      const { name, yaml } = service.generateYAMLJSON();
      if (Object.keys(yaml).length === 0) {
        services[name] = { name: 'tets' };
      } else {
        services[name] = yaml;
      }
    });
    resultYaml['services'] = services;
    if (this.dockerComposeConfig.volumes) {
      const { name, yaml } = this.dockerComposeConfig.volumes.generateYAMLJSON();
      resultYaml[name] = yaml;
    }
    return resultYaml;
  }

  createDockerComposeFile(fileName: string) {
    if (existsSync(fileName)) unlinkSync(fileName);
    appendFileSync(fileName, stringify(this.generateYAMLJSON()));
  }
}
