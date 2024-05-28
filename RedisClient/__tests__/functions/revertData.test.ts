import revertData from '../../src/functions/revertData';

describe('revertData', () => {
  it('should convert data type "number" correctly', () => {
    const convertedData = JSON.stringify({ type: 'number', dataAsString: '123.45' });
    const result = revertData(convertedData);
    expect(result).toBe(123.45);
  });

  it('should convert data type "boolean" correctly', () => {
    const trueData = JSON.stringify({ type: 'boolean', dataAsString: 'true' });
    const falseData = JSON.stringify({ type: 'boolean', dataAsString: 'false' });

    expect(revertData(trueData)).toBe(true);
    expect(revertData(falseData)).toBe(false);
  });

  it('should convert data type "object" correctly', () => {
    const objectData = JSON.stringify({ type: 'object', dataAsString: '{"key": "value"}' });
    const result = revertData(objectData);
    expect(result).toEqual({ key: 'value' });
  });

  it('should return dataAsString for unknown types', () => {
    const stringData = JSON.stringify({ type: 'string', dataAsString: 'some text' });
    const result = revertData(stringData);
    expect(result).toBe('some text');
  });

  it('should handle missing dataAsString gracefully', () => {
    const nullData = JSON.stringify({ type: 'string', dataAsString: null });
    const result = revertData(nullData);
    expect(result).toBeNull();
  });
});
