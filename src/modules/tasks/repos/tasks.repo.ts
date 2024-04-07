import {Sequelize, Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes} from 'sequelize';
import {Task} from "../entities/task";
import {CreateTaskData, ITasksRepo, UpdateTaskData} from "../services/tasks.service";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
});

class TaskModel extends Model<InferAttributes<TaskModel>, InferCreationAttributes<TaskModel>> {
    declare id: CreationOptional<number>;
    declare title: string;
}

TaskModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'tasks',
    }
);

export async function tasksRepo(): Promise<ITasksRepo> {
    await sequelize.sync();
    return {
        listTasks,
        getTask,
        createTask,
        updateTask,
        deleteTask,
    };

    async function listTasks(): Promise<Task[]> {
        const tasks = await TaskModel.findAll({});
        console.log({tasks});
        return tasks;
    }

    async function getTask(id: number): Promise<Task | undefined> {
        return (await TaskModel.findByPk(id)) as Task;
    }

    async function createTask(data: CreateTaskData): Promise<Task | undefined> {
        return (await TaskModel.create(data)) as Task;
    }

    async function updateTask(id: number, data: UpdateTaskData): Promise<Task | undefined> {
        await TaskModel.update(data, {where: {id}});
        return await getTask(id)
    }

    async function deleteTask(id: number): Promise<void> {
        await TaskModel.destroy({where: {id}});
    }

}
