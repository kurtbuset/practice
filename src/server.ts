import express from "express";
import employeeRouter from "./employee/employees.controller";
import userRouter from "./user/users.controller";
const app = express();

app.use(express.json());  

app.use("/api/employees", employeeRouter);
app.use("/users", userRouter);  

const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 3000;

app.listen(port, () => {
  console.log("listening on port 3000");
});
