import dotenv from 'dotenv'
import findConfig from 'find-config'

const envPath = findConfig('.env')
dotenv.config({ path: envPath ?? undefined })

interface Config {
    redisPort: number
    redisHost: string
    redisCaCertifacate: string
    redisClientCertificate: string
    redisClientPrivateKey: string
    redisClientPassphrase: string
    redisServerPassword: string

    rabbitMqCaCert: string
    rabbitMqUrl: string
    rabbitMqClientCert: string
    rabbitMqClientKey: string
    rabbitMqPassphrase: string
}

const config: Config = {
    redisCaCertifacate: process.env.REDIS_CA_CERTIFICATE ?? '',
    redisClientCertificate: process.env.REDIS_CLIENT_CERTIFICATE ?? '',
    redisClientPrivateKey: process.env.REDIS_CLIENT_PRIVATE_KEY ?? '',
    redisClientPassphrase: process.env.REDIS_CLIENT_PASSPHRASE ?? '',
    redisPort: parseInt(process.env.REDIS_SERVER_PORT ?? '3000'),
    redisHost: process.env.REDIS_SERVER_HOST ?? '',
    redisServerPassword: process.env.REDIS_SERVER_PASSWORD ?? '',

    rabbitMqCaCert: process.env.RABBITMQ_CA_CERTIFICATE ?? '',
    rabbitMqUrl: process.env.RABBITMQ_URL ?? 'amqps://localhost:5671',
    rabbitMqClientCert: process.env.RABBITMQ_CLIENT_CERTIFICATE ?? '',
    rabbitMqClientKey:  process.env.RABBITMQ_CLIENT_PRIVATE_KEY ?? '',
    rabbitMqPassphrase:  process.env.RABBITMQ_CERT_PASSWORD ?? '',
}

export default config;