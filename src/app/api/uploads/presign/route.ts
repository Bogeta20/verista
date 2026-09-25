import { randomUUID } from "crypto";
import { getCurrentUser } from "@/lib/auth";
import { isS3Configured, createPresignedUploadUrl } from "@/lib/s3";
import { z } from "zod";

const presignSchema = z.object({
  filename: z.string().min(1).max(200),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  if (!isS3Configured()) {
    return Response.json(
      {
        error:
          "Photo uploads aren't configured yet — S3 credentials (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET, AWS_REGION) are missing.",
      },
      { status: 501 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = presignSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { filename, contentType } = parsed.data;
  const extension = filename.split(".").pop()?.toLowerCase() || "jpg";
  const key = `listings/${user.id}/${randomUUID()}.${extension}`;

  const { uploadUrl, publicUrl } = await createPresignedUploadUrl(
    key,
    contentType
  );

  return Response.json({ uploadUrl, publicUrl });
}
