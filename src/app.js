import express from "express";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import routes from "./routes";

class App {
    constructor() {
        this.server = express();

        mongoose.connect("<mongo connection string>", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        this.midlewares();
        this.routes();
    }

    midlewares() {
        this.server.use(cors());
        this.server.use(
            "/files",
            express.static(path.resolve(__dirname, "..", "uploads"))
        );
        this.server.use(express.json());
    }

    routes() {
        this.server.use(routes);
    }
}

export default new App().server;
