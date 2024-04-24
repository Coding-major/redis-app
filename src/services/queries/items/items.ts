import type { CreateItemAttrs, Item } from '$services/types';
import { itemKey } from '$services/keys';
import { client } from '$services/redis';
import { genId } from '$services/utils';
import { DateTime } from 'luxon';

export const getItem = async (id: string) => {
    const item = await client.hGetAll(itemKey(id))

    if (Object.keys(item).length === 0) {
        return null
    }

    return deserialize(id, item)
};

export const getItems = async (ids: string[]) => {
    const commands = ids.map((id) => {
        return client.hGetAll(itemKey(id))
    })

    const results = await Promise.all(commands)

    results.map( (result, i) => {
        if (Object.keys(result).length === 0) {
            return null
        }

        return deserialize(ids[i], result)
    })
};

export const createItem = async (attrs: CreateItemAttrs, userId: string) => {
    const id = genId()
    await client.hSet(itemKey(id), serialize(attrs))
};

const serialize = (attr: CreateItemAttrs) => {
    return {
        ...attr,
        createdAt: attr.createdAt.toMillis(),
        endingAt: attr.endingAt.toMillis()
    }
}

const deserialize = (id: string, item: {[key: string]: string}): Item => {
    return {
        id,
        name: item.name,
        ownerId: item.ownerId,
        imageUrl: item.imageUrl,
        description: item.description,
        highestBidUserId: item.highestBidUserId,
        createdAt: DateTime.fromMillis(parseInt(item.createdAt)),
        endingAt: DateTime.fromMillis(parseInt(item.endingAt)),
        views: parseInt(item.views),
        likes: parseInt(item.likes),
        price: parseInt(item.price),
        bids: parseFloat(item.bids),
        

    }
}