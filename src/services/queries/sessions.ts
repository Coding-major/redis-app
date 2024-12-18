import type { Session } from '$services/types';
import { sessionKey } from '$services/keys';
import { genId } from '$services/utils';
import { client } from '$services/redis';


export const getSession = async (id: string) => {
    const session = await client.hGetAll(sessionKey(id))

    // if (Object.entries(session).length > 0) {
    //     return session
    // } else {
    //     return null
    // }

    if (Object.keys(session).length === 0) {
        return null
    }

    return deserialize(id, session)
};

export const saveSession = async (session: Session) => {
    const id = genId()
    return await client.hSet(sessionKey(id), serialize(session))
};

const serialize = (session: Session) => {
    return {
        userId: session.userId,
        username: session.username
    }
}

const deserialize = (id: string, session: {[key: string]: string}): Session => {
    return {
        id,
        userId: session.userId,
        username: session.username
    }
}