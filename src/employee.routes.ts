import { AppDataSource } from "./_helpers/data-source";
import { Employee } from "./entity/Employee";
import { Department } from "./entity/Department";
import Joi from "joi";

import express, { Request, Response } from "express";
const employeeRouter = express.Router();

// case 2
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


// case 1
employeeRouter.post("/api/employees", async (req: Request, res: Response) => {
  try{
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
  }
  catch(error){
    console.error("Error adding employee:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// case 3
employeeRouter.put('/api/employees/:id/salary', (req: Request, res: Response) => {
  try{
    
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

// case 5
employeeRouter.get('/api/employees/', async (req: Request, res: Response) => {
  try{

  }
  catch(error){
    
  }
})



const createSchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.string().required(),
  departmentId: Joi.number().required()
});

export default employeeRouter;
