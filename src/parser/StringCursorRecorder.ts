import { StringCursor } from '@src/parser/StringCursor';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidV4 } from 'uuid';

interface CursorStep {
  uuid: string;
  name: string;
  args: readonly unknown[];
  steps: CursorStep[];
  result: unknown | string;
  wasThrown: boolean;
  startedAtChar: string;
  startedAtTime: number;
  startedAtPosition: number;
  stoppedAtChar: string;
  stoppedAtTime: number;
  stoppedAtPosition: number;
}

interface CursorRecording {
  input: string;
  steps: CursorStep[];
  startedAt: number;
  stoppedAt: number;
}

type StepInFlight = Omit<
  CursorStep,
  | 'result'
  | 'wasThrown'
  | 'stoppedAtTime'
  | 'stoppedAtChar'
  | 'stoppedAtPosition'
>;

export class StringCursorRecorder {
  private readonly _stepStack: StepInFlight[] = [];
  private readonly _recording: Omit<CursorRecording, 'stoppedAt'>;

  constructor(input: string) {
    this._recording = {
      input,
      steps: [],
      startedAt: Number(process.hrtime.bigint())
    };
  }

  private _popInFlightStep() {
    const inFlightStep = this._stepStack.pop();

    if (!inFlightStep) {
      throw new Error('no step in flight!');
    }

    return inFlightStep;
  }

  /**
   * Starts the recording of a step with the given name.
   *
   * @param {string} name
   * @param args
   */
  public start(
    cursor: StringCursor,
    name: string, //
    args: readonly unknown[]
  ) {
    this._stepStack.push({
      uuid: uuidV4(),
      name,
      args,
      steps: [],
      startedAtTime: Number(process.hrtime.bigint()),
      startedAtPosition: cursor.position,
      startedAtChar: cursor.char
    });
  }

  public stop(
    cursor: StringCursor,
    outcome: 'returned' | 'threw',
    result: unknown | string
  ): void {
    const finishedRecording: CursorStep = {
      ...this._popInFlightStep(),
      result,
      wasThrown: outcome === 'threw',
      stoppedAtTime: Number(process.hrtime.bigint()),
      stoppedAtPosition: cursor.position,
      stoppedAtChar: cursor.char
    };

    (this._stepStack.length
      ? this._stepStack[this._stepStack.length - 1]
      : this._recording
    ).steps.push(finishedRecording);
  }

  public wrapMethod<TParams extends unknown[], TReturn>(
    cursor: StringCursor,
    method: (...args: TParams) => TReturn
  ): (...args: TParams) => TReturn {
    const name = method.name;

    return (...args) => {
      // console.log(name, 'was called with', args.length, 'arguments');

      try {
        this.start(cursor, name, args);
        const value = method.apply(cursor, args);
        this.stop(cursor, 'returned', value);

        return value;
      } catch (err) {
        this.stop(cursor, 'threw', err.stack);

        throw err;
      }
    };
  }

  public writeToDisk(filePath = '', fileName = Date.now().toString(10)) {
    const recording: CursorRecording = {
      ...this._recording,
      stoppedAt: Number(process.hrtime.bigint())
    };

    fs.writeFileSync(
      path.join(filePath, `${fileName}.json`),
      JSON.stringify(recording, null, 2)
    );
  }
}
