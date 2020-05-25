import { QueryInterface } from 'sequelize';
import { DataType } from 'sequelize-typescript';

/**
 * function that sequelize-cli runs if you want to add this migration to your database
 * */
export async function up(query: QueryInterface) {
  try {
    return [
        query.addColumn( 'wallets', 'lockedEuro', DataType.DECIMAL(10,2) ),
        query.addColumn( 'transactions', 'txId', DataType.STRING )

    ];
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
        query.removeColumn( 'wallets', 'lockedEuro' ),
        query.removeColumn( 'transactions', 'txId' )

    ];
  } catch (e) {
    return Promise.reject(e);
  }
}