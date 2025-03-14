import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne } from "typeorm";
import { Employee } from "./Employee";
import { Department } from "./Department";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => Department)
    department!: Department;

  @ManyToMany(() => Employee, (employee) => employee.projects)
  employees: Employee[] | undefined;
}
