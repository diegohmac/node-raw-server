export function buildRoutePath(route) {
    const routeParametersRegex = /:([a-zA-Z]+)/g;
    const pathWithParams = route.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)');
    const pathRegex = new RegExp(`^${pathWithParams}$`);
    return pathRegex;
}