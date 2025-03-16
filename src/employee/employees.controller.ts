import { EmployeeService } from "./employee.services";
import express, { Request, Response } from "express";
const employeeRouter = express.Router();
const employeeService = new EmployeeService();
import Joi = require("joi");

employeeRouter.get("", getEmployees);
employeeRouter.post("", createEmployee);
employeeRouter.delete("/:id", deleteEmployee);

employeeRouter.get("/:id/tenure", getTenure);
employeeRouter.put("/:id/transfer", transferEmployee)
employeeRouter.post("/:id/salary", updateEmployeeSalary)
employeeRouter.get('/search', getEmployeeByName)

export default employeeRouter;  

// case 1
function getEmployees(req: Request, res: Response) {
  employeeService
    .getEmployees()
    .then((employees) => {
      return res.status(200).json({ employees });
    })
    .catch((err: any) => {
      res.status(400).json({ msg: err?.message || "unexpected error occured" });
    }); 
}

// case 2
function createEmployee(req: Request, res: Response) {
  const { name, position, departmentId, hireDate } = req.body;

  employeeService
    .createEmployee(
      name,
      position,
      Number(departmentId),
      hireDate ? new Date(hireDate) : undefined
    )

    .then((employee) => {
      res
        .status(201)
        .json({ message: "Employee created successfully", data: employee });
    })
    .catch((err: any) => {
      res.status(400).json({ msg: err?.message || "unexpected error occured" });
    });
}

// case 3
function updateEmployeeSalary(req: Request, res: Response){
  const { error, value } = updateSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({ error: error.details.map((x) => x.message) });
  }

  employeeService.updateEmployeeSalary(Number(req.params.id), value)
  .then(employee => {
    res.status(201).json({ msg: 'Employee salary updated successfully', data: employee })
  })
  .catch((err: any) => {
    res.status(500).json({ msg: err?.message || "unexpected error occured" });
  })
}

// case 4
function deleteEmployee(req: Request, res: Response) {
  employeeService
    .deleteEmployee(Number(req.params.id))
    .then((employee) => {
      res.status(201).json({ msg: "Employee deactivate.", data: employee });
    })
    .catch((err: any) => {
      res.status(400).json({ msg: err?.message || "unexpected error occured" });
    });
}

// case 5
function getEmployeeByName(req: Request, res: Response) {
  const name = req.query.name as string
  
  if(!name) return res.status(400).json({ msg: 'name query parameter is required'})

  employeeService.getEmployeeByName(name)
  .then(employee => {
    res.status(200).json(employee)
  })
  .catch((err: any) => {
    res.status(400).json({ msg: err?.message || "unexpected error occured" });
  });
}

// case 7
function getTenure(req: Request, res: Response) {
  employeeService
    .getTenure(Number(req.params.id))
    .then((object) => {
      res
        .status(200)
        .json({
          employeeId: object.employee.id,
          name: object.employee.name,
          yearsOfService: object.yearsOfService,
        });
    })
    .catch((err: any) => {
      res.status(400).json({ msg: err?.message || "unexpected error occured" });
    });
}

// case 8
function transferEmployee(req: Request, res: Response){
  employeeService
    .transferEmployee(req.body.departmentId, Number(req.params.id))
    .then(employee => {
      res.status(201).json({ msg: "employee's department id successfully update", employee: employee})
    })
    .catch((err: any) => {
      res.status(400).json({ msg: err?.message || "unexpected error occured" });
    });
}

const updateSchema = Joi.object({
  salary: Joi.number().required().positive().messages({
    'number.base': 'Salary must be a number',
    'number.positive': 'Salary must be a positive number',
    'any.required': 'Salary is required',
  }),
});
