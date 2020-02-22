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
      default: 'world',
      char: 'n'
    })
  };

  public static args = [];

  // eslint-disable-next-line @typescript-eslint/require-await
  public async run(): Promise<void> {
    const {
      flags: { name }
    } = this.parse(HelloWorld);

    this.log(`hello ${name} from ${__dirname}`);
  }
}
