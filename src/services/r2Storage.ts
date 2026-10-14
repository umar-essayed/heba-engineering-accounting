import { CaseDocument, CloudflareR2Config } from '../types';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const DEFAULT_R2_CONFIG: CloudflareR2Config = {
  accountId: "07079473a194adefc9183b88f04405f4",
  bucketName: "heba",
  accessKeyId: "79293b8f51176945e72d3951bac3d4c5",
  secretAccessKey: "05162cf1e7be1da083b83579a20987a737905fc9bd59a34c834d0960be6ab6da",
  publicUrl: "https://07079473a194adefc9183b88f04405f4.r2.cloudflarestorage.com/heba",
  enabled: true
};

// Format bytes into readable format (KB, MB)
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Convert file to base64 for persistent local offline storage
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * Upload document to Cloudflare R2 bucket with automatic offline base64 fallback.
 */
export async function uploadDocument(
  file: File,
  meta: {
    title?: string;
    notes?: string;
    caseCode?: string;
    r2Config?: CloudflareR2Config;
  }
): Promise<CaseDocument> {
  const fileDataUrl = await fileToBase64(file);
  const docId = `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const uploadDate = new Date().toISOString().split('T')[0];

  let fileUrl = fileDataUrl;
  let isUploadedToR2 = false;

  const cfg = meta.r2Config || DEFAULT_R2_CONFIG;

  // If R2 credentials are valid and enabled, attempt upload to bucket
  if (cfg.enabled && cfg.accountId && cfg.bucketName && cfg.accessKeyId && cfg.secretAccessKey) {
    try {
      const sanitizedFileName = file.name.replace(/[^\w.-]/gi, '_');
      const s3Key = `${meta.caseCode || 'general'}/${Date.now()}_${sanitizedFileName}`;

      const s3 = new S3Client({
        region: 'auto',
        endpoint: `https://${cfg.accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: cfg.accessKeyId,
          secretAccessKey: cfg.secretAccessKey
        }
      });

      const fileBuffer = await file.arrayBuffer();

      await s3.send(
        new PutObjectCommand({
          Bucket: cfg.bucketName,
          Key: s3Key,
          Body: new Uint8Array(fileBuffer),
          ContentType: file.type || 'application/octet-stream'
        })
      );

      isUploadedToR2 = true;
      if (cfg.publicUrl && cfg.publicUrl.trim()) {
        fileUrl = `${cfg.publicUrl.replace(/\/+$/, '')}/${s3Key}`;
      } else {
        fileUrl = `https://${cfg.accountId}.r2.cloudflarestorage.com/${cfg.bucketName}/${s3Key}`;
      }
      console.log('✅ File successfully uploaded to Cloudflare R2:', s3Key);
    } catch (err) {
      console.warn('⚠️ Cloudflare R2 direct browser upload note (CORS or network). Using persistent base64 store:', err);
      // fallback to fileDataUrl
      fileUrl = fileDataUrl;
    }
  }

  const doc: CaseDocument = {
    id: docId,
    title: meta.title?.trim() || file.name.replace(/\.[^/.]+$/, ''),
    type: file.type || 'application/pdf',
    fileName: file.name,
    fileSize: formatFileSize(file.size),
    uploadDate: uploadDate,
    fileUrl: fileUrl,
    notes: meta.notes?.trim() || (isUploadedToR2 ? 'تم الرفع لسحابة Cloudflare R2' : '')
  };

  return doc;
}
