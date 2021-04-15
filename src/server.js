import express from "express";
import listEndpoints from "express-list-endpoints";
import fileRoutes from "./filesorganizer/index.js";
import cors from "cors";
import studentsRoutes from "./students/index.js";
import projectsRoutes from "./projects/index.js";
import { getCurrentFolderPatch } from "./lib/fs-tools.js";

const server = express();
const port = process.env.PORT || 3001;

const pathPublicFolder = join(
  getCurrentFolderPatch(import.meta.url),
  "../public"
);

server.use(express.static(pathPublicFolder));

server.use(cors());
server.use(express.json()); // we need to specify this line of code otherwise all the req bodies will be undefined. This line must come BEFORE the routes
server.use("/students", studentsRoutes);

server.use("/projects", projectsRoutes);
server.use("/files", fileRoutes);
// server.use("/books", booksRoutes)

console.log(listEndpoints(server));
server.listen(port, () => {
  console.log("Server is running on port ", port);
});
