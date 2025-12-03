import express from "express"
import packagesRoutes from "./routes/packagesRoutes.js"
import userRoutes from "./routes/usersRoutes.js"
import cors from "cors"

const PORT = 3000
const app = express()

app.use(cors());
app.use(express.json())
app.use(express.static("public"))

app.use("/api/packages", packagesRoutes)
app.use("/api", userRoutes)

app.listen(PORT, () => {
    console.log(`Server runs on ${PORT}`)
})