export const pagecacheKey = (id: string) => `pagecache#${id}`
export const usersKey = (userId: string) => `users#${userId}`
export const sessionKey = (sessionId: string) => `session#${sessionId}`

export const usernameUniqueKey = () => `usernames:unique`
export const usernameKey = () => `usernames`
export const userLikesKey = (likeId: string) => `user:like#${likeId}`

//items
export const itemKey = (itemId: string) => `item#${itemId}`
export const itemsByViewsKey = () => `items:views`
export const itemsByEndingAtKey = () => `items:endingAt`