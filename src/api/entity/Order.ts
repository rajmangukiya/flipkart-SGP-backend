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
  order_on: string;

  @Column()
  status: string;

  @Column()
  amount: string;

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
