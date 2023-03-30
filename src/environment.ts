import { Composable } from "./composable"

export type EnvironmentConfig = {
    key: string, 
    value: string,
    [propName: string]: any,
}[] 

export class Environment implements Composable {
    static EnvironmentBuilder = class {
        environmentConfig: EnvironmentConfig = []

        withEnvironmentVariable(key: string, value: string): this {
            this.environmentConfig.push({key, value})
            return this
        }

        build(): Environment {
            return new Environment(this.environmentConfig)
        }
    }
    
    private constructor(private readonly environmentConfig: EnvironmentConfig){}

    static builder() {
        return new this.EnvironmentBuilder()
    }

    generateYAMLJSON(): {name: string, yaml: any} {
        let envs: any = []
        this.environmentConfig.map(({key, value}) => {
            let json: any = {}
            json[key] = value
            envs.push(json)
        })
        return {
            name: "environment",
            yaml: envs
        }
    }
}