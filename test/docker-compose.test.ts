import { Service } from '../src/service'
import { Environment } from '../src/environment'
import { DockerCompose } from '../src/docker-compose'
import { Volumes } from '../src/volumes'
import { unlinkSync, readFileSync } from 'fs'


afterEach(() => {
    unlinkSync("docker-compose.yaml")
})

test('should create dockerfile', () => {
    // given
    const environment = Environment.builder()
                    .withEnvironmentVariable("SomeVar", "1")
                    .build()
    const service = Service.builder("service")
                    .withServiceName("service")
                    .withImage("image")
                    .withCommand("run service")
                    .withPorts("80:80")
                    .withRestarts("always")
                    .withEnvironment(environment)
                    .withVolumes("dist:/dist")
                    .build()
    const volumes = Volumes.builder()
                    .withVolume("someVolume")
                    .withVolume("someOtherVolume")
                    .build()

    const docker = DockerCompose.builder()
        .withVersion("2")
        .withServices(service)
        .withVolumes(volumes)
        .build()
    // when 
    docker.createDockerComposeFile("docker-compose.yaml");
    // then
    const expectedDockerFile = readFileSync('./test/assets/docker-compose.yaml', {encoding:'utf8', flag:'r'})
    const file = readFileSync('docker-compose.yaml', {encoding:'utf8', flag:'r'})
    expect(file.trim()).toBe(expectedDockerFile.trim())
})