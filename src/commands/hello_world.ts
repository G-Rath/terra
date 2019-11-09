import { Command, flags } from '@oclif/command';

export default class HelloWorld extends Command {
  static description = 'Says hello to the world';

  static examples = [
    `$ terraport hello_world
hello world from ./src/hello.ts!
`
  ];

  static flags = {
    name: flags.string({
      description: 'the name of the file to create',
      char: 'n'
    })
  };

  static args = [];

  async run() {
    const { flags } = this.parse(HelloWorld);

    const name = flags.name || 'world';
    this.log(`hello ${name} from ${__dirname}`);
  }
}
