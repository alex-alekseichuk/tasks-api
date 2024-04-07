import express, {Express, Request, Response} from "express";
import {ITasksService} from "../services/tasks.service";

export function tasksApi(app: Express, tasksService: ITasksService) {
    const api = express.Router();
    app.use('/tasks', api);

    /**
     * @swagger
     * /tasks:
     *   get:
     *     summary: Get all tasks
     *     description: Retrieve a list of tasks
     *     responses:
     *       '200':
     *         description: A successful response
     */
    api.get("/", async (req: Request, res: Response) => {
        const tasks = await tasksService.listTasks();
        res.json(tasks);
    });

    /**
     * @swagger
     * /tasks/{id}:
     *   get:
     *     summary: Get a task by ID
     *     description: Retrieve a task by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       '200':
     *         description: Success. Returns the resource.
     *       '404':
     *         description: Resource not found.
     *       '500':
     *         description: Internal server error
     */
    api.get("/:id", async (req: Request, res: Response) => {
        const {task, error} = await tasksService.getTask(Number(req.params.id));
        if (error) return res.status(error.status ?? 500).json(error)
        res.json(task);
    });

    /**
     * @swagger
     * /tasks:
     *   post:
     *     summary: Create a new task
     *     description: Create a new task
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *     responses:
     *       '201':
     *         description: Resource created successfully
     *       '400':
     *         description: Bad request. Invalid data provided.
     *       '500':
     *         description: Internal server error
     */
    api.post("/", async  (req: Request, res: Response) => {
        const {task, error} = await tasksService.createTask({title: req.body.title});
        if (error) return res.status(error.status ?? 500).json(error)
        res.status(201).json(task);
    });

    /**
     * @swagger
     * /tasks/{id}:
     *   put:
     *     summary: Update a task by ID
     *     description: Update a task with the provided data
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *     responses:
     *       '200':
     *         description: Resource updated successfully
     *       '400':
     *         description: Bad request. Invalid data provided.
     *       '404':
     *         description: Resource not found.
     *       '500':
     *         description: Internal server error
     */
    api.put("/:id", async  (req: Request, res: Response) => {
        const {task, error} = await tasksService.updateTask(Number(req.params.id), {title: req.body.title});
        if (error) return res.status(error.status ?? 500).json(error)
        res.status(200).json(task);
    });

    /**
     * @swagger
     * /tasks/{id}:
     *   delete:
     *     summary: Delete a task by ID
     *     description: Delete a task by its ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       '204':
     *         description: Resource deleted successfully
     *       '404':
     *         description: Resource not found.
     *       '500':
     *         description: Internal server error
     */
    api.delete("/:id", async (req: Request, res: Response) => {
        const {error} = await tasksService.deleteTask(Number(req.params.id));
        if (error) return res.status(error.status ?? 500).json(error)
        res.status(204).json({});
    });

    return api;
}
