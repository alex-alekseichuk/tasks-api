import {Task} from "../entities/task";

interface TasksError {
    message: string;
    status?: number;
}

type WithTasksError = {
    error?: TasksError;
}

export type CreateTaskData = {
    title: string;
}

export type UpdateTaskData = {
    title: string;
}

export interface ITasksService {
    listTasks(): Promise<Task[]>;
    getTask(id: number): Promise<{task?: Task} & WithTasksError>;
    createTask(data: CreateTaskData): Promise<{task?: Task} & WithTasksError>;
    updateTask(id: number, data: UpdateTaskData): Promise<{task?: Task} & WithTasksError>;
    deleteTask(id: number): Promise<WithTasksError>;
}

export interface ITasksRepo {
    listTasks(): Promise<Task[]>;
    getTask(id: number): Promise<Task | undefined>;
    createTask(data: CreateTaskData): Promise<Task | undefined>;
    updateTask(id: number, data: UpdateTaskData): Promise<Task | undefined>;
    deleteTask(id: number): Promise<void>;
}

export function tasksService(tasksRepo: ITasksRepo): ITasksService {
    return {
        listTasks,
        getTask,
        createTask,
        updateTask,
        deleteTask,
    }

    async function listTasks(): Promise<Task[]> {
        return await tasksRepo.listTasks();
    }

    async function _getTask(id: number): Promise<Task | undefined> {
        return await tasksRepo.getTask(id);
    }

    async function getTask(id: number): Promise<{task?: Task} & WithTasksError> {
        const task = await tasksRepo.getTask(id);
        if (!task) return {error: {message: 'No such a Task', status: 404}};
        return {task};
    }

    async function createTask(data: CreateTaskData): Promise<{task?: Task} & WithTasksError> {
        if (!data.title) return {error: {message: 'Empty title', status: 400}};
        const task = await tasksRepo.createTask(data);
        return {task}
    }

    async function updateTask(id: number, data: UpdateTaskData): Promise<{task?: Task} & WithTasksError> {
        const existingTask = await tasksRepo.getTask(id);
        if (!existingTask) return {error: {message: 'No such a Task', status: 404}};
        if (!data.title) return {error: {message: 'Empty title', status: 400}};
        const task = await tasksRepo.updateTask(id, data);
        return {task}
    }

    async function deleteTask(id: number): Promise<WithTasksError> {
        const existingTask = await tasksRepo.getTask(id);
        if (!existingTask) return {error: {message: 'No such a Task', status: 404}};
        await tasksRepo.deleteTask(id);
        return {};
    }
}
