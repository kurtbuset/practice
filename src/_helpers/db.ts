import { DataSource } from "typeorm";
import { Employee } from "../models/employee.model";
import { Department } from "../models/department.model";
import { User } from "../models/user.model";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root", 
  password: "password",
  database: "employee_user_management",
  entities: [Employee, Department, User],
  logging: true,
  synchronize: true,
});

AppDataSource.initialize()
  .then((_) => {
    console.log("data source has been initialized.");
  })  
  .catch((Error) => {
    console.log(`Error: ${Error}`);
  });
