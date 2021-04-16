import express from "express";
import studentsRoutes from "./students/index.js";
import projectsRoutes from "./projects/index.js";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import {
  notFoundErrorHandler,
  badRequestErrorHandling,
  catchAllErrorHandler,
  forbiddenErrorHandler,
} from "./errorHandlers.js";

const server = express();
const port = process.env.PORT || 5000;

server.use(cors());
server.use(express.json());
server.use("/students", studentsRoutes);
server.use("/projects", projectsRoutes);

server.use(notFoundErrorHandler);
server.use(badRequestErrorHandling);
server.use(forbiddenErrorHandler);
server.use(catchAllErrorHandler);

server.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
