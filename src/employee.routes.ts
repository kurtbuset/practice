import { AppDataSource } from "./_helpers/data-source";
import { Employee } from "./entity/Employee";
import { Department } from "./entity/Department";
import Joi from "joi";

import express, { Request, Response } from "express";
const employeeRouter = express.Router();


employeeRouter.get("/api/employees", async (req: Request, res: Response) => {
  try {
    const employees = await AppDataSource.getRepository(Employee).find({
      relations: ["department"],
    });

    if (employees.length === 0) {
      return res.status(404).json({ message: "No Employees found" });
    }

    return res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


export default employeeRouter;
