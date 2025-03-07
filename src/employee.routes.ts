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


// Update Carl
employeeRouter.put("/employees/:id/salary", async (req: Request, res: Response) => {
  try {
    const EmployeeRepository = AppDataSource.getRepository(Employee);
    const employeeID = Number(req.params.id);

    // Validate Employee ID
    if (isNaN(employeeID)) {
      return res.status(400).json({ msg: "Invalid Employee ID" });
    }

    // Check if the user is authorized (e.g., HR)
    const userRole = req.user.role; // Assuming you have middleware that attaches the user to the request
    if (userRole !== "HR") {
      return res.status(403).json({ msg: "Unauthorized: Only HR can update salaries" });
    }

    // Find the employee to update
    const employeeToUpdate = await EmployeeRepository.findOneBy({
      id: employeeID,
    });

    if (!employeeToUpdate) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    // Validate input (salary) - REQUEST BODY IS USED HERE
    const { error, value } = updateSalarySchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((x) => x.message) });
    }

    // Extract salary from the validated request body
    const { salary } = value;

    // Update only the salary field
    employeeToUpdate.salary = salary;

    // Save the updated employee
    await EmployeeRepository.save(employeeToUpdate);

    return res
      .status(200)
      .json({ message: `Employee ${employeeID}'s salary updated successfully` });
  } catch (err) {
    console.error("Error updating employee salary:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Use Case 8: Transfer Employee to Another Department
employeeRouter.put("/employees/:id/transfer", async (req: Request, res: Response) => {
  try {
    const EmployeeRepository = AppDataSource.getRepository(Employee);
    const DepartmentRepository = AppDataSource.getRepository(Department);
    const employeeID = Number(req.params.id);

    // Validate Employee ID
    if (isNaN(employeeID)) {
      return res.status(400).json({ msg: "Invalid Employee ID" });
    }

    // Check if the user is authorized (e.g., HR or Admin)
    const userRole = req.user.role; // Assuming you have middleware that attaches the user to the request
    if (userRole !== "HR" && userRole !== "Admin") {
      return res.status(403).json({ msg: "Unauthorized: Only HR or Admin can transfer employees" });
    }

    // Find the employee to update
    const employeeToTransfer = await EmployeeRepository.findOneBy({
      id: employeeID,
    });

    if (!employeeToTransfer) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    // Validate input (departmentId) - REQUEST BODY IS USED HERE
    const { error, value } = transferSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((x) => x.message) });
    }

    // Extract departmentId from the validated request body
    const { departmentId } = value;

    // Validate that the new department exists
    const department = await DepartmentRepository.findOneBy({
      id: departmentId,
    });

    if (!department) {
      return res.status(404).json({ msg: "Department not found" });
    }

    // Update the employee's department
    employeeToTransfer.departmentId = departmentId;
    await EmployeeRepository.save(employeeToTransfer);

    return res
      .status(200)
      .json({ message: `Employee ${employeeID} transferred to department ${departmentId} successfully` });
  } catch (err) {
    console.error("Error transferring employee:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const createSchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.string().required(),
  departmentId: Joi.number().required()
});

const updateSalarySchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.string().required(),
  department:Joi.number().required(),
  salary: Joi.number().required(),
});

const transferSchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.string().required(),
  department:Joi.number().required(),
  departmentId: Joi.number().positive().required()});

export default employeeRouter;
