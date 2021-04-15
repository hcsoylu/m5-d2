import express from "express";
import { check, validationResult } from "express-validator";

import uniqid from "uniqid";
import { getProjects, writeProjects } from "../lib/fs-tools.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const projects = await getProjects();

  res.status(200).send(projects);
});

router.get("/:id", async (req, res, next) => {
  try {
    const projects = await getProjects();
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
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const projects = await getProjects();
        const newProject = {
          ...req.body,
          projectId: uniqid(),
          studentId: uniqid(),
          createdAt: new Date(),
        };
        projects.push(newProject);

        await writeProjects(projects);

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

router.put("/:id", async (req, res, next) => {
  try {
    const projects = await getProjects();
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

      await writeProjects(newArrayOfProjects);

      res.send(editedProject);
    } else {
      res.status(400).send({ erMsg: "No project found!" });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const projects = await getProjects();
    const filteredProjects = projects.filter(
      (project) => project.projectId !== req.params.id
    );

    await writeProjects(filteredProjects);

    res.status(204).send(projects);
  } catch (error) {
    next(error);
  }
});

export default router;
