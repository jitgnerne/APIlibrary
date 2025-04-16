import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const PORT = process.env.PORT || 3000

import bookRouter from "./routes/bookRouter.js"
import clientRouter from "./routes/clientsRouter.js"

let app = express()

app.use(cors())

app.use(express.json())

app.use('/booksRoute', bookRouter)
app.use('/clientsRoute', clientRouter)

app.listen(PORT, () => {
    console.log(`O Backend está rodando no localhost: ${PORT}`)
})
