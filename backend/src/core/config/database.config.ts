import { TypeOrmModuleOptions, TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config';

export const databaseConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.database,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false, // Never use TRUE in production!
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    // cli: {
    //     migrationsDir: 'src/database/migrations',
    // },
};

export const DatabaseModule = TypeOrmModule.forRoot(databaseConfig);
