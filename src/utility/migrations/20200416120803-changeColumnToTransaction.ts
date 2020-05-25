import { QueryInterface } from 'sequelize';
import { DataType } from 'sequelize-typescript';

/**
 * function that sequelize-cli runs if you want to add this migration to your database
 * */
export async function up(query: QueryInterface) {
  try {
    return [
      query.changeColumn('transactions','amount', DataType.DECIMAL(16,8)),
      query.changeColumn('transactions','actualAmount', DataType.DECIMAL(16,8)),
      query.changeColumn('transactions','fee', DataType.DECIMAL(16,8)),

      query.changeColumn('wallets','balance', DataType.DECIMAL(16,8)),
      query.changeColumn('wallets','pending', DataType.DECIMAL(16,8)),
    ]
  } catch (e) {
    return Promise.reject(e);
  }
}

/**
 * function that sequelize-cli runs if you want to remove this migration from your database
 * */
export async function down(query: QueryInterface) {
  try {
    return [
      query.changeColumn('transactions','amount', DataType.DECIMAL(8,2)),
      query.changeColumn('transactions','actualAmount', DataType.DECIMAL(8,2)),
      query.changeColumn('transactions','fee', DataType.DECIMAL(8,2)),

      query.changeColumn('wallets','balance', DataType.DECIMAL(8,2)),
      query.changeColumn('wallets','pending', DataType.DECIMAL(8,2)),
    ]
  } catch (e) {
    return Promise.reject(e);
  }
}