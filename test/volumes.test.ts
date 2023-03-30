import { Volumes } from '../src/volumes'

test('should create single volume', () => {
    // given
    const volumes = Volumes.builder()
        .withVolume("someVolume")
        .build()
    // when 
    const { name, yaml } = volumes.generateYAMLJSON();
    // then
    const expectedYaml = [
        {
            "someVolume": {},
        }
    ]
    expect(name).toBe("volumes")
    expect(JSON.stringify(yaml)).toBe(JSON.stringify(expectedYaml))
})

test('should multiple single volume', () => {
    // given
    const volumes = Volumes.builder()
        .withVolume("someVolume")
        .withVolume("someOtherVolume")
        .build()
    // when 
    const { name, yaml } = volumes.generateYAMLJSON();
    // then
    const expectedYaml = [
        {
            "someVolume": {},
        },
        {
            "someOtherVolume": {},
        }
    ]
    expect(name).toBe("volumes")
    expect(JSON.stringify(yaml)).toBe(JSON.stringify(expectedYaml))
})