import { UserService } from "./user.services";
import Joi from "joi";
import express, { Request, Response } from "express";
import { Role } from "../_helpers/role";
const userRouter = express.Router();
const userService = new UserService();

userRouter.get("", getUsers);
userRouter.post("", createUser);

export default userRouter;

function getUsers(req: Request, res: Response) {
  userService
    .getUser()
    .then((users) => {
      return res.status(200).json({ users });
    })
    .catch((err: any) => {
      res.status(400).json({ msg: err?.message || "unexpected error occured" });
    });
}

function createUser(req: Request, res: Response) {
  const { error, value } = createSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({ error: error.details.map((x) => x.message) });
  }

  userService
    .createUser(value)
    .then((user) => {
      return res.status(200).json({ user });
    })
    .catch((err: any) => {
      res.status(400).json({ msg: err?.message || "unexpected error occured" });
    });
}

const createSchema = Joi.object({
  title: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid(Role.Admin, Role.User).required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  employeeId: Joi.number().required(),
});
