import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { usersKey, usernameUniqueKey, usernameKey } from '$services/keys';


export const getUserByUsername = async (username: string) => {
    const decimalId = await client.zScore(usernameKey(), username)

    if (!decimalId) {
        throw new Error('user does not exist')
    }

    const id = decimalId.toString(16)

    const user = await client.hGetAll(usersKey(id))

    return deserialize(id, user)
};

export const getUserById = async (id: string) => {
    const user = await client.hGetAll(usersKey(id))

    return deserialize(id, user)
};

export const createUser = async (attrs: CreateUserAttrs) => {
    const id = genId()

    // check if username already exist
    const exists = await client.sIsMember(usernameKey(), attrs.username)

    if (exists) {
        throw new Error('username already taken')
    }

    await client.hSet(usersKey(id), serialize(attrs)) // create user
    await client.sAdd(usernameUniqueKey(), attrs.username) // add username to the unique username lists
    await client.zAdd(usernameKey(), {
        value: attrs.username,
        score: parseInt(id, 16)
    })

    return id
};

const serialize = (user: CreateUserAttrs) => {
    
    return {
        username: user.username,
        password: user.password
    }
}

const deserialize = (id: string, user: { [key: string]: string}) => {
    return {
        id,
        username: user.username,
        password: user.password
    }
}
