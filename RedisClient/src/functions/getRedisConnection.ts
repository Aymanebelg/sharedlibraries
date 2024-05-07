import Redis from 'ioredis';
import config from '../config/config'

const getRedisConnection = (logger: any): Redis | undefined  => {
  try{
    logger.info(`Connecting to redis server...`)
    return new Redis({
      port: config.redisPort,
      host: config.redisHost,
      password: config.redisServerPassword,
      tls: {
        checkServerIdentity: () => undefined, 
        rejectUnauthorized: true, 
        ca: config.caCertifacate, 
        cert: config.clientCertificate, 
        key: config.clientPrivateKey, 
        passphrase: config.passphrase 
      }
    })
  }catch(error){  
    logger.error(`Error connecting to redis server: ${error}`)
    return
  }
}

export default getRedisConnection;