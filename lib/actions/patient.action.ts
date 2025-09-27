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

type PatientBaseData = {
    userId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    phoneNumber?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    bloodType?: string;
    allergies?: string;
    medications?: string;
    medicalConditions?: string;
};

type RegisterUserParams = PatientBaseData & {
    identificationDocument?: FormData;
};

// "use server";

// import { ID, Query } from "node-appwrite";
// import { users } from "../appwrite.config";
// import { parseStringify } from "../lib/utils";
// import { CreateUserParams } from "../types";

export const createUser = async (user: CreateUserParams) => {
  try {
    // Try to create new user
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined, // password is optional here
      user.name
    );

    console.log("✅ New user created:", newUser.$id);
    return parseStringify(newUser);

  } catch (error: any) {
    // Handle duplicate user (409)
    if (error.code === 409) {
      console.warn("⚠️ User already exists, fetching existing...");

      const documents = await users.list([
        Query.equal("email", [user.email]),
      ]);

      const existingUser = documents?.users?.[0];

      if (!existingUser) {
        console.error("❌ User already exists but could not be retrieved");
        throw new Error("User already exists but not retrievable");
      }

      console.log("✅ Existing user found:", existingUser.$id);
      return parseStringify(existingUser);
    }

    console.error("❌ Error creating user:", error);
    throw error;
  }
};


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