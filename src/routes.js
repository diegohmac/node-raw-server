import { Database } from './database.js';

const database = new Database();

export const routes = [
    {
        method: 'GET',
        path: '/tasks',
        handler: (req, res) => {
            const tasks = database.select('tasks');
            return res.end(JSON.stringify(tasks));
        },
    },
    {
        method: 'POST',
        path: '/tasks',
        handler: (req, res) => {},
    },
    {
        method: 'PUT',
        path: '/tasks/:id',
        handler: (req, res) => {},
    },
    {
        method: 'PATCH',
        path: '/tasks/:id/complete',
        handler: (req, res) => {},
    },
    {
        method: 'DELETE',
        path: '/tasks/:id',
        handler: (req, res) => {},
    },
]