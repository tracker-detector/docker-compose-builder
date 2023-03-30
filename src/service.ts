import { Composable } from './composable';
import { Environment } from './environment';

export type RestartPolicy = 'no' | 'always' | 'unless-stopped' | 'on-failure';
export type ServiceConfig = {
  [propName: string]: any;
  name?: string;
  container_name?: string;
  image?: string;
  build?: string;
  restarts?: RestartPolicy;
  depends_on?: string[];
  ports?: string[];
  volumes?: string[];
  environment?: Environment;
  command?: string;
};

export class Service implements Composable {
  static ServiceBuilder = class {
    config: ServiceConfig = {};

    constructor(public readonly name: string) {}

    withServiceName(service_name: string): this {
      this.config['container_name'] = service_name;
      return this;
    }

    withImage(image: string): this {
      this.config['image'] = image;
      return this;
    }

    withBuild(build: string): this {
      this.config['build'] = build;
      return this;
    }

    withRestarts(restarts: RestartPolicy): this {
      this.config['restarts'] = restarts;
      return this;
    }

    withDependsOn(...services: Service[]): this {
      this.config['depends_on'] = services.map((service) => service.name);
      return this;
    }

    withPorts(...ports: string[]): this {
      this.config['ports'] = ports;
      return this;
    }

    withVolumes(...volumes: string[]): this {
      this.config['volumes'] = volumes;
      return this;
    }

    withEnvironment(environment: Environment): this {
      this.config['environment'] = environment;
      return this;
    }

    withCommand(command: string): this {
      this.config['command'] = command;
      return this;
    }

    build(): Service {
      const config: ServiceConfig = {};
      Object.keys(this.config)
        .filter((param) => this.config[param] != null)
        .forEach((key) => {
          config[key] = this.config[key];
        });

      return new Service(this.name, config);
    }
  };

  static builder(name: string) {
    return new this.ServiceBuilder(name);
  }

  private constructor(private readonly name: string, private readonly config: ServiceConfig) {}

  generateYAMLJSON(): { name: string; yaml: any } {
    const yaml: any = {};
    Object.keys(this.config).forEach((key) => {
      this.addToJson(yaml, key, this.config[key]);
    });
    return {
      name: this.name,
      yaml: yaml,
    };
  }

  private addToJson(obj: any, key_name: string, value: any): void {
    if (value === null) {
      return;
    }
    if (typeof value === 'string') {
      obj[key_name] = value;
    } else if (key_name === 'environment') {
      const { name, yaml } = (value as Environment).generateYAMLJSON();
      obj[name] = yaml;
    } else if (key_name === 'depends_on' || key_name === 'ports' || key_name === 'volumes') {
      obj[key_name] = value;
    }
  }
}
