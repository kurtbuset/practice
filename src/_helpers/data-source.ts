import "reflect-metadata";
import { DataSource } from "typeorm";
import { Employee } from "../entity/Employee";
import { Department } from "../entity/Department";
import { Project } from "../entity/Project";
import { User } from "../entity/User";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "1234",
  database: "employee_management",
  synchronize: true,
  logging: false,
  entities: [Employee, Department, Project, User],
  migrations: [],
  subscribers: [],
});
