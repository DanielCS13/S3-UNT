//Import modules
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectToDatabase from './db/db.js';
import fileUpload from "express-fileupload"


//Import APIs
import user from './routes/user.js';
import category from './routes/category.js';
import file from './routes/file.js';
import institution from './routes/institution.js';
import auth from './routes/auth.js';

//Init app
const app = express();

//Init Mongodb Connection
connectToDatabase()

//Settings
app.set("port", process.env.PORT || 3001);

//Import Middlewares
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads"
}))

app.use(express.static("images"))

//Middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'));

//Routes
app.use("/api/user", user)
app.use("/api/category", category)
app.use("/api/file", file)
app.use("/api/institution",institution)
app.use("/api/auth", auth)

//Start server
app.listen(app.get("port"), () => {
    console.log(`Server on port ` + app.get("port"))
})
