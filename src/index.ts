import express from 'express'
import employeeRouter from './employee.routes'
const app = express()

app.use(express.json())

app.use('', employeeRouter)


app.listen(3000, () => {
    console.log('Server running on port 3000')
})






