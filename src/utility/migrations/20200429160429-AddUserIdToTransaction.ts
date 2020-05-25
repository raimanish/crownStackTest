import { QueryInterface } from 'sequelize';
import { DataType } from 'sequelize-typescript';

/**
 * function that sequelize-cli runs if you want to add this migration to your database
 * */
export async function up(query: QueryInterface) {
  try {
    return [
        query.addColumn( 'transactions', 'userId', DataType.INTEGER )
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
        query.removeColumn( 'transactions', 'userId' )

    ];
  } catch (e) {
    return Promise.reject(e);
  }
}