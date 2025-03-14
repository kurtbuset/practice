import express from 'express'
import {employeeRouter} from './employee.routes'
import {userRouter} from './employee.routes'
import { AppDataSource } from "./_helpers/data-source";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(employeeRouter);
app.use(userRouter);

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });





