import getRedisConnection from "../../src/functions/getRedisConnection";
import revertData from "../../src/functions/revertData";
import { getFromRedis } from "../../src/retreive/retreive";


jest.mock('../../src/functions/getRedisConnection');
jest.mock('../../src/functions/revertData');

describe('getFromRedis', () => {
  let logger: any;
  let mockRedisConnection: any;

  beforeEach(() => {
    logger = {
      info: jest.fn(),
      error: jest.fn(),
    };
    mockRedisConnection = {
      get: jest.fn(),
      quit: jest.fn(),
    };
    (getRedisConnection as jest.Mock).mockReturnValue(mockRedisConnection);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should retrieve data successfully from Redis and revert it', async () => {
    const key = 'test-key';
    const resultString = '{"type":"string","dataAsString":"test data"}';
    const revertedData = 'test data';
    mockRedisConnection.get.mockResolvedValue(resultString);
    mockRedisConnection.quit.mockResolvedValue(true);
    (revertData as jest.Mock).mockReturnValue(revertedData);

    const getData = getFromRedis(logger);
    const result = await getData(key);

    expect(logger.info).toHaveBeenCalledWith(`Retrieving data with key:${key} from redis...`);
    expect(logger.info).toHaveBeenCalledWith(`Data with key:${key} has been retrieved successfully.`);
    expect(result).toBe(revertedData);
    expect(revertData).toHaveBeenCalledWith(resultString);
  });

  it('should handle the case where the key does not exist', async () => {
    const key = 'non-existent-key';
    mockRedisConnection.get.mockResolvedValue(null);
    mockRedisConnection.quit.mockResolvedValue(true);

    const getData = getFromRedis(logger);
    const result = await getData(key);

    expect(logger.info).toHaveBeenCalledWith(`Retrieving data with key:${key} from redis...`);
    expect(logger.error).toHaveBeenCalledWith(`Redis Error retrieving data: Undefined key:${key}`);
    expect(result).toBeUndefined();
  });

  it('should handle errors during data retrieval', async () => {
    const key = 'test-key';
    const error = new Error('Some error');
    mockRedisConnection.get.mockRejectedValue(error);
    mockRedisConnection.quit.mockResolvedValue(true);

    const getData = getFromRedis(logger);
    const result = await getData(key);

    expect(logger.info).toHaveBeenCalledWith(`Retrieving data with key:${key} from redis...`);
    expect(logger.error).toHaveBeenCalledWith(`Redis Error retrieving data: ${error.message}`);
    expect(result).toBeUndefined();
  });

  it('should handle errors during Redis connection closure', async () => {
    const key = 'test-key';
    const resultString = '{"type":"string","dataAsString":"test data"}';
    mockRedisConnection.get.mockResolvedValue(resultString);
    mockRedisConnection.quit.mockRejectedValue(new Error('quit error'));

    const getData = getFromRedis(logger);
    await getData(key);

    expect(logger.error).toHaveBeenCalledWith('Error closing redis connection: Error: quit error');
  });

  it('should log error if Redis connection fails', async () => {
    (getRedisConnection as jest.Mock).mockReturnValue(undefined);

    const getData = getFromRedis(logger);
    const result = await getData('test-key');

    expect(logger.error).toHaveBeenCalledWith('Getting data with key:test-key process has been stopped');
    expect(result).toBeUndefined();
  });

  it('should log info if Redis connection closes successfully', async () => {
    const key = 'test-key';
    const resultString = '{"type":"string","dataAsString":"test data"}';
    mockRedisConnection.get.mockResolvedValue(resultString);
    mockRedisConnection.quit.mockResolvedValue(true);

    const getData = getFromRedis(logger);
    await getData(key);

    expect(logger.info).toHaveBeenCalledWith('Redis Connection has been closed');
  });
});
