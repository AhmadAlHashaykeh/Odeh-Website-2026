import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ApiError } from '../../../api/client';
import { useAuth } from '../../../context/AuthContext';
import Button from '../ui/components/Button';
import Form, { FormActions } from '../ui/components/Form';
import Input from '../ui/components/Input';
import '../ui/styles/admin-ui.css';
import styles from './LoginPage.module.css';

function getFieldError(errors, field) {
  if (!errors?.[field]?.length) {
    return undefined;
  }

  return errors[field][0];
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFieldErrors({});
    setFormError('');
    setSubmitting(true);

    try {
      await login(email.trim(), password);
      const redirectPath = location.state?.from?.pathname ?? '/admin/dashboard';
      navigate(redirectPath, { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.errors) {
          setFieldErrors(error.errors);
        } else {
          setFormError(error.message);
        }
      } else {
        setFormError('Unable to sign in right now. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page} data-admin-layout>
      <div className={styles.panel}>
        <div className={styles.brand}>
          <img src="/odeh-logo2.png" alt="ODEH" className={styles.logo} />
          <div>
            <h1 className={styles.title}>Admin CMS</h1>
            <p className={styles.subtitle}>Sign in to manage website content</p>
          </div>
        </div>

        <Form onSubmit={handleSubmit} className={styles.form}>
          {formError && (
            <div className={styles.formError} role="alert">
              {formError}
            </div>
          )}

          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={getFieldError(fieldErrors, 'email')}
            disabled={submitting}
          />

          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={getFieldError(fieldErrors, 'password')}
            disabled={submitting}
          />

          <FormActions className={styles.actions}>
            <Button type="submit" loading={submitting} disabled={submitting}>
              Sign in
            </Button>
          </FormActions>
        </Form>
      </div>
    </div>
  );
}
