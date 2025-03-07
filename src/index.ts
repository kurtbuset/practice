import express from 'express'
import studentRouter from './student.routes'
const app = express()

app.use(express.json())

app.use('', studentRouter)


app.listen(3000, () => {
    console.log('Server running on port 3000')
})






