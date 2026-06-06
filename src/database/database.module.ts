import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

import { DatabaseService } from './database.service';
import { PG_POOL } from './tokens';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    DatabaseService,
    {
      provide: PG_POOL,
      useFactory: (configService: ConfigService) => {
        const sslEnabled = configService.get('DB_SSL') === 'true';

        return new Pool({
          host: configService.get('DB_HOST'),
          port: Number(configService.get('DB_PORT') ?? 5432),
          user: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME', 'postgres'),
          ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DatabaseService, PG_POOL],
})
export class DatabaseModule {}
