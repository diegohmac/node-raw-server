import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import { parse } from 'csv-parse';

import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query;
            const tasks = database.select('tasks', search ? {
                title: search,
                description: search,
            } : null);
            return res.end(JSON.stringify(tasks));
        },
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks/read-csv'),
        handler: async (req, res) => {
            const processFile = async () => {
                const records = [];
                const parser = fs
                    .createReadStream(`./test.csv`)
                    .pipe(parse());
                for await (const record of parser) {
                    records.push(record);
                }
                return records;
            };

            const records = await processFile();

            if (!records) {
                res.writeHead(400).end(JSON.stringify({ error: 'Invalid file' }));
            }
            
            if (records.length === 0) {
                res.writeHead(400).end(JSON.stringify({ error: 'Empty file' }));
            }
            
            records.splice(0, 1);
            records.forEach(record => {
                const [title, description] = record;
                const task = {
                    id: randomUUID(),
                    title,
                    description,
                    completed_at: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };
                database.insert('tasks', task);
            });

            res.writeHead(201).end();
        },
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body;

            if (!title || !description) {
                return res.writeHead(400).end(JSON.stringify({ error: 'Title and description are required' }));
            }

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            database.insert('tasks', task);

            return res.writeHead(201).end(JSON.stringify(task));
        },
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;
            const { title, description } = req.body;

            const tasks = database.select('tasks');

            const isValidId = tasks.find(task => task.id === id);

            if (!isValidId) {
                return res.writeHead(404).end(JSON.stringify({ error: 'Task not found' }));
            }

            if (!title && !description) {
                return res.writeHead(400).end(JSON.stringify({ error: 'At least one of title or description are required' }));
            }

            database.update('tasks', id, {
                title,
                description,
            });

            res.writeHead(204).end();
        },
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params;

            const tasks = database.select('tasks');

            const isValidId = tasks.find(task => task.id === id);

            if (!isValidId) {
                return res.writeHead(404).end(JSON.stringify({ error: 'Task not found' }));
            }

            database.update('tasks', id, {
                complete: true,
            });

            res.writeHead(204).end();
        },
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;

            const tasks = database.select('tasks');

            const isValidId = tasks.find(task => task.id === id);

            if (!isValidId) {
                return res.writeHead(404).end(JSON.stringify({ error: 'Task not found' }));
            }

            database.delete('tasks', id);

            return res.writeHead(204).end();
        },
    },
]