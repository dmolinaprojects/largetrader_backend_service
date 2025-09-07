import { JsonParsePipe } from './json-parse.pipe';

describe('JsonParsePipe', () => {
  it('should be defined', () => {
    expect(new JsonParsePipe()).toBeDefined();
  });

  it('should parse string', () => {
    /**
     * SECTION: Arrange
     */
    const pipe = new JsonParsePipe();
    const expected = { name: 'John Doe' };
    const value = JSON.stringify(expected);

    /**
     * SECTION: Act
     */
    const result = pipe.transform(value);

    /**
     * SECTION: Assert
     */
    expect(result).toEqual(expected);
  });

  it('should parse object', () => {
    /**
     * SECTION: Arrange
     */
    const pipe = new JsonParsePipe(['address']);
    const address = {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
    };
    const expected = {
      name: 'John Doe',
      age: '30',
      address,
    };
    const value = {
      name: 'John Doe',
      age: '30',
      address: JSON.stringify(address),
    };

    /**
     * SECTION: Act
     */
    const result = pipe.transform(value);

    /**
     * SECTION: Assert
     */
    expect(result).toEqual(expected);
    expect(result.address).toBeInstanceOf(Object);
  });

  it('should parse array', () => {
    /**
     * SECTION: Arrange
     */
    const pipe = new JsonParsePipe(['address']);
    const address = {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
    };
    const expected = [
      {
        name: 'John Doe',
        age: '30',
        address,
      },
    ];
    const value = [
      {
        name: 'John Doe',
        age: '30',
        address: JSON.stringify(address),
      },
    ];

    /**
     * SECTION: Act
     */
    const result = pipe.transform(value);

    /**
     * SECTION: Assert
     */
    expect(result).toEqual(expected);
  });
});
