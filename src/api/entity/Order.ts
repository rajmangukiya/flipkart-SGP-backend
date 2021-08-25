import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";



@Entity("order")
export default class Order {

  @PrimaryColumn()
  order_id: string;

  @Column()
  shipment_id : string;

  @Column()
  order_on: Date;

  @Column()
  hsn_code : string;

  @Column()
  order_state : string;

  @Column()
  product : string;

  @Column()
  invoice_no : string;

  @Column()
  invoice_date : Date;
  
  @Column()
  invoice_amount: number;

  @Column()
  selling_price: number;

  @Column()
  shipping_charge: number;

  @Column()
  tracking_id: string;

  @CreateDateColumn({
    type: "timestamp",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
  })
  updated_at: Date;
}
