import { BlobServiceClient } from "@azure/storage-blob";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    const accountName = process.env.NEXT_PUBLIC_AZURE_ACCOUNT_NAME;
    const accountKey = process.env.NEXT_PUBLIC_AZURE_ACCOUNT_KEY;
    const containerName = process.env.NEXT_PUBLIC_AZURE_CONTAINER_NAME;

    if (!accountName || !accountKey || !containerName) {
      throw new Error('Azure storage credentials are not properly configured');
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(
      `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${accountKey};EndpointSuffix=core.windows.net`
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists();

    const blobName = `${Date.now()}-${file.name}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const arrayBuffer = await file.arrayBuffer();
    await blockBlobClient.uploadData(arrayBuffer);

    return Response.json({ url: blockBlobClient.url });
  } catch (error) {
    console.error('Error uploading to Azure:', error);
    return Response.json({ error: 'Failed to upload file' }, { status: 500 });
  }
} 