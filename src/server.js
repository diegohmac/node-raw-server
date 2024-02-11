import http from 'node:http';
import { Database } from './database.js';
import { json } from './middlewares/json.js';

const database = new Database();

const server = http.createServer(async (req, res) => {

    await json(req, res);

    res.end('Hello, World!');
});

server.listen(3333);