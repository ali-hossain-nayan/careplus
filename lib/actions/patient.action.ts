'use server'
import { ID, Query, AppwriteException } from "node-appwrite" // Import AppwriteException
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config"
import { parseStringify } from "../utils"
import { InputFile } from 'node-appwrite/file'

export const createUser = async (user: CreateUserParams) => {
    try {
        const newUser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name
        )
        console.log({ newUser })
        return parseStringify(newUser);
    } catch (error: unknown) { // Use unknown instead of any
        if (error instanceof AppwriteException && error.code === 409) {
            const documents = await users.list([
                Query.equal('email', [user.email])
            ])
            return documents?.users[0];
        }
        console.error(error);
        throw error; // Re-throw the error if it's not a 409 conflict
    }
}

// ... rest of your code remains the same ...