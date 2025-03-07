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

employeeRouter.put("/employees/:id/salary", isAuthorized(['HR']), async (req: Request, res: Response) => {
  try {
    const employeeID = Number(req.params.id);
    const { salary } = req.body;

    if (isNaN(employeeID)) {
      return res.status(400).json({ msg: "Invalid Employee ID" });
    }

    if (typeof salary !== 'number' || salary <= 0) {
      return res.status(400).json({ msg: "Invalid salary amount" });
    }

    const employee = await AppDataSource.manager.findOneBy(Employee, {
      id: employeeID,
    });

    // Check if the employee exists
    if (!employee) {
      return res.status(404).json({ msg: `Employee with ID: ${employeeID} not found` });
    }


    employee.salary = salary;
    await AppDataSource.manager.save(employee);

    return res.status(200).json({ msg: "Employee salary updated successfully", employee });
  } catch (err) {
    console.error("Error updating employee salary:", err);
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
