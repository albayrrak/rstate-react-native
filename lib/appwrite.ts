import { Client, Account, ID, Avatars, OAuthProvider, Databases, Query } from 'react-native-appwrite';
import * as Linking from 'expo-linking';
import { openAuthSessionAsync } from "expo-web-browser"

export const config = {
    platform: "com.ycl.realstate",
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    galleriesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID,
    propertiesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID,
    agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID,
    reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
}

const client = new Client()

client.setEndpoint("https://cloud.appwrite.io/v1")
client.setProject(config.projectId!)
client.setPlatform(config.platform!);

export const avatar = new Avatars(client)
export const account = new Account(client)
export const databases = new Databases(client)

export async function login() {
    try {
        const redirectUri = Linking.createURL("/");

        const response = await account.createOAuth2Token(
            OAuthProvider.Google,
            redirectUri
        );
        if (!response) throw new Error("Create OAuth2 token failed");

        const browserResult = await openAuthSessionAsync(
            response.toString(),
            redirectUri
        );
        if (browserResult.type !== "success")
            throw new Error("Create OAuth2 token failed");

        const url = new URL(browserResult.url);
        const secret = url.searchParams.get("secret")?.toString();
        const userId = url.searchParams.get("userId")?.toString();
        if (!secret || !userId) throw new Error("Create OAuth2 token failed");

        const session = await account.createSession(userId, secret);
        if (!session) throw new Error("Failed to create session");

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const logout = async () => {
    try {
        await account.deleteSession("current")
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}

export const getCurrentUser = async () => {
    try {
        const response = await account.get()

        if (response.$id) {
            const userAvatar = await avatar.getInitials(response.$id)
            return {
                ...response,
                avatar: userAvatar.toString(),
            }
        }

    } catch (error) {

    }
}

export const getLatestProperties = async () => {
    try {
        const result = await databases.listDocuments(config.databaseId!, config.propertiesCollectionId!, [Query.orderAsc("$createdAt"), Query.limit(10)])
        console.log(result.documents);
        return result.documents
    } catch (error) {
        console.log(error);
        return []
    }

}

export const getProperties = async ({ filter, query, limit }: { filter: string, query: string, limit?: number }) => {

    try {
        const builderQuery = [Query.orderDesc("$createdAt")]

        if (filter && filter !== "All") {
            builderQuery.push(Query.equal("type", filter))
        }

        if (query) {
            builderQuery.push(
                Query.or([
                    Query.search("name", query), Query.search("address", query), Query.search("type", query)])
            )
        }

        if (limit) {
            builderQuery.push(Query.limit(limit))
        }

        const result = await databases.listDocuments(config.databaseId!, config.propertiesCollectionId!, builderQuery)
        return result.documents
    } catch (error) {
        console.log(error);
        return []

    }

}