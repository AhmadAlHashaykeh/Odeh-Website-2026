import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { getJobApplyThankYouPath, getJobPath } from '../../data/careers';
import styles from './JobApplicationForm.module.css';

const ACCEPTED_CV_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const ACCEPTED_CV_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const MAX_CV_SIZE = 5 * 1024 * 1024;

const INITIAL_FORM = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  yearsOfExperience: '',
  linkedin: '',
  coverLetter: '',
};

function validateForm(values, cvFile) {
  const errors = {};

  if (!values.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!values.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.phone.trim()) errors.phone = 'Phone number is required.';
  if (!values.location.trim()) errors.location = 'Current location is required.';

  if (!values.yearsOfExperience.trim()) {
    errors.yearsOfExperience = 'Years of experience is required.';
  } else if (Number.isNaN(Number(values.yearsOfExperience)) || Number(values.yearsOfExperience) < 0) {
    errors.yearsOfExperience = 'Enter a valid number of years.';
  }

  if (!values.linkedin.trim()) {
    errors.linkedin = 'LinkedIn profile URL is required.';
  } else if (!/^https?:\/\/.+/i.test(values.linkedin.trim())) {
    errors.linkedin = 'Enter a valid URL starting with http:// or https://.';
  }

  if (!values.coverLetter.trim()) errors.coverLetter = 'Cover letter is required.';

  if (!cvFile) {
    errors.cv = 'Please upload your CV.';
  } else {
    const extension = cvFile.name.slice(cvFile.name.lastIndexOf('.')).toLowerCase();
    const typeValid = ACCEPTED_CV_TYPES.includes(cvFile.type) || ACCEPTED_CV_EXTENSIONS.includes(extension);

    if (!typeValid) {
      errors.cv = 'Accepted formats: PDF, DOC, DOCX.';
    } else if (cvFile.size > MAX_CV_SIZE) {
      errors.cv = 'File size must not exceed 5MB.';
    }
  }

  return errors;
}

function FormField({ id, label, required = false, error, children }) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        )}
        {required && <span className={styles.srOnly}> (required)</span>}
      </label>
      {children(errorId)}
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function FormSection({ title, description, children }) {
  const sectionId = title.replace(/\s+/g, '-').toLowerCase();

  return (
    <section className={styles.section} aria-labelledby={sectionId}>
      <div className={styles.sectionHeader}>
        <h2 id={sectionId} className={styles.sectionTitle}>
          {title}
        </h2>
        {description && <p className={styles.sectionDesc}>{description}</p>}
      </div>
      {children}
    </section>
  );
}

export default function JobApplicationForm({ job }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [cvFile, setCvFile] = useState(null);
  const [cvName, setCvName] = useState('');
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const sectionRef = useScrollReveal(0.08);
  const navigate = useNavigate();

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setCvFile(file);
    setCvName(file?.name ?? '');
    if (errors.cv) {
      setErrors((current) => {
        const next = { ...current };
        delete next.cv;
        return next;
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateForm(form, cvFile);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      navigate(getJobApplyThankYouPath(job), { replace: true, state: { submitted: true } });
    }
  };

  return (
    <section className={styles.formSection} aria-label={`Application form for ${job.title}`}>
      <div className="container">
        <div ref={sectionRef} className={`${styles.wrapper} reveal`}>
          <form className={styles.panel} onSubmit={handleSubmit} noValidate>
            <FormSection title="Personal Information" description="Your contact details for follow-up.">
              <div className={styles.grid}>
                <FormField id="fullName" label="Full Name" required error={errors.fullName}>
                  {(errorId) => (
                    <input
                      id="fullName"
                      type="text"
                      value={form.fullName}
                      onChange={handleChange('fullName')}
                      className={styles.input}
                      autoComplete="name"
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={errorId}
                    />
                  )}
                </FormField>

                <FormField id="email" label="Email Address" required error={errors.email}>
                  {(errorId) => (
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange('email')}
                      className={styles.input}
                      autoComplete="email"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errorId}
                    />
                  )}
                </FormField>

                <FormField id="phone" label="Phone Number" required error={errors.phone}>
                  {(errorId) => (
                    <input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange('phone')}
                      className={styles.input}
                      autoComplete="tel"
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errorId}
                    />
                  )}
                </FormField>

                <FormField id="location" label="Current Location" required error={errors.location}>
                  {(errorId) => (
                    <input
                      id="location"
                      type="text"
                      value={form.location}
                      onChange={handleChange('location')}
                      className={styles.input}
                      autoComplete="address-level2"
                      aria-invalid={Boolean(errors.location)}
                      aria-describedby={errorId}
                    />
                  )}
                </FormField>
              </div>
            </FormSection>

            <FormSection
              title="Professional Profile"
              description="Share your experience and LinkedIn profile."
            >
              <div className={styles.grid}>
                <FormField
                  id="yearsOfExperience"
                  label="Years of Experience"
                  required
                  error={errors.yearsOfExperience}
                >
                  {(errorId) => (
                    <input
                      id="yearsOfExperience"
                      type="number"
                      min="0"
                      step="0.5"
                      value={form.yearsOfExperience}
                      onChange={handleChange('yearsOfExperience')}
                      className={styles.input}
                      aria-invalid={Boolean(errors.yearsOfExperience)}
                      aria-describedby={errorId}
                    />
                  )}
                </FormField>

                <FormField id="linkedin" label="LinkedIn Profile URL" required error={errors.linkedin}>
                  {(errorId) => (
                    <input
                      id="linkedin"
                      type="url"
                      value={form.linkedin}
                      onChange={handleChange('linkedin')}
                      className={styles.input}
                      placeholder="https://linkedin.com/in/your-profile"
                      aria-invalid={Boolean(errors.linkedin)}
                      aria-describedby={errorId}
                    />
                  )}
                </FormField>
              </div>
            </FormSection>

            <FormSection title="Your Application" description="Tell us why you are a strong fit for this role.">
              <FormField id="coverLetter" label="Cover Letter / Message" required error={errors.coverLetter}>
                {(errorId) => (
                  <textarea
                    id="coverLetter"
                    value={form.coverLetter}
                    onChange={handleChange('coverLetter')}
                    className={styles.textarea}
                    rows={6}
                    aria-invalid={Boolean(errors.coverLetter)}
                    aria-describedby={errorId}
                  />
                )}
              </FormField>

              <div className={styles.field}>
                <span id="cv-label" className={styles.label}>
                  CV Upload
                  <span className={styles.required} aria-hidden="true">
                    *
                  </span>
                  <span className={styles.srOnly}> (required)</span>
                </span>

                <div
                  className={`${styles.fileDropzone} ${errors.cv ? styles.fileDropzoneError : ''} ${cvName ? styles.fileDropzoneFilled : ''}`}
                >
                  <input
                    ref={fileInputRef}
                    id="cv"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                    aria-labelledby="cv-label"
                    aria-describedby={errors.cv ? 'cv-error cv-hint' : 'cv-hint'}
                    aria-invalid={Boolean(errors.cv)}
                  />

                  <div className={styles.fileContent}>
                    <p className={styles.fileTitle}>{cvName || 'Upload your CV'}</p>
                    <p id="cv-hint" className={styles.fileHint}>
                      PDF, DOC, or DOCX — maximum 5MB
                    </p>
                  </div>

                  <button
                    type="button"
                    className={styles.fileBtn}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {cvName ? 'Change file' : 'Choose file'}
                  </button>
                </div>

                {errors.cv && (
                  <p id="cv-error" className={styles.error} role="alert">
                    {errors.cv}
                  </p>
                )}
              </div>
            </FormSection>

            <div className={styles.actions}>
              <Link to={getJobPath(job)} className="btn btn-secondary">
                Back to Role
              </Link>
              <button type="submit" className="btn btn-primary">
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
