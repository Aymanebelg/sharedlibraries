### Redis Client

The RedisClient package provides utility functions for interacting with a Redis database.

#### Environment Variables

To use the RedisClient package with SSL/TLS connections, you need to set the following environment variables with the actual certificate values:

- `REDIS_SERVER_PORT`: The port on which the Redis server is running.
- `REDIS_SERVER_HOST`: The host address of the Redis server.
- `REDIS_SERVER_PASSWORD`: The password for authenticating with the Redis server.
- `REDIS_CA_CERTIFICATE`: The CA certificate for secure connections.
- `REDIS_CLIENT_CERTIFICATE`: The client certificate for secure connections.
- `REDIS_CLIENT_PRIVATE_KEY`: The client private key for secure connections.
- `REDIS_CLIENT_PASSPHRASE`: The passphrase for the client private key (if applicable).

Here is an example of how you can set these environment variables:

```sh
REDIS_SERVER_PORT=6379
REDIS_SERVER_HOST=yourHost
REDIS_SERVER_PASSWORD=your_password_here
REDIS_CA_CERTIFICATE="-----BEGIN CERTIFICATE-----
Your_CA_certificate_here
-----END CERTIFICATE-----"
REDIS_CLIENT_CERTIFICATE="-----BEGIN CERTIFICATE-----
Your_client_certificate_here
-----END CERTIFICATE-----"
REDIS_CLIENT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
Your_private_key_here
-----END PRIVATE KEY-----"
REDIS_CLIENT_PASSPHRASE=your_passphrase_here
```

#### Installation

To install the RedisClient package, use npm:

```sh
npm install dev.linkopus.redis-client
```

#### Usage

Import the package and create an instance of the RedisClient by passing a logger object:
```typescript
import getRedisClient from 'dev.linkopus.redis-client';
import { createLogger } from 'dev.linkopus.logger'; // Ensure to import Logger
const logger = createLogger(module)


// Use the logger to create an instance of the RedisClient
const redisClient = getRedisClient(logger)
```

#### Functions

**get(key: string) => Promise<any>:**
Retrieves data from Redis using the specified key.
- **Parameters:**
    - `key`: The key used to retrieve data from Redis.
- **Returns:** A Promise that resolves to the retrieved data or `undefined` if the key is not found.

**save(key: string, data: any) => Promise<boolean>:**
Saves data to Redis using the specified key.
- **Parameters:**
    - `key`: The key used to store the data in Redis.
    - `data`: The data to be stored in Redis.
- **Returns:** A Promise that resolves to `true` if the data was saved successfully, `false` otherwise.

**remove(key: string) => Promise<boolean>:**
Deletes data from Redis using the specified key.
- **Parameters:**
    - `key`: The key used to delete data from Redis.
- **Returns:** A Promise that resolves to `true` if the data was deleted successfully, `false` otherwise.

#### Example Usage

```typescript
import getRedisClient from 'dev.linkopus.redis-client';
import { createLogger } from 'dev.linkopus.logger'; // Ensure to import Logger
const logger = createLogger(module)

// Create an instance of the RedisClient
const redisClient = getRedisClient(logger)

// Example usage of get
(async () => {
    const key = 'myKey';
    const data = await redisClient.get(key);
    console.log('Retrieved data:', data);
})();

// Example usage of save
(async () => {
    const key = 'myKey';
    const data = { example: 'data' };
    const saved = await redisClient.save(key, data);
    console.log('Data saved:', saved);
})();

// Example usage of remove
(async () => {
    const key = 'myKey';
    const deleted = await redisClient.remove(key);
    console.log('Data deleted:', deleted);
})();
```