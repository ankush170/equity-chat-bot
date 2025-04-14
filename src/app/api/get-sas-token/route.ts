import { generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential } from "@azure/storage-blob";

export async function GET() {
  const accountName = process.env.NEXT_PUBLIC_AZURE_ACCOUNT_NAME!;
  const accountKey = process.env.NEXT_PUBLIC_AZURE_ACCOUNT_KEY!;
  const containerName = process.env.NEXT_PUBLIC_AZURE_CONTAINER_NAME!;

  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

  const sasToken = generateBlobSASQueryParameters({
    containerName,
    permissions: BlobSASPermissions.parse("racwd"), // read, add, create, write, delete
    startsOn: new Date(),
    expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // 1 hour
  }, sharedKeyCredential).toString();

  return Response.json({ sasToken });
} 