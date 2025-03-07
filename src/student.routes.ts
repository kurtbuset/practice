import { AppDataSource } from "./_helpers/data-source";
import { Employee } from "./entity/Employee";
import Joi from "joi";

import express, { Request, Response } from "express";
const employeeRouter = express.Router(); 

employeeRouter.get("/employee/:id", async (req: Request, res: Response) => {
  try {
    const employeeID = Number(req.params.id);

    if (isNaN(employeeID)) {
      return res.status(400).json({ msg: "invalid employees id" });
    }

    const employee = await AppDataSource.manager.findOneBy(employeeID, {
      id: employeeID,
    });

    if (!employeeID) {
      return res.status(404).json({ msg: `employee id: ${employeeID} cant be found` });
    }

    return res.status(200).json({ msg: "employees found", employeeID });
  } catch (err) {
    console.error("Error fetching employee:", err);
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
