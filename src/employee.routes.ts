import { AppDataSource } from "./_helpers/data-source";
import { Employee } from "./entity/Employee";
import { Department } from "./entity/Department";
import Joi from "joi";
import cron from "node-cron";
import { subMonths } from "date-fns";


import express, { Request, Response } from "express";

import { LessThan } from "typeorm";
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
employeeRouter.put('/api/employees/:id/salary', async (req: Request, res: Response) => {
  try {
    const EmployeeRepository = AppDataSource.getRepository(Employee);
    const EmployeeID = Number(req.params.id);

    if (isNaN(EmployeeID)) {
      return res.status(400).json({ msg: "Invalid Employee ID" });
    }

    const EmployeeToUpdate = await EmployeeRepository.findOneBy({
      id: EmployeeID,
    });

    if (!EmployeeToUpdate) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    // Validate input
    const { error, value } = updateSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((x) => x.message) });
    }

    // Update salary based on the request body
    const { salary } = req.body;
    EmployeeToUpdate.salary = salary;

    await EmployeeRepository.save(EmployeeToUpdate);

    return res
      .status(200)
      .json({ message: `Employee ${EmployeeID} salary updated successfully to ${salary}` });
  } catch (error) {
    console.error("Error updating employee:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

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
// Case 6
employeeRouter.post('/api/employees/:id/projects', async (req: Request, res: Response) => {
  try {
    const employeeRepo = AppDataSource.getRepository(Employee);
    const projectRepo = AppDataSource.getRepository(Project);

    const employeeId = Number(req.params.id);
    const { projectId } = req.body;

    if (isNaN(employeeId)) {
      return res.status(400).json({ error: "Invalid Employee ID" });
    }

 
    if (!projectId || isNaN(projectId)) {
      return res.status(400).json({ error: "Invalid Project ID" });
    }

    const employee = await employeeRepo.findOne({
      where: { id: employeeId },
      relations: ["projects"], // Load existing projects
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const project = await projectRepo.findOne({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (!employee.projects) {
      employee.projects = [];
    }
    employee.projects.push(project);

    await employeeRepo.save(employee);

    return res.status(200).json({
      message: `Employee ${employeeId} assigned to project ${projectId}`,
      employee,
    });
  } catch (error) {
    console.error("Error assigning employee to project:", error);
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
  }
})


// case 8
employeeRouter.put('/api/employees/:id/transfer', async (req: Request, res: Response) => {
  try{
    const employeeRepo = AppDataSource.getRepository(Employee)
    const departmentRepo = AppDataSource.getRepository(Department)
    
    const employee = await employeeRepo.findOneBy({
      id: Number(req.params.id)
    })

    if(!employee) return res.status(404).json({ message: "Employee not found" });

    const { departmentId } = req.body
    
    const departmentExist = await departmentRepo.findOneBy({
      id: departmentId
    })

    if(!departmentExist) return res.status(404).json({ message: "Department not found" });

    employee.department = departmentId

    await employeeRepo.save(employee)

    return res.status(200).json({msg: `Employee ${employee.id} updated successfully`, data: employee})
    
  }
  catch(error){
    console.error("Error updating employee:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
})

// case 10 (automatically deactivating employees every midnight)
cron.schedule("0 0 * * *", async () => {
  try {
    const employeeRepo = AppDataSource.getRepository(Employee);
      
    const sixMonthsAgo = subMonths(new Date(), 6);

    const employees = await employeeRepo.find({ 
      where: { hireDate: LessThan(sixMonthsAgo), isActive: true }
    });

    if (employees.length === 0) {
      console.log("No employees to deactivate.");
      return;
    }

    for (const employee of employees) {
      employee.isActive = false;
      await employeeRepo.save(employee);
    }
    
    console.log(`Deactivated ${employees.length} employees.`);
  } catch (error) {
    console.error("Error deactivating employees:", error);
  }
});


const createSchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.string().required(),
  departmentId: Joi.number().required()
});

const updateSchema = Joi.object({
  salary: Joi.number().required().positive().messages({
    'number.base': 'Salary must be a number',
    'number.positive': 'Salary must be a positive number',
    'any.required': 'Salary is required',
  }),
});

export default employeeRouter;
