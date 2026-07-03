export interface UploadObject {
  key: string;
  body: ReadableStream | ArrayBuffer | string;
  contentType: string;
}

export async function putObject(bucket: R2Bucket, object: UploadObject) {
  await bucket.put(object.key, object.body, {
    httpMetadata: {
      contentType: object.contentType,
    },
  });
  return object.key;
}
