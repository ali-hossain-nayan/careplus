'use server'
import { ID, Query, Models } from "node-appwrite"
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config"
import { parseStringify } from "../utils"
import { InputFile } from 'node-appwrite/file'

type CreateUserParams = {
    email: string;
    phone?: string;
    name?: string;
};

type RegisterUserParams = {
    identificationDocument?: FormData;
    [key: string]: any; // For other patient properties
};

export const createUser = async (user: CreateUserParams) => {
    try {
        const newUser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name
        );
        return parseStringify(newUser);
    } catch (error: unknown) {
        if (error instanceof Error && 'code' in error && error.code === 409) {
            const documents = await users.list([
                Query.equal('email', [user.email])
            ]);
            return parseStringify(documents?.users[0]);
        }
        console.error("Error creating user:", error);
        throw error;
    }
}

export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId);
        return parseStringify(user);
    } catch (error: unknown) {
        console.error("Error getting user:", error);
        throw error;
    }
}

export const getPatient = async (userId: string) => {
    if (!DATABASE_ID || !PATIENT_COLLECTION_ID) {
        throw new Error('Appwrite configuration is incomplete');
    }

    try {
        const patients = await databases.listDocuments(
            DATABASE_ID,
            PATIENT_COLLECTION_ID,
            [Query.equal('userId', userId)]
        );
        return parseStringify(patients.documents[0]);
    } catch (error: unknown) {
        console.error("Error getting patient:", error);
        throw error;
    }
}

export const registerPatient = async ({ identificationDocument, ...patient }: RegisterUserParams) => {
    if (!DATABASE_ID || !PATIENT_COLLECTION_ID || !BUCKET_ID || !ENDPOINT || !PROJECT_ID) {
        throw new Error('Appwrite configuration is incomplete');
    }

    try {
        let file: Models.File | undefined;
        if (identificationDocument) {
            const blobFile = identificationDocument.get('blobFile');
            const fileName = identificationDocument.get('fileName');
            
            if (!(blobFile instanceof Blob)) {
                throw new Error('Invalid file format');
            }
            if (typeof fileName !== 'string') {
                throw new Error('Invalid file name');
            }

            const inputFile = InputFile.fromBuffer(blobFile, fileName);
            file = await storage.createFile(BUCKET_ID, ID.unique(), inputFile);
        }

        const newPatient = await databases.createDocument(
            DATABASE_ID,
            PATIENT_COLLECTION_ID,
            ID.unique(),
            {
                identificationDocumentId: file?.$id || null,
                identificationDocumentUrl: file ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}` : null,
                ...patient
            }
        );
        return parseStringify(newPatient);
    } catch (error: unknown) {
        console.error("Error registering patient:", error);
        throw error;
    }
}