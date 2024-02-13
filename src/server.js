import http from 'node:http';
import { json } from './middlewares/json.js';
import { routes } from './routes.js';


const server = http.createServer(async (req, res) => {
    const { method, url } = req;

    await json(req, res);

    const route = routes.find(route => {
        const methodMatches = route.method === method;
        const pathMatches = route.path.test(url);

        return methodMatches && pathMatches;
    });

    if (route) {
        const routeParams = url.match(route.path);

        req.params = {...routeParams.groups};

        return route.handler(req, res);
    }

    res.writeHead(404).end();
});

server.listen(3333);