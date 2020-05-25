import { Table, Column, Model, DataType, AutoIncrement, PrimaryKey,Default} from 'sequelize-typescript';

@Table({ modelName: 'product' })
export class Product extends Model<Product> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  productId: number;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  description: string;

  @Column(DataType.INTEGER)
  make: number;

  @Column(DataType.DECIMAL(10, 2))  
  price: number;

  @Default(true)
  @Column(DataType.BOOLEAN)
  active: boolean;
}