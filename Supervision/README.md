# Supervision Package

The Supervision package provides controllers for server health checks, connectivity checks, and log file retrieval.

## Environment Variables

To use the Supervision package, you need to set the following environment variables:

- **For Redis:**
    - `REDIS_CA_CERTIFICATE`
    - `REDIS_CLIENT_CERTIFICATE`
    - `REDIS_CLIENT_PRIVATE_KEY`
    - `REDIS_CLIENT_PASSPHRASE`
    - `REDIS_SERVER_PORT`
    - `REDIS_SERVER_HOST`
    - `REDIS_SERVER_PASSWORD`

- **For RabbitMQ:**
    - `RABBITMQ_CA_CERTIFICATE`
    - `RABBITMQ_URL`
    - `RABBITMQ_CLIENT_CERTIFICATE`
    - `RABBITMQ_CLIENT_PRIVATE_KEY`
    - `RABBITMQ_CERT_PASSWORD`


## Installation

To install the Supervision package, use npm:

```sh
npm install dev.linkopus.supervision
```
## Usage

Import the package and create an instance of the SupervisionController by passing a logger object:

```typescript
import GetSupervisionController from 'dev.linkopus.supervision';
import { createLogger } from 'dev.linkopus.logger'; // Ensure to import Logger
const logger = createLogger(module)

// Use the logger to create an instance of the SupervisionController
const SupervisionController = GetSupervisionController(logger)
```

## Controllers

### Health Check Controller

```typescript
healthCheckController(req: Request, res: Response, nextFunction: NextFunction): void
```
Checks the server's health and responds with a status message.

### Connectivity Check Controller

```typescript
connectivityCheckController(checks: ConnectivityChecks)(req: Request, res: Response, nextFunction: NextFunction): void
```
Performs connectivity checks for MongoDB, RabbitMQ, and Redis based on the provided checks object and responds with the results.

### Get Log File Controller

```typescript
getLogFileController(req: Request, res: Response, nextFunction: NextFunction): void
```
Retrieves the log file for a specific date.

## Example Usage

```typescript
import { Router } from 'express'
import { handleAsync } from 'dev.linkopus.commonmessages'
import GetSupervisionController, { type ConnectivityChecks } from 'dev.linkopus.supervision'
import createLogger from 'dev.linkopus.logger'

const logger = createLogger(module)
const SupervisionController = GetSupervisionController(logger)
const router = Router()

router.get('/healthcheck', SupervisionController.healthCheck)

// Specify your connection checks, Only the specified connection checks are going to be checked by the controller
const connectionsToChecks: ConnectivityChecks = { mongoDb: true, rabbitMq: true, redis: false } 
// this example checked only for rabbitMq and MongoDB connections because redis check is false

router.get('/connectivity', handleAsync(SupervisionController.getConnectivityCheck(connectionsToChecks)))

router.get('/logs/:date', handleAsync(SupervisionController.getLogFileByDate))

export default router
```

