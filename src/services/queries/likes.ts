import { client } from "$services/redis";
import { userLikesKey, itemKey } from "$services/keys";
import { getItems } from "./items";



export const userLikesItem = async (itemId: string, userId: string) => {
    // return client.sIsMember(userLikesKey(userId), itemId)
    await client.sIsMember(userLikesKey(userId), itemId)
};

export const likedItems = async (userId: string) => {
    const likedItemsIds = await client.sMembers(userLikesKey(userId))

    getItems(likedItemsIds)
};

export const likeItem = async (itemId: string, userId: string) => {
    const like = await client.sAdd(userLikesKey(userId), itemId)

    if (like) {
        await client.hIncrBy(itemKey(itemId), 'likes', 1)
    }
};

export const unlikeItem = async (itemId: string, userId: string) => {
    const remove = await client.sRem(userLikesKey(userId), itemId)

    if (remove) {
        await client.hIncrBy(itemKey(itemId), 'likes', -1)
    }

};

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {
    const itemsIds = await client.sInter([userLikesKey(userOneId), userLikesKey(userTwoId)])

    return getItems(itemsIds)

}