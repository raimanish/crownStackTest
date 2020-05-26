import { Sequelize } from "sequelize-typescript";
import * as env from "../system";
import { User } from "./models/user.model";
import { RoleUser } from "./models/roleUser.model";
import { Role } from "./models/role.model";
import { BootstrapDb } from "../helpers/BootstrapDb.helper";
import { Product } from "./models/product.model";
import { Order } from "./models/order.model";
import { LineItem } from "./models/lineItem.model";

export default class SequlizeConnection {
  public static sequelize: any;
  public static host: string = "localhost";
  public static dialect: any = "postgres";
  public static maxPool: any = 10;
  public static minPool: any = 1;

  public static createConnection() {
    this.sequelize = new Sequelize({
      database: env.Environment.database,
      username: env.Environment.seqUname,
      password: env.Environment.seqPass,
      host: this.host,
      dialect: this.dialect,
      logging: false,
      pool: {
        max: this.maxPool,
        min: this.minPool,
        acquire: 30000,
        idle: 10000
      },
      models: [
        User,
        RoleUser,
        Role,
        Product,
        Order,
        LineItem
      ]
    });

    //{force:true} (Do not commit this, use locally only)
    SequlizeConnection.sequelize.sync({  }).then(async res => {
      console.log("Sequelize is now Ready");
      await BootstrapDb.insertRole();
      await BootstrapDb.CreateAdmin();
    });
  }
}
