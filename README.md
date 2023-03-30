# Docker Compose Builder

This package enables you to define your docker compose fiel from code and let it generate a `docker-compose.yml` on the fly. This is especially usefull if you need to have a variable length of the same service. Now you can create container in a loop and add as many as you want.


## Example 
```ts
import { DockerCompose } from './docker-compose'
import { Environment } from './environment'
import { Service } from './service'
import { Volumes } from './volumes'

const environment = Environment.builder()
                    .withEnvironmentVariable('MINIO_ROOT_USER', 'admin')
                    .withEnvironmentVariable('MINIO_ROOT_PASSWORD', 'StronPassword')
                    .build()


const minio = Service.builder("minio")
                .withServiceName("minio")
                .withImage("minio/minio")
                .withEnvironment(environment)
                .withCommand('server --console-address ":9001" /data')
                .build()


const mongoDb = Service.builder("db")
                    .withServiceName("db")
                    .withImage("mongo:latest")
                    .withVolumes("mongo_storage:/data/db")
                    .build()
            
const volumes = Volumes.builder()
                .withVolume("minio_storage")
                .withVolume("mongo_storage")
                .build()

const compose = DockerCompose.builder()
        .withVersion("2")
        .withServices(minio, mongoDb)
        .withVolumes(volumes)
        .build()

compose.createDockerComposeFile('docker-compose.yaml')
```
Generates:
```yaml
version: "2"
services:
  minio:
    container_name: minio
    image: minio/minio
    environment:
      - MINIO_ROOT_USER: admin
      - MINIO_ROOT_PASSWORD: StronPassword
    command: server --console-address ":9001" /data
  db:
    container_name: db
    image: mongo:latest
    volumes:
      - mongo_storage:/data/db
volumes:
  - minio_storage: {}
  - mongo_storage: {}
```


