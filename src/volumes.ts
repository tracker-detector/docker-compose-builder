import { Composable } from './composable';

export type VolumesConfig = {
  key: string;
  value: {};
  [propName: string]: any;
}[];

export class Volumes implements Composable {
  static VolumesBuilder = class {
    volumesConfig: VolumesConfig = [];

    withVolume(volumeName: string): this {
      this.volumesConfig.push({ key: volumeName, value: {} });
      return this;
    }

    build(): Volumes {
      return new Volumes(this.volumesConfig);
    }
  };

  private constructor(private readonly volumesConfig: VolumesConfig) {}

  static builder() {
    return new this.VolumesBuilder();
  }

  generateYAMLJSON(): { name: string; yaml: any } {
    const volumes: any = [];
    this.volumesConfig.map(({ key, value }) => {
      const json: any = {};
      json[key] = value;
      volumes.push(json);
    });
    return {
      name: 'volumes',
      yaml: volumes,
    };
  }
}
