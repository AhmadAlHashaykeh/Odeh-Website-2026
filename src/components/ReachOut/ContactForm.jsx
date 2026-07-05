import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitContactForm } from '../../api/contact';
import styles from './ContactForm.module.css';

const INITIAL_FORM = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  subject: '',
  message: '',
};

const PHONE_PATTERN = /^\+?[\d\s().-]{7,20}$/;

function validateForm(values) {
  const errors = {};

  if (!values.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = 'Enter a valid phone number.';
  }

  if (!values.subject.trim()) {
    errors.subject = 'Subject is required.';
  }

  if (!values.message.trim()) {
    errors.message = 'Message is required.';
  }

  return errors;
}

function FormField({ id, label, required = false, optional = false, error, children }) {
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
        {optional && <span className={styles.optional}>(optional)</span>}
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

export default function ContactForm({ label, heading, description, submitLabel }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      await submitContactForm({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        company: form.company.trim() || undefined,
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      navigate('/thank-you?from=contact');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formColumn}>
      <div className={styles.formHeader}>
        {label && <span className="section-label">{label}</span>}
        <h2 className={styles.heading}>{heading}</h2>
        <p className={styles.formDesc}>{description}</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
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

            <FormField id="company" label="Company" optional error={errors.company}>
              {(errorId) => (
                <input
                  id="company"
                  type="text"
                  value={form.company}
                  onChange={handleChange('company')}
                  className={styles.input}
                  autoComplete="organization"
                  aria-describedby={errorId}
                />
              )}
            </FormField>
          </div>

          <FormField id="subject" label="Subject" required error={errors.subject}>
            {(errorId) => (
              <input
                id="subject"
                type="text"
                value={form.subject}
                onChange={handleChange('subject')}
                className={styles.input}
                aria-invalid={Boolean(errors.subject)}
                aria-describedby={errorId}
              />
            )}
          </FormField>

          <div className={styles.messageField}>
            <FormField id="message" label="Message" required error={errors.message}>
              {(errorId) => (
                <textarea
                  id="message"
                  value={form.message}
                  onChange={handleChange('message')}
                  className={styles.textarea}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errorId}
                />
              )}
            </FormField>
          </div>

          <div className={styles.actions}>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : submitLabel}
            </button>
          </div>
        </form>
    </div>
  );
}
