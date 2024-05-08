import mongoose from "mongoose";
import * as amqp from 'amqplib';
import config from '../config/config';
import Redis from "ioredis";

class SupervisionService {
    async rabbitMqConnectivity(): Promise<boolean> {
        try {
            const conn = await amqp.connect(config.rabbitMqUrl,  {
                cert: config.rabbitMqClientCert,
                key: config.rabbitMqClientKey,
                passphrase: config.rabbitMqPassphrase,
                ca: [config.rabbitMqCaCert],
                checkServerIdentity: () => undefined,
              });
            await conn.close();
            return true;
        } catch (error) {
            return false;
        }
    }

    async mongoDbConnectivity(): Promise<boolean> {
        const state = mongoose.connection.readyState;
        return state === 1
    }

    async redisConnectivity(): Promise<boolean> {
       
        const connection = new Redis({
            port: config.redisPort,
            host: config.redisHost,
            password: config.redisServerPassword,
            tls: {
              checkServerIdentity: () => undefined, 
              rejectUnauthorized: true, 
              ca: config.redisCaCertifacate, 
              cert: config.redisClientCertificate, 
              key: config.redisClientPrivateKey, 
              passphrase: config.redisClientPassphrase 
            }
        })
        
        try{
            await connection.ping()
            return true
        }catch(error){ 
            return false
        }finally{
            await connection.quit()
        }
    }
}

export default new SupervisionService()