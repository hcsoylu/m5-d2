import express from "express";
import { check, validationResult } from "express-validator";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const router = express.Router();

const filename = fileURLToPath(import.meta.url);
const studentsJSONPath = join(dirname(filename), "projects.json");

const getProjects = () => {
  const fileAsABuffer = fs.readFileSync(studentsJSONPath);
  const fileAsAString = fileAsABuffer.toString();
  const projects = JSON.parse(fileAsAString);
  return projects;
};

router.get("/", (req, res) => {
  const projects = getProjects();

  res.status(200).send(projects);
});

router.get("/:id", (req, res, next) => {
  try {
    const projects = getProjects();
    const project = projects.filter(
      (project) => project.projectId === req.params.id
    );

    if (project.length > 0) {
      res.send(project);
    } else {
      const err = new Error();
      err.httpStatusCODE = 404;
      next(err);
    }
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  [
    check("name").exists().withMessage("insert name!!!"),
    check("repoURL").exists().isURL().withMessage("insert a valid URL!!"),
    check("liveURL").exists().isURL().withMessage("insert a live URL!!"),
  ],
  (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const projects = getProjects();
        const newProject = {
          ...req.body,
          projectId: uniqid(),
          studentId: uniqid(),
          createdAt: new Date(),
        };
        projects.push(newProject);
        fs.writeFileSync(
          join(dirname(filename), "projects.json"),
          JSON.stringify(projects)
        );
        res.status(201).send(newProject);
      } else {
        const err = new Error();
        err.errorList = errors;
        err.httpStatusCODE = 400;
        next(err);
      }
    } catch (error) {
      error.httpStatusCODE = 500;
      next(error);
    }
  }
);

router.put("/:id", (req, res, next) => {
  try {
    const projects = getProjects();
    const newArrayOfProjects = projects.filter(
      (project) => project.projectId !== req.params.id
    );
    const editedProject = {
      ...req.body,
      projectId: req.params.id,
      updateAt: new Date(),
    };

    if (editedProject.projectId === req.params.id) {
      newArrayOfProjects.push(editedProject);

      fs.writeFileSync(
        join(dirname(filename), "projects.json"),
        JSON.stringify(newArrayOfProjects)
      );

      res.send(editedProject);
    } else {
      res.status(400).send({ erMsg: "No project found!" });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    const projects = getProjects();
    const filteredProjects = projects.filter(
      (project) => project.projectId !== req.params.id
    );
    fs.writeFileSync(
      join(dirname(filename), "projects.json"),
      JSON.stringify(filteredProjects)
    );
    res.status(204).send(projects);
  } catch (error) {
    next(error);
  }
});

export default router;
