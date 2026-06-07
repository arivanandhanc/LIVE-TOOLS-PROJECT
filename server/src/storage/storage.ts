import { promises as fs } from "fs";
import path from "path";
import { env } from "../config/env";
import { logger } from "../config/logger";

export interface StoredObject {
  key: string;
  size: number;
}

export interface StorageDriver {
  put(key: string, data: Buffer, contentType: string): Promise<StoredObject>;
  get(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
}

/** Local-disk storage — zero infra, perfect for development and small deploys. */
class LocalStorage implements StorageDriver {
  constructor(private baseDir: string) {}

  private resolve(key: string): string {
    // Prevent path traversal — keys are flat ids we control.
    const safe = key.replace(/[^a-zA-Z0-9._-]/g, "_");
    return path.join(this.baseDir, safe);
  }

  async put(key: string, data: Buffer): Promise<StoredObject> {
    await fs.mkdir(this.baseDir, { recursive: true });
    const filePath = this.resolve(key);
    await fs.writeFile(filePath, data);
    return { key, size: data.length };
  }

  async get(key: string): Promise<Buffer> {
    return fs.readFile(this.resolve(key));
  }

  async delete(key: string): Promise<void> {
    await fs.rm(this.resolve(key), { force: true });
  }

  async exists(key: string): Promise<boolean> {
    try {
      await fs.access(this.resolve(key));
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * S3 / Cloudflare R2 storage. Loaded lazily so @aws-sdk is only required when
 * STORAGE_DRIVER=s3. Falls back to local storage if the SDK isn't installed.
 */
function createStorage(): StorageDriver {
  if (env.storageDriver === "s3" && env.s3.bucket && env.s3.accessKeyId) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } =
        require("@aws-sdk/client-s3");

      const client = new S3Client({
        region: env.s3.region,
        endpoint: env.s3.endpoint ?? undefined,
        credentials: {
          accessKeyId: env.s3.accessKeyId,
          secretAccessKey: env.s3.secretAccessKey,
        },
        forcePathStyle: Boolean(env.s3.endpoint), // needed for R2/MinIO
      });
      const bucket = env.s3.bucket;

      const streamToBuffer = async (stream: NodeJS.ReadableStream): Promise<Buffer> => {
        const chunks: Buffer[] = [];
        for await (const chunk of stream) chunks.push(Buffer.from(chunk));
        return Buffer.concat(chunks);
      };

      logger.info("Storage: S3/R2 driver active");
      return {
        async put(key, data, contentType) {
          await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: data, ContentType: contentType }));
          return { key, size: data.length };
        },
        async get(key) {
          const res = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
          return streamToBuffer(res.Body as NodeJS.ReadableStream);
        },
        async delete(key) {
          await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
        },
        async exists(key) {
          try {
            await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
            return true;
          } catch {
            return false;
          }
        },
      };
    } catch (err) {
      logger.warn({ err }, "STORAGE_DRIVER=s3 but @aws-sdk/client-s3 missing — falling back to local storage.");
    }
  }
  logger.info({ dir: env.localStorageDir }, "Storage: local-disk driver active");
  return new LocalStorage(env.localStorageDir);
}

export const storage: StorageDriver = createStorage();
