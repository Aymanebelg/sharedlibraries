import getRedisConnection from '../../src/functions/getRedisConnection';
import { deleteFromRedis } from '../../src/remove/remove';

jest.mock('../../src/functions/getRedisConnection');

describe('deleteFromRedis', () => {
  let logger: any;
  let mockRedisConnection: any;

  beforeEach(() => {
    logger = {
      info: jest.fn(),
      error: jest.fn(),
    };
    mockRedisConnection = {
      del: jest.fn(),
      quit: jest.fn(),
    };
    (getRedisConnection as jest.Mock).mockReturnValue(mockRedisConnection);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should log info and return true when key is successfully deleted', async () => {
    mockRedisConnection.del.mockResolvedValue(1);
    mockRedisConnection.quit.mockResolvedValue(true);

    const deleteKey = deleteFromRedis(logger);
    const result = await deleteKey('test-key');

    expect(logger.info).toHaveBeenCalledWith('Deleting data with key:test-key from redis...');
    expect(logger.info).toHaveBeenCalledWith('Data with key:test-key has been deleted successfully');
    expect(result).toBe(true);
  });

  it('should log error and return false when key is not found', async () => {
    mockRedisConnection.del.mockResolvedValue(0);
    mockRedisConnection.quit.mockResolvedValue(true);

    const deleteKey = deleteFromRedis(logger);
    const result = await deleteKey('non-existent-key');

    expect(logger.info).toHaveBeenCalledWith('Deleting data with key:non-existent-key from redis...');
    expect(logger.error).toHaveBeenCalledWith('Key: non-existent-key not found.');
    expect(result).toBe(false);
  });

  it('should log error and return false when Redis connection fails', async () => {
    (getRedisConnection as jest.Mock).mockReturnValue(undefined);

    const deleteKey = deleteFromRedis(logger);
    const result = await deleteKey('test-key');

    expect(logger.error).toHaveBeenCalledWith('Failed to get Redis connection');
    expect(result).toBe(false);
  });

  it('should log error and return false when delete operation throws an error', async () => {
    mockRedisConnection.del.mockRejectedValue(new Error('delete error'));
    mockRedisConnection.quit.mockResolvedValue(true);

    const deleteKey = deleteFromRedis(logger);
    const result = await deleteKey('test-key');

    expect(logger.error).toHaveBeenCalledWith('Error deleting key: Error: delete error');
    expect(result).toBe(false);
  });

  it('should log error if Redis connection fails to close', async () => {
    mockRedisConnection.del.mockResolvedValue(1);
    mockRedisConnection.quit.mockRejectedValue(new Error('quit error'));

    const deleteKey = deleteFromRedis(logger);
    await deleteKey('test-key');

    expect(logger.error).toHaveBeenCalledWith('Error closing redis connection: Error: quit error');
  });

  it('should log info if Redis connection closes successfully', async () => {
    mockRedisConnection.del.mockResolvedValue(1);
    mockRedisConnection.quit.mockResolvedValue(true);

    const deleteKey = deleteFromRedis(logger);
    await deleteKey('test-key');

    expect(logger.info).toHaveBeenCalledWith('Redis Connection has been closed');
  });
});
