import express from "express"
import packagesRoutes from "./routes/packagesRoutes.js"
import userRoutes from "./routes/usersRoutes.js"
import cors from "cors"

const PORT = 3000
const app = express()

//app.use((req, res, next) => {
  //res.setHeader(
    //'Content-Security-Policy',
    //"default-src 'self' http://localhost:3000; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:3000 ws://localhost:3000;"
  //);
  //next();
//});

app.use(cors());
app.use(express.json())
app.use(express.static("public"))

app.use("/api/packages", packagesRoutes)
app.use("/user", userRoutes)

app.listen(PORT, () => {
    console.log(`Server runs on ${PORT}`)
})

