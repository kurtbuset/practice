import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Employee } from "./Employee";
import { Project } from "./Project";

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(() => Employee, (employee) => employee.department)
  employees!: Employee[];

}
