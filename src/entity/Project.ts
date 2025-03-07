import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn } from "typeorm";
import { Employee } from "./Employee";

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ nullable: true })
    description?: string;

    @CreateDateColumn()
    startDate!: Date;

    @Column({ nullable: true })
    endDate?: Date;

    @ManyToMany(() => Employee, employee => employee.projects)
    employees!: Employee[];
}