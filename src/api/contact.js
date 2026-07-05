/**
 * Contact form submission — prepared for future API integration.
 *
 * @param {Object} payload
 * @param {string} payload.fullName
 * @param {string} payload.email
 * @param {string} payload.phone
 * @param {string} [payload.company]
 * @param {string} payload.subject
 * @param {string} payload.message
 * @returns {Promise<{ success: boolean }>}
 */
export async function submitContactForm(payload) {
  // TODO: Replace with real endpoint when backend is available.
  // Example:
  // const response = await fetch('/api/contact', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // if (!response.ok) throw new Error('Submission failed');
  // return response.json();

  void payload;
  return Promise.resolve({ success: true });
}
