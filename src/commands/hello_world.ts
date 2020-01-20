import { Command, flags } from '@oclif/command';

export default class HelloWorld extends Command {
  public static description = 'Says hello to the world';

  public static examples = [
    `$ terra hello_world
hello world from ./src/hello.ts!
`
  ];

  public static flags = {
    name: flags.string({
      description: 'the name of the file to create',
      char: 'n'
    })
  };

  public static args = [];

  public async run(): Promise<void> {
    const { flags } = this.parse(HelloWorld);

    const name = flags.name ?? 'world';
    this.log(`hello ${name} from ${__dirname}`);
  }
}
