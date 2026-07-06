import { apiClient, ApiError } from './client';

/**
 * Submit a public contact / reach-out form message.
 *
 * @param {Object} payload
 * @param {string} payload.fullName
 * @param {string} payload.email
 * @param {string} payload.phone
 * @param {string} [payload.company]
 * @param {string} payload.subject
 * @param {string} payload.message
 * @returns {Promise<{ message: string }>}
 */
export async function submitContactForm(payload) {
  return apiClient.post('/public/contact', payload, { auth: false });
}

export { ApiError };
