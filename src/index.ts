import { stringify } from 'yaml'
import { DockerCompose } from './docker-compose'
import { Environment } from './environment'
import { Service } from './service'
import { Volumes } from './volumes'

const environment = Environment.builder()
                    .withEnvironmentVariable('MINIO_ROOT_USER', 'admin')
                    .withEnvironmentVariable('MINIO_ROOT_PASSWORD', 'StronPassword')
                    .build()

const environmentForServices = Environment.builder()
                    .withEnvironmentVariable('MINIO_ACCESS_KEY', 'admin')
                    .withEnvironmentVariable('MINIO_PRIVATE_KEY', 'StronPassword')
                    .withEnvironmentVariable('MODEL_BUCKET_NAME', 'models')
                    .withEnvironmentVariable('TRAINING_DATA_BUCKET_NAME', 'training-data')
                    .withEnvironmentVariable('MONGO_DB_BACKUP_BUCKET_NAME', 'backup')
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

const training = Service.builder("training")
                .withServiceName("training")
                .withBuild("./training")
                .withEnvironment(environmentForServices)
                .withDependsOn(mongoDb, minio)
                .withRestarts("always")
                .withCommand("python handler.py")
                .build()

const server = Service.builder("server")
                .withServiceName("server")
                .withBuild("./server")
                .withEnvironment(environmentForServices)
                .withDependsOn(mongoDb, minio)
                .withRestarts("always")
                .build()

const nginx = Service.builder("nginx")
                .withServiceName("nginx")
                .withBuild("./gateway")
                .withDependsOn(minio, mongoDb, server, training)
                .withPorts("80:80")
                .build()                

const volumes = Volumes.builder()
                .withVolume("minio_storage")
                .withVolume("mongo_storage")
                .build()

const compose = DockerCompose.builder()
        .withVersion("2")
        .withServices(nginx, minio, mongoDb, server, training)
        .withVolumes(volumes)
        .build()

console.log(stringify(compose.generateYAMLJSON()))