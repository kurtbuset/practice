import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Employee } from "./employee.model";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  title!: string;

  @Column()
  email!: string;

  @Column()
  role!: string;

  @Column()
  hashedPassword!: string;

  @OneToOne(() => Employee, { cascade: true })
  @JoinColumn({ name: "employee_id" }) // Customizes the foreign key column name
  employee!: Employee;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
