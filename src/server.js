import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import studentsRoutes from "./students/index.js";

const server = express();
const port = 3001;

server.use(cors());
server.use(express.json()); // we need to specify this line of code otherwise all the req bodies will be undefined. This line must come BEFORE the routes
server.use("/students", studentsRoutes);
// server.use("/books", booksRoutes)

console.log(listEndpoints(server));
server.listen(port, () => {
  console.log("Server is running on port ", port);
});
