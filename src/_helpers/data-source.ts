import "reflect-metadata";
import { DataSource } from "typeorm";
import { Student } from "../entity/Student";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "password",
  database: "grading-sys-typeorm-simple-crud",
  synchronize: true,
  logging: false,
  entities: [Student],
  migrations: [],
  subscribers: [],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err)
  });
