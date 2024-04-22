import { client } from "$services/redis";
import { pagecacheKey } from "$services/keys";
const cacheRoutes = [
    '/about', '/privacy', '/auth/signin', '/auth/signup'
]


export const getCachedPage = (route: string) => {
    if (cacheRoutes.includes(route)) {
        return client.get(pagecacheKey(route))
    }

    return null
};

export const setCachedPage = (route: string, page: string) => {
    if (cacheRoutes.includes(route)) {
        return client.set(pagecacheKey(route), page, {
            EX: 2
        })
    }
};
