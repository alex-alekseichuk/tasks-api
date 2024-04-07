import express, {Express, Request, Response} from "express";

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';

import {tasksApi} from "./modules/tasks/http/tasks-api";
import {tasksService} from "./modules/tasks/services/tasks.service";
import {tasksRepo} from "./modules/tasks/repos/tasks.repo";

async function main()
{
    const app: Express = express();
    app.use(express.urlencoded())
    app.use(express.json());

    const port = process.env.PORT || 3000;

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.get("/ping", (req: Request, res: Response) => {
        res.send("pong");
    });

    tasksApi(app, tasksService(await tasksRepo()));

    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
}
main().then(() => {});
