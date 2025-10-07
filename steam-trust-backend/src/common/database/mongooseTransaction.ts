import { ClientSession, Connection } from 'mongoose';

type WithTransactionCallback<T> = (session: ClientSession) => Promise<T>;

export const mongooseTransaction = async <T>(
  connection: Connection,
  callback: WithTransactionCallback<T>,
): Promise<T> => {
  let result: T | undefined;

  await connection.transaction(async (session) => {
    result = await callback(session);
  });

  return result as T;
};
