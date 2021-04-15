import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const { readJSON, writeJSON, writeFile, createReadStream } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");

const studentsFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../public/img/students"
);

const projectsFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../public/img/projects"
);

export const getStudents = async () =>
  await readJSON(join(dataFolderPath, "students.json"));

export const getProjects = async () =>
  await readJSON(join(dataFolderPath, "projects.json"));

export const writeStudents = async () =>
  await writeJSON(join(dataFolderPath, "students.json"));

export const writeProjects = async () =>
  await writeJSON(join(dataFolderPath, "projects.json"));

export const getCurrentFolderPatch = (currentFİle) =>
  dirname(fileURLToPath(currentFİle));

export const writeStudentsPictures = async (filename, content) =>
  await writeFile(join(studentsFolderPath, filename), content);
