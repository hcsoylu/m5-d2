import express from "express";
import uniqid from "uniqid";
import { getStudents, writeStudents } from "../lib/fs-tools.js";

const router = express.Router();

router.get("/", async (reg, res) => {
  const students = await getStudents();
  res.send(students);
});

router.get("/:identifier", async (req, res) => {
  const students = await getStudents();
  const student = students.find((s) => s.ID === req.params.identifier);
  res.send(student);
});

router.post("/", async (req, res) => {
  const newStudent = req.body;

  newStudent.ID = uniqid();

  const students = await getStudents();

  students.push(newStudent);

  await writeStudents(students);

  res.status(201).send({ id: newStudent.ID });
});

router.put("/:id", async (req, res) => {
  const students = await getStudents();

  const newStudentsArray = students.filter(
    (student) => student.ID !== req.params.id
  );

  const modifiedUser = req.body;
  modifiedUser.ID = req.params.id;

  newStudentsArray.push(modifiedUser);

  await writeStudents(students);

  res.send({ data: "HELLO FROM PUT ROUTE!" });
});

router.delete("/:id", async (req, res) => {
  const students = await getStudents();

  const newStudentsArray = students.filter(
    (student) => student.ID !== req.params.id
  );

  // 3. save the file with the new content

  await writeStudents(newStudents);

  // 4. send back a proper response
  res.status(204).send();
});

export default router;
