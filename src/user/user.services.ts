import { User } from "../models/user.model";
import { AppDataSource } from "../_helpers/db";
import bcrypt from "bcrypt";
import { Employee } from "../models/employee.model";

export class UserService {
  private userRepo = AppDataSource.getRepository(User);
  private employeeRepo = AppDataSource.getRepository(Employee);

  async getUser() {
    try {
      const users = await this.userRepo.find();

      if (users.length === 0) throw new Error("no users found");

      return users;
    } catch (err) {
      console.error("Error: ", err);
      throw err;
    }
  }

  async createUser(data: {
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    role: string;
    password: string;
    employeeId: number;
  }) {
    try {
      const employee = await this.employeeRepo.findOneBy({
        id: data.employeeId,
      });

      if (!employee) {
        throw new Error("Employee not found");
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const newUser = this.userRepo.create({
        firstName: data.firstName,
        lastName: data.lastName,
        title: data.title,
        email: data.email,
        role: data.role,
        hashedPassword,
        employee,
      });

      return await this.userRepo.save(newUser);
    } catch (err) {
      console.error("Error: ", err);
      throw err;
    }
  }
}
