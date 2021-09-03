import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryColumn,
    PrimaryGeneratedColumn,
  } from "typeorm";
  
  
  
  @Entity("return_order")
  export default class ReturnOrder {

    @PrimaryGeneratedColumn("uuid")
    id: string
  
    @Column()
    order_id: string;
  
    @Column()
    return_approval_date : Date;
  
    @Column()
    return_requested_date: Date;
  
    @Column()
    return_id : string;
  
    @Column()
    tracking_id : string;
  
    @Column()
    product : string;
  
    @Column()
    return_type : string;
  
    @Column({
      nullable: true
    })
    return_sub_type : string;
    
    @Column({
      nullable: true
    })
    replacement_order_item_id : string;
  
    @Column()
    return_status : string;
  
    @Column()
    return_delivery_promise_date : Date;
    
    @Column({
      nullable: true
    })
    picked_up_date : Date;
  
    @Column({
      nullable: true
    })
    out_for_delivery_date : Date;
  
    @Column({
      nullable: true
    })
    completed_date : Date;
  
    @Column()
    total_price : number;
  
    @Column()
    return_reason : string;
  
    @Column() 
    return_sub_reason : string;
  
    @CreateDateColumn({
      type: "timestamp",
    })
    created_at: Date;
  
    @UpdateDateColumn({
      type: "timestamp",
    })
    updated_at: Date;
  }
  