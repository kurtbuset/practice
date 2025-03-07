import "reflect-metadata";
import { DataSource } from "typeorm";
import { Employee } from "../entity/Employee";
import { Department } from "../entity/Department";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "1234",
  database: "employee_management",
  synchronize: true,
  logging: false,
  entities: [Employee, Department],
  migrations: [],
  subscribers: [],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
