import express from "express"
import packagesRoutes from "./routes/packagesRoutes.js"
import userRoutes from "./routes/userRoutes.js"

const PORT = 3000
const app  = express()

app.use(express.json())
app.use(express.static("public"))

app.use("/packages", packagesRoutes)
app.use("/user", userRoutes)

app.listen(PORT, () => {
    console.log(`Server runs on ${PORT}`)
})