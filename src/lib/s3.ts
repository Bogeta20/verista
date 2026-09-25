import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export function isS3Configured() {
  return Boolean(
    process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.AWS_S3_BUCKET &&
      process.env.AWS_REGION
  );
}

let client: S3Client | null = null;

function getClient() {
  if (!client) {
    client = new S3Client({ region: process.env.AWS_REGION });
  }
  return client;
}

export async function createPresignedUploadUrl(key: string, contentType: string) {
  const bucket = process.env.AWS_S3_BUCKET as string;
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(getClient(), command, { expiresIn: 300 });
  const publicUrl = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  return { uploadUrl, publicUrl };
}
