import { apiClient } from '../client';

export interface ImageUploadResult {
  path: string;
  filename: string;
  mimeType: string;
  size: number;
}

interface ImageUploadResponse {
  data: ImageUploadResult;
}

export async function uploadImage(
  file: File,
  module: string,
  field: string,
): Promise<ImageUploadResult> {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('module', module);
  formData.append('field', field);

  const response = await apiClient.postMultipart<ImageUploadResponse>(
    '/api/admin/uploads/image',
    formData,
  );

  return response.data;
}
