import { AppDataSource } from "./_helpers/data-source";
import { Employee } from "./entity/Employee";
import Joi from "joi";

import express, { Request, Response } from "express";
import { EmployeeService } from "./service/EmployeeService";
import { Project } from "./entity/Project";
const employeeRouter = express.Router();

employeeRouter.post('/api/employees', async (req: Request, res: Response) => {
  try{
    const { error, value } = createSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((x) => x.message) });
    }
    
    const { name, position, department } = value;

    const employeeRepository = AppDataSource.getRepository(Employee);
    const newEmployee = employeeRepository.create({
      name,
      position,
      department
    });

    await employeeRepository.save(newEmployee);

    const projectRepository = AppDataSource.getRepository(Project);
    const employeeService = new EmployeeService(employeeRepository, projectRepository);
    await employeeService.assignProjectToEmployee(1, 1); // employeeId, projectId

    res
      .status(201)
      .json({ message: "Employee added sucessfully", Employee: newEmployee });
  }
  catch(error){
    console.error("Error adding student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
})

const createSchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.string().required(),
  departmentId: Joi.number().required(),
});


export default employeeRouter;
