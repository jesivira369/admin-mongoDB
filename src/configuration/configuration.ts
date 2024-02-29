import { registerAs } from "@nestjs/config";

  export default registerAs('mongo', () => ({
    host: process.env.HOST_MONGODB || 'localhost',
      port: process.env.PORT_MONGODB || 27018,
      user: process.env.USER_MONGODB || 'jesus',
      password: process.env.PASSWORD_MONGODB || '12345',
      database: process.env.DATABASE_MONGODB || 'users',
  }));