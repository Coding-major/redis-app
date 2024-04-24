import type { CreateItemAttrs, Item } from '$services/types';
import { itemKey } from '$services/keys';
import { client } from '$services/redis';
import { genId } from '$services/utils';
import { DateTime } from 'luxon';


export const getItems = async (ids: string[]) => {};

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