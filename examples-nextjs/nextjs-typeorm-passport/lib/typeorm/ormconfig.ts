import config from 'config';
import { ConnectionOptions } from 'typeorm';
import { UserEntity } from './entitiy/user';

export const ormconfig: ConnectionOptions = {
  name: 'default',
  type: 'postgres',
  host: config.get('postgres.host'),
  port: config.get('postgres.port'),
  username: config.get('postgres.username'),
  password: config.get('postgres.password'),
  database: config.get('postgres.database'),
  schema: config.get('postgres.schema'),
  synchronize: config.get('postgres.synchronize'),
  entities: [
    UserEntity,
  ],
  migrations: [
    'lib/typeorm/migration/**/*.ts',
  ],
  subscribers: [
    'lib/typeorm/subscriber/**/*.ts',
  ],
  cli: {
    entitiesDir: 'lib/typeorm/entity',
    migrationsDir: 'lib/typeorm/migration',
    subscribersDir: 'lib/typeorm/subscriber',
  },
};

export default ormconfig;
