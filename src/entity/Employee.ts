import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { Department } from "./Department";
import { Project } from "./Project";

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

  @ManyToMany(() => Project, (project) => project.employees, { cascade: true })
  @JoinTable()  // This creates a junction table automatically
  projects: Project[] | undefined;

}
