import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToOne, ManyToMany, JoinTable } from "typeorm";
import { Department } from "./department.model";
import { User } from "./user.model";
import { Project } from "./project.model";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  position!: string;

  @Column({ nullable: true })
  salary?: number;

  @ManyToOne(() => Department)
  department!: Department;

  @Column({ default: true })  
  isActive!: boolean;

  @CreateDateColumn()
  hireDate!: Date;

  @OneToOne(() => User, (user) => user.employee)
  user!: User;

  @ManyToMany(() => Project, (project) => project.employees, { cascade: true })
  @JoinTable()
  projects!: Project[];
}
