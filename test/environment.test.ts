import { Environment } from '../src/environment'

test('should create single environmentvar', () => {
    // given
    const environment = Environment.builder()
        .withEnvironmentVariable("SomeVar", "1")
        .build()
    // when 
    const { name, yaml } = environment.generateYAMLJSON();
    // then
    const expectedYaml = [
        {
            "SomeVar": "1",
        }
    ]
    expect(name).toBe("environment")
    expect(JSON.stringify(yaml)).toBe(JSON.stringify(expectedYaml))
})

test('should multiple single environmentVars', () => {
    // given
    const environment = Environment.builder()
        .withEnvironmentVariable("SomeVar", "1")
        .withEnvironmentVariable("SomeVar1", "2")
        .build()
    // when 
    const { name, yaml } = environment.generateYAMLJSON();
    // then
    const expectedYaml = [
        {
            "SomeVar": "1",
        },
        {
            "SomeVar1": "2",
        }
    ]
    expect(name).toBe("environment")
    expect(JSON.stringify(yaml)).toBe(JSON.stringify(expectedYaml))
})