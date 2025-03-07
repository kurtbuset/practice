import { AppDataSource } from "./_helpers/data-source";
import { Employee } from "./entity/Employee";
import Joi from "joi";

import express, { Request, Response } from "express";
const employeeRouter = express.Router(); 

employeeRouter.get("/api/employees/:id/tenure", async (req: Request, res: Response) => {
  try {
    const employeeID = Number(req.params.id);

   
    if (isNaN(employeeID)) {
      return res.status(400).json({ msg: "Invalid employee ID" });
    }

   
    const employee = await AppDataSource.manager.findOne(Employee, {
      where: { id: employeeID },
    });

   
    if (!employee) {
      return res.status(404).json({ msg: `Employee with ID: ${employeeID} not found` });
    }

  
    const hireDate = new Date(employee.hireDate);
    const currentDate = new Date();
    const tenureInMilliseconds = currentDate.getTime() - hireDate.getTime();
    const tenureInYears = Math.floor(tenureInMilliseconds / (1000 * 60 * 60 * 24 * 365));

 
    return res.status(200).json({
      msg: "Employee tenure calculated successfully",
      employeeID: employeeID,
      tenureInYears: tenureInYears,
    });
  } catch (err) {
    console.error("Error fetching employee tenure:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});


employeeRouter.post('/api/employees', (req: Request, res: Response) => {
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
