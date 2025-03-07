import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { Department } from "./Department";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  position!: string;

  @Column({ nullable: true })
  salary!: number;

  @ManyToOne(() => Department)
  department!: Department;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  hireDate!: Date;
}
