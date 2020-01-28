import { walkNode } from '@src/formatter';
import { makeTFArgument } from '@src/makers';

describe('walkNode', () => {
  describe('when entering a node matching a listener', () => {
    it('calls the listeners in the right order', () => {
      const node = makeTFArgument('identifier', 'expression');

      const argumentEnterListener = jest.fn().mockName('Argument:enter');
      const argumentExitListener = jest.fn().mockName('Argument:exit');
      const identifierEnterListener = jest.fn().mockName('Identifier:enter');
      const identifierExitListener = jest.fn().mockName('Identifier:exit');
      const simpleEnterListener = jest.fn().mockName('Simple:enter');
      const simpleExitListener = jest.fn().mockName('Simple:exit');

      walkNode(node, {
        Argument: {
          enter: argumentEnterListener,
          exit: argumentExitListener
        },
        Identifier: {
          enter: identifierEnterListener,
          exit: identifierExitListener
        },
        Simple: {
          enter: simpleEnterListener,
          exit: simpleExitListener
        }
      });

      const expectedCallOrder = [
        argumentEnterListener,
        identifierEnterListener,
        identifierExitListener,
        simpleEnterListener,
        simpleExitListener,
        argumentExitListener
      ];

      const actualCallOrder = [...expectedCallOrder]
        .filter(fn => fn.mock.calls[0]) // pick listeners that have been called
        .sort(
          (a, b) =>
            a.mock.invocationCallOrder[0] - b.mock.invocationCallOrder[0]
        );

      expect(actualCallOrder.map(fn => fn.getMockName())).toStrictEqual(
        expectedCallOrder.map(fn => fn.getMockName())
      );
    });

    it('calls the listeners with the right nodes', () => {
      const node = makeTFArgument('identifier', 'expression');

      const argumentEnterListener = jest.fn().mockName('Argument:enter');
      const argumentExitListener = jest.fn().mockName('Argument:exit');
      const identifierEnterListener = jest.fn().mockName('Identifier:enter');
      const identifierExitListener = jest.fn().mockName('Identifier:exit');
      const simpleEnterListener = jest.fn().mockName('Simple:enter');
      const simpleExitListener = jest.fn().mockName('Simple:exit');

      walkNode(node, {
        Argument: {
          enter: argumentEnterListener,
          exit: argumentExitListener
        },
        Identifier: {
          enter: identifierEnterListener,
          exit: identifierExitListener
        },
        Simple: {
          enter: simpleEnterListener,
          exit: simpleExitListener
        }
      });

      const expectedCalls = [
        [argumentEnterListener, node],
        [identifierEnterListener, node.identifier],
        [identifierExitListener, node.identifier],
        [simpleEnterListener, node.expression],
        [simpleExitListener, node.expression],
        [argumentExitListener, node]
      ];

      expectedCalls.forEach(([fn, arg]) =>
        expect(fn).toHaveBeenCalledWith(arg)
      );
    });
  });

  describe('when the top-level listener is a function', () => {
    it('only calls the listener on entering the selected node', () => {
      const node = makeTFArgument('identifier', 'expression');

      const identifierListener = jest.fn().mockName('Identifier');

      walkNode(node, { Identifier: identifierListener });

      expect(identifierListener).toHaveBeenCalledTimes(1);
      expect(identifierListener).toHaveBeenCalledWith(node.identifier);
    });
  });
});
