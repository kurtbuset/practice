import { AppDataSource } from "./_helpers/data-source";
import { Employee } from "./entity/Employee";
import { Department } from "./entity/Department";
import Joi from "joi";

import express, { Request, Response } from "express";
<<<<<<< refs/remotes/origin/gonzales
=======
import { LessThan, Like } from "typeorm";
>>>>>>> local
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
        name:  (`%${searchTerm}%`), //
      },
    });

    if (employees.length === 0) {
      return res.status(404).json({ msg: `No employees found with name containing: ${searchTerm}` });
    }

<<<<<<< refs/remotes/origin/gonzales
    return res.status(200).json({ msg: "Employees found", employees });
  } catch (err) {
    console.error("Error searching employees:", err);
    return res.status(500).json({ msg: "Internal server error" });
=======
    // Update salary to 90000
    EmployeeToUpdate.salary = 90000;

    await EmployeeRepository.save(EmployeeToUpdate);

    return res
    .status(200)
    .json({ message: `Employee ${EmployeeID} salary updated successfully to 90000` });
  }
  catch(error){
    console.error("Error updating employee:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
})

// case 4
employeeRouter.delete('/api/employees/:id', async (req: Request, res: Response) => {
  try{
    const { id } = req.params
    const employeeRepo = AppDataSource.getRepository(Employee)

    const employee = await employeeRepo.findOneBy({
      id: Number(id)
    })  

    if(!employee) return res.status(404).json({ message: "Employee not found" });

    employee.isActive = false

    await employeeRepo.save(employee)
    
    return res.status(201).json({ msg: `employee ${employee} set to false`, employee});
  }
  catch(error){
    console.error("Error updating employee:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
})

// Case 5: 
employeeRouter.get("/api/employees/search", async (req: Request, res: Response) => {
  try {
    const { name } = req.query;

    
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Search term (name) is required and must be a string." });
    }

    const employeeRepo = AppDataSource.getRepository(Employee);

   
    const employees = await employeeRepo.find({
      where: { name: Like(`%${name}%`) },
      relations: ["department"],
    });

    if (employees.length === 0) {
      return res.status(404).json({ message: "No employees found matching the search term." });
    }

    return res.status(200).json({ employees });
  } catch (error) {
    console.error("Error searching employees:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// case 7
employeeRouter.get('/api/employees/:id/tenure', async (req: Request, res: Response) => {
  try{
    const employeeRepo = AppDataSource.getRepository(Employee)
    const employee = await employeeRepo.findOneBy({
      id: Number(req.params.id)
    })

    if(!employee) return res.status(404).json({ message: "Employee not found" });

    const hireDate = new Date(employee.hireDate);
    const currentDate = new Date();
    const yearsOfService = currentDate.getFullYear() - hireDate.getFullYear();

    // const hoursOfService = Math.floor((currentDate.getTime() - hireDate.getTime()) / (1000 * 60 * 60));

    return res.json({employeeId: employee.id, name: employee.name, yearsOfService: yearsOfService})
  }
  catch(error){
    console.error("Error updating employee:", error);
    return res.status(500).json({ error: "Internal server error" });
>>>>>>> local
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
