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


employeeRouter.post("/api/employees", async (req: Request, res: Response) => {
  const { error, value } = createSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res
      .status(400)
      .json({ error: error.details.map((x) => x.message) });
  }

  const employeeRepo = AppDataSource.getRepository(Employee);
  const departmentRepo = AppDataSource.getRepository(Department);

  const { name, position, departmentId } = value;
  const department = await departmentRepo.findOne({ where: { id: departmentId } });
  if (!department) return res.status(404).json({ message: "Department not found" });

  const newEmployee = employeeRepo.create({ name, position, department });
  await employeeRepo.save(newEmployee);
  res.status(201).json(newEmployee);
});


const createSchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.string().required(),
  department: Joi.number().required()
});

export default employeeRouter;
