interface RedisClient {
    get: (key: string) => Promise<string>;
    save: (key: string, data: any) => Promise<boolean>;
    remove: (key: string) => Promise<boolean>;
}

export default RedisClient