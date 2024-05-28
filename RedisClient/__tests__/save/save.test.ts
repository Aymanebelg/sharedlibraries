import convertData from "../../src/functions/convertData";
import getRedisConnection from "../../src/functions/getRedisConnection";
import { saveToRedis } from "../../src/save/save";


jest.mock('../../src/functions/getRedisConnection');
jest.mock('../../src/functions/convertData');

describe('saveToRedis', () => {
  let logger: any;
  let mockRedisConnection: any;

  beforeEach(() => {
    logger = {
      info: jest.fn(),
      error: jest.fn(),
    };
    mockRedisConnection = {
      set: jest.fn(),
      quit: jest.fn(),
    };
    (getRedisConnection as jest.Mock).mockReturnValue(mockRedisConnection);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should save data successfully to Redis', async () => {
    const key = 'test-key';
    const data = { test: 'data' };
    const convertedData = JSON.stringify(data);
    (convertData as jest.Mock).mockReturnValue(convertedData);
    mockRedisConnection.set.mockResolvedValue('OK');
    mockRedisConnection.quit.mockResolvedValue(true);

    const saveData = saveToRedis(logger);
    const result = await saveData(key, data);

    expect(logger.info).toHaveBeenCalledWith(`Saving data with key:${key} to redis...`);
    expect(logger.info).toHaveBeenCalledWith(`Data with key:${key} has been saved successfully.`);
    expect(result).toBe(true);
    expect(convertData).toHaveBeenCalledWith(data);
    expect(mockRedisConnection.set).toHaveBeenCalledWith(key, convertedData);
  });

  it('should handle errors during data saving', async () => {
    const key = 'test-key';
    const data = { test: 'data' };
    const error = new Error('Some error');
    (convertData as jest.Mock).mockReturnValue(JSON.stringify(data));
    mockRedisConnection.set.mockRejectedValue(error);
    mockRedisConnection.quit.mockResolvedValue(true);

    const saveData = saveToRedis(logger);
    const result = await saveData(key, data);

    expect(logger.info).toHaveBeenCalledWith(`Saving data with key:${key} to redis...`);
    expect(logger.error).toHaveBeenCalledWith(`Redis Error saving data: ${error.message}`);
    expect(result).toBe(false);
  });

  it('should handle errors during Redis connection closure', async () => {
    const key = 'test-key';
    const data = { test: 'data' };
    (convertData as jest.Mock).mockReturnValue(JSON.stringify(data));
    mockRedisConnection.set.mockResolvedValue('OK');
    mockRedisConnection.quit.mockRejectedValue(new Error('quit error'));

    const saveData = saveToRedis(logger);
    await saveData(key, data);

    expect(logger.error).toHaveBeenCalledWith('Error closing redis connection: Error: quit error');
  });

  it('should log error if Redis connection fails', async () => {
    (getRedisConnection as jest.Mock).mockReturnValue(undefined);

    const saveData = saveToRedis(logger);
    const result = await saveData('test-key', { test: 'data' });

    expect(logger.error).toHaveBeenCalledWith('Saving data with key:test-key process has been stopped');
    expect(result).toBe(false);
  });

  it('should log info if Redis connection closes successfully', async () => {
    const key = 'test-key';
    const data = { test: 'data' };
    (convertData as jest.Mock).mockReturnValue(JSON.stringify(data));
    mockRedisConnection.set.mockResolvedValue('OK');
    mockRedisConnection.quit.mockResolvedValue(true);

    const saveData = saveToRedis(logger);
    await saveData(key, data);

    expect(logger.info).toHaveBeenCalledWith('Redis Connection has been closed');
  });
});
