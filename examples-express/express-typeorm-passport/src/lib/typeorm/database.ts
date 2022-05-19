import { Connection, createConnection, getConnectionManager } from 'typeorm';
import ormconfig from './ormconfig';

export const connect = async (): Promise<Connection> => {
  if (!getConnectionManager().has(ormconfig.name!)) {
    // create new databse connection
    return await createConnection(ormconfig);
  } else {
    // use existing database connection
    return getConnectionManager().get(ormconfig.name);
  }
};

export const close = async (): Promise<void> => {
  if (getConnectionManager().has(ormconfig.name!)) {
    // close database connection
    await getConnectionManager().get(ormconfig.name).close();
  }
};
