import { Service } from '../src/service'

test('should create service', () => {
    // given
    const service = Service.builder("service")
                    .withServiceName("service")
                    .withImage("image")
                    .withCommand("run service")
                    .withPorts("80:80")
                    .withRestarts("always")
                    .withVolumes("dist:/dist")
                    .build()
    // when 
    const { name, yaml } = service.generateYAMLJSON();
    // then
    const expectedYaml = {
        container_name: 'service',
        image: 'image',
        command: 'run service',
        ports: [ '80:80' ],
        restarts: 'always',
        volumes: [ 'dist:/dist' ]
    }
    expect(name).toBe("service")
    expect(JSON.stringify(yaml)).toBe(JSON.stringify(expectedYaml))
})