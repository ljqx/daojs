const Promise = require('bluebird');
const CalculationNetwork = require('../index.js');

describe('CalculationNetwork', () => {
  describe('#constructor()', () => {
    it('should be a function', () => {
      expect(CalculationNetwork).toBeInstanceOf(Function);
    });

    it('should create the CalculationNetwork correctly', () => {
      expect(() => new CalculationNetwork({
        parameters: { foo: 1, bar: 2 },
        cells: {
          tic: {
            dependencies: ['foo', 'bar'],
            factory: (foo, bar, boom) => foo + bar + boom,
          },
        },
      })).not.toThrow();
    });

    it('should call onUpdate on initial parameters', () => {
      const onUpdate = jest.fn();
      const cn = new CalculationNetwork({
        parameters: { foo: 1, bar: 2 },
        cells: {
          tic: {
            dependencies: ['foo', 'bar'],
            factory: (foo, bar) => foo + bar,
          },
        },
        onUpdate,
      });

      expect(onUpdate).toHaveBeenCalledTimes(2);
      expect(onUpdate).toHaveBeenCalledWith(cn, 'foo', 1);
      expect(onUpdate).toHaveBeenCalledWith(cn, 'bar', 2);
    });

    it('should check for invalid dependencies', () => {
      expect(() => new CalculationNetwork({
        parameters: { foo: 1, bar: 2 },
        cells: {
          tic: {
            dependencies: ['foo', 'bar', 'boom'],
            factory: (foo, bar, boom) => foo + bar + boom,
          },
        },
      })).toThrow('Invalid dependency "boom"');
    });

    it('should check for circular dependencies', () => {
      expect(() => new CalculationNetwork({
        parameters: { foo: 1, bar: 2 },
        cells: {
          tic: {
            dependencies: ['foo', 'bar', 'tac'],
            factory: (foo, bar, tac) => foo + bar + tac,
          },
          tac: {
            dependencies: ['foo', 'bar', 'tic'],
            factory: (foo, bar, tic) => foo + bar + tic,
          },
        },
      })).toThrow('Circular dependencies detected');
    });
  });

  describe('#get()', () => {
    let cn = null;
    let onUpdate = null;

    beforeEach(() => {
      onUpdate = jest.fn();
      cn = new CalculationNetwork({
        parameters: { foo: 1, bar: 2 },
        cells: {
          tic: {
            dependencies: ['foo', 'bar'],
            factory: (foo, bar) => foo + bar,
          },
          tac: {
            dependencies: ['tic'],
            factory: tic => tic + 1,
          },
          toe: {
            dependencies: ['foo'],
            factory: foo => foo + 1,
          },
        },
        onUpdate,
      });
    });

    it('should get the parameter values correctly', async () => {
      await expect(cn.get('foo')).resolves.toEqual(1);
      await expect(cn.get('bar')).resolves.toEqual(2);
    });

    it('should get the cell values correctly', async () => {
      await expect(cn.get('tic')).resolves.toEqual(3);
      await expect(cn.get('tac')).resolves.toEqual(4);
      await expect(cn.get('toe')).resolves.toEqual(2);
    });

    it('should invoke the onUpdate callback', async () => {
      onUpdate.mockClear();

      await cn.get('toe');
      expect(onUpdate).toHaveBeenCalledTimes(1);
      expect(onUpdate).toHaveBeenCalledWith(cn, 'toe', 2);

      onUpdate.mockClear();

      await cn.get('tac');
      expect(onUpdate).toHaveBeenCalledTimes(2);
      expect(onUpdate).toHaveBeenCalledWith(cn, 'tic', 3);
      expect(onUpdate).toHaveBeenCalledWith(cn, 'tac', 4);
    });

    it('should check for invalid keys', async () => {
      expect(() => cn.get('boom')).toThrow('Invalid cell or parameter "boom"');
    });
  });

  describe('#set()', () => {
    let cn = null;
    let onUpdate = null;
    let onInvalidate = null;

    beforeEach(() => {
      onUpdate = jest.fn();
      onInvalidate = jest.fn();
      cn = new CalculationNetwork({
        parameters: { foo: 1, bar: 2 },
        cells: {
          tic: {
            dependencies: ['foo', 'bar'],
            factory: (foo, bar) => foo + bar,
          },
          tac: {
            dependencies: ['tic'],
            factory: tic => tic + 1,
          },
          toe: {
            dependencies: ['foo'],
            factory: foo => foo + 1,
          },
        },
        onUpdate,
        onInvalidate,
      });
    });

    it('should set the parameters correctly', async () => {
      cn.set({ foo: 2, bar: 3 });
      await expect(cn.get('foo')).resolves.toEqual(2);
      await expect(cn.get('bar')).resolves.toEqual(3);
    });

    it('should return the invalidated cell keys', async () => {
      expect(cn.set({ foo: 2 })).toEqual(['foo']);
      await expect(Promise.all([
        cn.get('tic'),
        cn.get('tac'),
        cn.get('toe'),
      ])).resolves.toEqual([4, 5, 3]);
      expect(cn.set({ foo: 1 })).toEqual(['foo', 'tic', 'tac', 'toe']);
    });

    it('should call the onInvalidate/onUpdate on the parameters', () => {
      onUpdate.mockClear();

      cn.set({ foo: 2, bar: 3 });

      expect(onInvalidate).toHaveBeenCalledTimes(2);
      expect(onInvalidate).toHaveBeenCalledWith(cn, 'foo');
      expect(onInvalidate).toHaveBeenCalledWith(cn, 'bar');

      expect(onUpdate).toHaveBeenCalledTimes(2);
      expect(onUpdate).toHaveBeenCalledWith(cn, 'foo', 2);
      expect(onUpdate).toHaveBeenCalledWith(cn, 'bar', 3);
    });

    it('should call onInvalidate but not onUpdate on the dependents', async () => {
      await Promise.map(['tic', 'tac', 'toe'], key => cn.get(key)).all();
      onInvalidate.mockClear();
      onUpdate.mockClear();

      cn.set({ foo: 2 });
      expect(onInvalidate).toHaveBeenCalledTimes(4);
      expect(onInvalidate).toHaveBeenCalledWith(cn, 'foo');
      expect(onInvalidate).toHaveBeenCalledWith(cn, 'tic');
      expect(onInvalidate).toHaveBeenCalledWith(cn, 'tac');
      expect(onInvalidate).toHaveBeenCalledWith(cn, 'toe');

      expect(onUpdate).toHaveBeenCalledTimes(1);
      expect(onUpdate).toHaveBeenCalledWith(cn, 'foo', 2);
    });

    it('should check for invalid key', () => {
      expect(() => cn.set({ foo: 2, boom: 3 })).toThrow('Invalid parameter "boom"');
      expect(() => cn.set({ foo: 2, tic: 3 })).toThrow('Invalid parameter "tic"');
    });
  });
});
