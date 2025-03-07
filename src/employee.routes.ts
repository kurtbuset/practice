import { AppDataSource } from "./_helpers/data-source";
import { Employee } from "./entity/Employee";
import { Department } from "./entity/Department";
import Joi from "joi";

import express, { Request, Response } from "express";
const employeeRouter = express.Router();


employeeRouter.get("/api/employees", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10; 
    const skip = (page - 1) * limit;

    const [employees, total] = await AppDataSource.getRepository(Employee).findAndCount({
      relations: ["department"],
      take: limit,
      skip: skip
    });

    if (employees.length === 0) {
      return res.status(404).json({ message: "No Employees found" });
    }

    return res.status(200).json({
      employees,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

employeeRouter.get("/employees/search", async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.name as string;

 
    if (!searchTerm || typeof searchTerm !== 'string') {
      return res.status(400).json({ msg: "Invalid search term" });
    }

    const employees = await AppDataSource.manager.find(Employee, {
      where: {
        name: (`%${searchTerm}%`), //
      },
    });

    if (employees.length === 0) {
      return res.status(404).json({ msg: `No employees found with name containing: ${searchTerm}` });
    }

    return res.status(200).json({ msg: "Employees found", employees });
  } catch (err) {
    console.error("Error searching employees:", err);
    return res.status(500).json({ msg: "Internal server error" });
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
  departmentId: Joi.number().required()
});

export default employeeRouter;
