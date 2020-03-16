/* eslint-disable no-sync, max-classes-per-file */
import * as assert from 'assert';
import disparity from 'disparity';
import * as fs from 'fs';
import * as path from 'path';
import * as tsconfigPaths from 'tsconfig-paths';
import tsConfig from './../tsconfig.json';

const [, , inputFilepath, desiredFilepath] = process.argv;

assert.ok(
  inputFilepath,
  new Error('First argument must be path to file to format')
);

tsconfigPaths.register(tsConfig.compilerOptions);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const showCursor = (): boolean => process.stdout.write('\x1b[?25h');
const hideCursor = (): boolean => process.stdout.write('\x1b[?25l');

type RecordedConsoleCall = [
  keyof Omit<Console, 'Console'>,
  [unknown, ...unknown[]]
];

class ConsoleProxy {
  private static readonly _self = new ConsoleProxy();

  private readonly _originalConsole = global.console;
  private readonly _consoleCalls: RecordedConsoleCall[] = [];
  private readonly _proxy = new Proxy(console, {
    get: (target, p: RecordedConsoleCall[0]): unknown => {
      if (typeof target[p] !== 'function') {
        throw new Error(`ConsoleProxy: console.${p} is not a function`);
      }

      return (...args: RecordedConsoleCall[1]): unknown =>
        this._consoleCalls.push([p, args]);
    }
  });

  public static get calls(): RecordedConsoleCall[] {
    return this._self._consoleCalls;
  }

  public static get console(): Console {
    return this._self._originalConsole;
  }

  public static get proxy(): Console {
    return this._self._proxy;
  }

  public static clearCalls(): void {
    this._self._consoleCalls.length = 0;
  }

  public static replayCalls(): void {
    this._self._consoleCalls.forEach(([k, args]) => this.console[k](...args));
  }

  public static replaceGlobalConsole(): void {
    global.console = this.proxy;
  }

  public static restoreGlobalConsole(): void {
    global.console = this.console;
  }
}

class FileWatcher {
  private static readonly _self = new FileWatcher();

  private readonly _debounceTimers: Record<string, NodeJS.Timer> = {};

  public static watchForChanges(filepath: string, onChange: () => void): void {
    this._self._watchForChanges(filepath, onChange);
  }

  private _watchForChanges(filepath: string, onChange: () => void): void {
    if (filepath in this._debounceTimers) {
      console.warn('clearing timer');

      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this._debounceTimers[filepath];
    }

    fs.watch(filepath).on('change', () =>
      this._refreshDebounceTimer(filepath, onChange)
    );
  }

  private _refreshDebounceTimer(filepath: string, callback: () => void): void {
    if (filepath in this._debounceTimers) {
      this._debounceTimers[filepath].refresh();

      return;
    }

    this._debounceTimers[filepath] = setTimeout(callback, 0);
  }
}

const clearFileFromRequireCache = (filepath: string): void => {
  const absolutePath = path.resolve(filepath);
  const dir = path.parse(absolutePath).dir;

  const itemsToClear = Object.keys(require.cache).filter(name =>
    name.startsWith(dir)
  );

  if (itemsToClear.length) {
    console.log('removing', itemsToClear.length, 'items from require.cache');

    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    itemsToClear.forEach(name => delete require.cache[name]);

    refresh();
  }
};

const watchDirectoryFullOfCode = (directory: string): void => {
  fs.readdirSync(directory, { withFileTypes: true }).forEach(file => {
    const fullpath = path.join(directory, file.name);

    if (file.isDirectory()) {
      watchDirectoryFullOfCode(fullpath);

      return;
    }

    if (!fullpath.endsWith('.ts')) {
      return;
    }

    FileWatcher.watchForChanges(fullpath, () => {
      clearFileFromRequireCache(fullpath);
    });
  });
};

const formatInputFile = (): string => {
  const inputFileContents = fs.readFileSync(inputFilepath).toString();

  // needs to be required since we want to cache-bust if they're changed
  /* eslint-disable @typescript-eslint/no-var-requires,@typescript-eslint/no-require-imports,global-require */
  const { parseTFFileContents } = require('@src/parser');
  const { format } = require('@src/formatter');
  const { printTFFileContents } = require('@src/printer');
  /* eslint-enable @typescript-eslint/no-var-requires,@typescript-eslint/no-require-imports,global-require */

  return printTFFileContents(format(parseTFFileContents(inputFileContents)));
};

// process.stdin.setRawMode(true);
// process.stdin.on('data', data => console.log('you pressed', data.toString()));

let successfulFormattingResults = '';
let desiredFormattingResults = '';

const refresh = (): void => {
  console.log('formatting input file...');

  let formattingError: Error | null = null;

  desiredFormattingResults =
    desiredFilepath && fs.readFileSync(desiredFilepath).toString();

  ConsoleProxy.replaceGlobalConsole();
  try {
    successfulFormattingResults = formatInputFile();
  } catch (error) {
    formattingError = error;
  }
  ConsoleProxy.restoreGlobalConsole();

  const output = [Date(), `Watching contents of ${inputFilepath} for changes`];

  if (desiredFormattingResults) {
    output[1] += ` - diffing with ${desiredFilepath}`;
  }

  if (successfulFormattingResults) {
    output.push(
      '-'.repeat(61),
      desiredFormattingResults
        ? disparity.unified(
            successfulFormattingResults,
            desiredFormattingResults,
            { paths: [inputFilepath, desiredFilepath] }
          )
        : successfulFormattingResults
    );
  }

  console.clear();
  console.log(output.join('\n'));

  if (formattingError) {
    console.log(
      ['-'.repeat(61), 'Unable to format file due to errors:', '\n'].join('\n'),
      formattingError // join will remove the call stack :(
    );
  }

  if (ConsoleProxy.calls.length) {
    console.log('-'.repeat(61));
    ConsoleProxy.replayCalls();
    ConsoleProxy.clearCalls();
  }
};

const FORMATTERS_DIRECTORY = path.join('src', 'formatter');

FileWatcher.watchForChanges(inputFilepath, refresh);

if (desiredFilepath) {
  FileWatcher.watchForChanges(desiredFilepath, refresh);
}

watchDirectoryFullOfCode(FORMATTERS_DIRECTORY);

hideCursor();
refresh();
