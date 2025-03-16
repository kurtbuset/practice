import { Like } from "typeorm";
import { Employee } from "../models/employee.model";
import { AppDataSource } from "../_helpers/db";
import { Department } from "../models/department.model";

export class EmployeeService {
  private employeeRepo = AppDataSource.getRepository(Employee);
  private departmentRepo = AppDataSource.getRepository(Department);

  // case 1
  async getEmployees() {
    try {
      const employees = await this.employeeRepo.find({
        select: {
          id: true,
          name: true,
          position: true,
          department: {
            id: true, 
            name: true,
          },
        },
        relations: ["department"],
      });

      if (employees.length === 0) {
        throw new Error("no employees");
      }

      return employees;
    } catch (err) {
      console.error("Error: ", err);
      throw err;
    }
  }

  // case 2
  async createEmployee(
    name: string,
    position: string,
    departmentId: number,
    hireDate?: Date
  ) {
    try {
      if (!name || !position || !departmentId) {
        throw new Error("Required fields");
      }

      const department = await this.departmentRepo.findOneBy({
        id: departmentId,
      });

      if (!department) {
        throw new Error("Department not found");
      }

      const validHireDate =
        hireDate instanceof Date && !isNaN(hireDate.getTime())
          ? hireDate
          : new Date();

      const newEmployee = this.employeeRepo.create({
        name,
        position,
        department,
        hireDate: validHireDate,
      });

      return await this.employeeRepo.save(newEmployee);
    } catch (err) {
      console.error("Error: ", err);
      throw err;
    }
  }

  // case 3
  async updateEmployeeSalary(id: number, data: { salary: number }) {
    try {
      const employee = await this.employeeRepo.findOneBy({
        id: id,
      });

      if (!employee) throw new Error("employee not found");

      employee.salary = data.salary;

      return await this.employeeRepo.save(employee);
    } catch (err) {
      console.error("Error: ", err);
      throw err;
    }
  }

  // case 4
  async deleteEmployee(id: number) {
    try {
      const employee = await this.employeeRepo.findOneBy({
        id: id,
      });

      if (!employee) throw new Error("no employee was found");

      employee.isActive = false;

      return await this.employeeRepo.save(employee);
    } catch (err) {
      console.error("Error: ", err);
      throw err;
    }
  }

  // case 5
  async getEmployeeByName(name: string) {
    try{
      if(!name) throw new Error('name is required')

      const employee = await this.employeeRepo.find({
        where: { name: Like(`%${name}%`)}
      })

      if(!employee || employee.length === 0) throw new Error('employee not found')
  
      return employee
    }
    catch(err) {
      console.error('Error: ', err)
      throw err
    }
  }

  // case 6
  async projectEmployee(id: number) {
    try {
    } catch (err) {
      console.error("Error: ", err);
      throw err;
    }
  }

  // case 7
  async getTenure(id: number) {
    try {
      const employee = await this.employeeRepo.findOneBy({ id: id });

      if (!employee) throw new Error("no employee was found");

      const hireDate = new Date(employee.hireDate);
      const currentDate = new Date();
      const yearsOfService = currentDate.getFullYear() - hireDate.getFullYear();

      return { employee, yearsOfService };
    } catch (err) {
      console.error("Error: ", err);
      throw err;
    }
  }

  // case 8
  async transferEmployee(departmentId: Department, employeeId: number) {
    try {
      const department = await this.departmentRepo.findOneBy({
        id: Number(departmentId),
      });
      if (!department) throw new Error("no department was found");

      const employee = await this.employeeRepo.findOneBy({ id: employeeId });

      if (!employee) throw new Error("no employee was found");

      employee.department = departmentId;

      return this.employeeRepo.save(employee);
    } catch (err) {
      console.error("Error: ", err);
      throw err;
    }
  }

  // case 9

  // case 10
}
