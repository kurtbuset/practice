import { AppDataSource } from "./_helpers/data-source";
import { Student } from "./entity/Student";
import Joi from "joi";
import bcrypt from "bcrypt";
import { Course } from "./_helpers/course";

import express, { Request, Response } from "express";
import { Gender } from "./_helpers/gender";
const studentRouter = express.Router();

studentRouter.get("/students", async (req: Request, res: Response) => {
  try {
    const students = await AppDataSource.manager.find(Student);

    if (students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }

    return res.status(200).json({ message: "List of students", students });
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

studentRouter.get("/students/:id", async (req: Request, res: Response) => {
  try {
    const studentID = Number(req.params.id);

    if (isNaN(studentID)) {
      return res.status(400).json({ msg: "invalid Student id" });
    }

    const student = await AppDataSource.manager.findOneBy(Student, {
      id: studentID,
    });

    if (!studentID) {
      return res.status(404).json({ msg: `Student id: ${studentID} cant be found` });
    }

    return res.status(200).json({ msg: "Student found", student });
  } catch (err) {
    console.error("Error fetching Student:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

//trangia
studentRouter.post("/students", async (req: Request, res: Response) => {
  try {
    const { error, value } = createSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((x) => x.message) });
    }

    const { firstName, lastName, sex, grade, course } = value;

    const userRepository = AppDataSource.getRepository(Student);
    const newUser = userRepository.create({
      firstName,
      lastName,
      sex,
      grade,
      course,
    });

    await userRepository.save(newUser);

    res
      .status(201)
      .json({ message: "Student added sucessfully", student: newUser });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//boss carl
studentRouter.put("/Students/:id", async (req: Request, res: Response) => {
  try {
    const StudentRepository = AppDataSource.getRepository(Student);
    const StudentID = Number(req.params.id);

    if (isNaN(StudentID)) {
      return res.status(400).json({ msg: "Invalid Student ID" });
    }

    const StudentToUpdate = await StudentRepository.findOneBy({
      id: StudentID,
    });

    if (!StudentToUpdate) {
      return res.status(404).json({ msg: "Student not found" });
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

    const { firstName, lastName, sex, grade, course } = value;
    let hashedPassword;


    // Update only the provided fields
    Object.assign(StudentToUpdate, {
      firstName,
      lastName,
      sex,
      grade,
      course,
    });

    await StudentRepository.save(StudentToUpdate);

    return res
      .status(200)
      .json({ message: `Student ${StudentID} updated successfully` });
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// delete .
userRouter.get("/api/employees", async (req: Request, res: Response) => {
  try {
    const EmployeeRepository = AppDataSource.getRepository(User);
    const activeEmployees = await EmployeeRepository.find({ where: { isActive: true } });

    if (activeEmployees.length === 0) {
      return res.status(404).json({ message: "No active employees found" });
    }

    return res.status(200).json({ message: "List of active employees", employees: activeEmployees });
  } catch (error) {
    console.error("Error fetching active employees:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const createSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  sex: Joi.string().valid(Gender.Male, Gender.Female).required(),
  grade: Joi.number().valid().required(),
  course: Joi.string().valid(Course.STEM, Course.HUMMS).required(),
});

const updateSchema = Joi.object({
  title: Joi.string().empty(""),
  firstName: Joi.string().empty(""),
  lastName: Joi.string().empty(""),
  sex: Joi.string().valid(Gender.Male, Gender.Female).empty(""),
  grade: Joi.number().valid().empty(""),
  course: Joi.string().valid(Course.STEM, Course.HUMMS).empty(""),
});

export default studentRouter;
