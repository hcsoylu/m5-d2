import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const router = express.Router();

const filename = fileURLToPath(import.meta.url);
const studentsJSONPath = join(dirname(filename), "students.json");

const fileAsABuffer = fs.readFileSync(studentsJSONPath); // returns a buffer (machine readable, not human readable)

const fileAsAString = fileAsABuffer.toString(); // returns a string from a buffer
const students = JSON.parse(fileAsAString);
const fileAsAJSON = JSON.parse(fileAsAString); // converts string into JSON

router.get("/", (reg, res) => {
  console.log("get route");

  res.send(fileAsAJSON);
});

router.get("/:identifier", (req, res) => {
  const student = students.find((s) => s.ID === req.params.identifier);
  res.send(student);
});

router.post("/", (req, res) => {
  const newStudent = req.body;

  newStudent.ID = uniqid();

  students.push(newStudent);

  fs.writeFileSync(studentsJSONPath, JSON.stringify(students));

  res.status(201).send({ id: newStudent.ID });
});

export default router;
