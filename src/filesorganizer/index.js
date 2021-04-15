import express from "express";
import {
  writeStudentsPictures,
  readStudentsPictures,
  getStudents,
} from "../lib/fs-tools.js";
import multer from "multer";
import { pipeline } from "stream";


const router = express.Router()

router.post("/uploadPhoto" , 
multer().single("profilePic"), async (req , res , next => {
    try {
         
        await writeStudentsPictures(req.file.originalname, req.file.buffer)
        res.send("ok")

    } catch (error) {
        console.log(req.file);
    }
 
}))


export default router