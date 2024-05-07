import * as dotenv from 'dotenv'
import * as findConfig from 'find-config'

const envPath = findConfig('.env')
dotenv.config({ path: envPath ?? undefined })

interface Config {
    redisPort: number
    redisHost: string
    caCertifacate: string
    clientCertificate: string
    clientPrivateKey: string
    passphrase: string
    redisServerPassword: string
}

const config: Config = {
    caCertifacate: process.env.REDIS_CA_CERTIFICATE ?? '',
    clientCertificate: process.env.REDIS_CLIENT_CERTIFICATE ?? '',
    clientPrivateKey: process.env.REDIS_CLIENT_PRIVATE_KEY ?? '',
    passphrase: process.env.REDIS_CLIENT_PASSPHRASE ?? '',
    redisPort: parseInt(process.env.REDIS_SERVER_PORT ?? '3000'),
    redisHost: process.env.REDIS_SERVER_HOST ?? '',
    redisServerPassword: process.env.REDIS_SERVER_PASSWORD ?? ''
}

export default config;