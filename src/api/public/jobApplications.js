import { apiClient } from '../client';

/**
 * Submit a job application with CV upload.
 *
 * @param {string} slug - Job slug
 * @param {FormData} formData - multipart payload (fullName, email, phone, location, yearsOfExperience, linkedin, coverLetter, cv)
 * @returns {Promise<{ message: string }>}
 */
export async function submitJobApplication(slug, formData) {
  return apiClient.postMultipart(`/public/jobs/${slug}/applications`, formData, { auth: false });
}
