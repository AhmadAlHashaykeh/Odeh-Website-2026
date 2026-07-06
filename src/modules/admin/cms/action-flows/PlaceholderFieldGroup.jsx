import { useCallback, useId, useRef, useState } from 'react';
import { ApiError } from '../../../../api/client';
import { uploadImage } from '../../../../api/uploads';
import AdminIcon from '../../components/AdminIcons';
import styles from './PlaceholderFieldGroup.module.css';

const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp,image/avif';

function formatUploadError(error) {
  if (error instanceof ApiError) {
    return error.message;
  }

  return 'Image upload failed. Please try again.';
}

export function ImagePlaceholder({ label, compact = false, onClick, uploading = false, error }) {
  const clickable = typeof onClick === 'function';

  return (
    <div className={styles.group}>
      {label && <span className={styles.label}>{label}</span>}
      <button
        type="button"
        className={`${styles.placeholder} ${compact ? styles.placeholderCompact : ''} ${clickable ? styles.placeholderClickable : ''}`}
        onClick={onClick}
        disabled={!clickable || uploading}
      >
        <AdminIcon name={uploading ? 'refresh' : 'upload'} size={22} />
        <span className={styles.placeholderText}>
          {uploading ? 'Uploading image…' : 'Click to upload image'}
        </span>
        {!uploading && (
          <span className={styles.placeholderHint}>JPG, PNG, or WebP up to 5MB</span>
        )}
      </button>
      {error && <span className={styles.fieldError}>{error}</span>}
    </div>
  );
}

export function CoverImageField({
  label = 'Cover Image',
  name,
  src: initialSrc = '',
  alt,
  uploadModule,
  uploadField,
  disabled = false,
  onUploadingChange,
  onChange,
}) {
  const inputId = useId();
  const fileInputRef = useRef(null);
  const [src, setSrc] = useState(initialSrc || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const canUpload = Boolean(uploadModule && uploadField) && !disabled;

  const updateSrc = useCallback(
    (nextSrc) => {
      setSrc(nextSrc);
      onChange?.(nextSrc);
    },
    [onChange],
  );

  const setUploadState = useCallback(
    (isUploading) => {
      setUploading(isUploading);
      onUploadingChange?.(isUploading);
    },
    [onUploadingChange],
  );

  const openFilePicker = useCallback(() => {
    if (!canUpload || uploading) return;
    fileInputRef.current?.click();
  }, [canUpload, uploading]);

  const handleFileChange = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      event.target.value = '';

      if (!file || !canUpload) return;

      setError('');
      setUploadState(true);

      try {
        const result = await uploadImage(file, uploadModule, uploadField);
        updateSrc(result.path);
      } catch (uploadError) {
        setError(formatUploadError(uploadError));
      } finally {
        setUploadState(false);
      }
    },
    [canUpload, setUploadState, updateSrc, uploadField, uploadModule],
  );

  const handleRemove = useCallback(() => {
    if (disabled || uploading) return;
    setError('');
    updateSrc('');
  }, [disabled, uploading, updateSrc]);

  return (
    <div className={styles.group}>
      <span className={styles.label}>{label}</span>
      {src ? (
        <button
          type="button"
          className={`${styles.preview} ${styles.coverPreview} ${canUpload ? styles.previewClickable : ''}`}
          onClick={openFilePicker}
          disabled={!canUpload || uploading}
          aria-label={`Replace ${label}`}
        >
          <img src={src} alt={alt || label} />
        </button>
      ) : (
        <ImagePlaceholder onClick={canUpload ? openFilePicker : undefined} uploading={uploading} error={error} />
      )}
      {src && error && <span className={styles.fieldError}>{error}</span>}
      {canUpload && (
        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          accept={ACCEPTED_TYPES}
          className={styles.fileInput}
          onChange={handleFileChange}
          disabled={disabled || uploading}
          tabIndex={-1}
        />
      )}
      {name && <input type="hidden" name={name} value={src} />}
      <div className={styles.actions}>
        {canUpload && (
          <button
            type="button"
            className={styles.actionBtnInteractive}
            onClick={openFilePicker}
            disabled={disabled || uploading}
          >
            <AdminIcon name="upload" size={12} />
            {uploading ? 'Uploading…' : 'Replace'}
          </button>
        )}
        {(src || canUpload) && (
          <button
            type="button"
            className={`${styles.actionBtnInteractive} ${styles.actionBtnDanger}`}
            onClick={handleRemove}
            disabled={disabled || uploading || !src}
          >
            <AdminIcon name="trash" size={12} />
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

export function GalleryPlaceholder({
  label = 'Gallery',
  name,
  images: initialImages = [],
  maxPreview = 4,
  uploadModule,
  uploadField = 'gallery',
  disabled = false,
  onUploadingChange,
  onChange,
}) {
  const fileInputRef = useRef(null);
  const [images, setImages] = useState(Array.isArray(initialImages) ? initialImages : []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const canUpload = Boolean(uploadModule && uploadField) && !disabled;
  const preview = images.slice(0, maxPreview);

  const updateImages = useCallback(
    (nextImages) => {
      setImages(nextImages);
      onChange?.(nextImages);
    },
    [onChange],
  );

  const setUploadState = useCallback(
    (isUploading) => {
      setUploading(isUploading);
      onUploadingChange?.(isUploading);
    },
    [onUploadingChange],
  );

  const openFilePicker = useCallback(() => {
    if (!canUpload || uploading) return;
    fileInputRef.current?.click();
  }, [canUpload, uploading]);

  const handleFilesChange = useCallback(
    async (event) => {
      const files = Array.from(event.target.files || []);
      event.target.value = '';

      if (files.length === 0 || !canUpload) return;

      setError('');
      setUploadState(true);

      try {
        const uploaded = [];

        for (const file of files) {
          const result = await uploadImage(file, uploadModule, uploadField);
          uploaded.push({ src: result.path, alt: '' });
        }

        updateImages([...images, ...uploaded]);
      } catch (uploadError) {
        setError(formatUploadError(uploadError));
      } finally {
        setUploadState(false);
      }
    },
    [canUpload, images, setUploadState, updateImages, uploadField, uploadModule],
  );

  const handleRemoveAt = useCallback(
    (index) => {
      if (disabled || uploading) return;
      updateImages(images.filter((_, itemIndex) => itemIndex !== index));
    },
    [disabled, images, updateImages, uploading],
  );

  return (
    <div className={styles.group}>
      <span className={styles.label}>{label}</span>
      {preview.length > 0 ? (
        <div className={styles.galleryGrid}>
          {preview.map((image, index) => (
            <div key={`${image.src}-${index}`} className={styles.galleryThumb}>
              <img src={image.src} alt={image.alt || `Gallery ${index + 1}`} />
              {canUpload && (
                <button
                  type="button"
                  className={styles.galleryRemoveBtn}
                  onClick={() => handleRemoveAt(index)}
                  disabled={disabled || uploading}
                  aria-label={`Remove gallery image ${index + 1}`}
                >
                  <AdminIcon name="trash" size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <ImagePlaceholder
          compact
          onClick={canUpload ? openFilePicker : undefined}
          uploading={uploading}
          error={error}
        />
      )}
      {preview.length > 0 && error && <span className={styles.fieldError}>{error}</span>}
      {name && (
        <input type="hidden" name={name} value={JSON.stringify(images)} />
      )}
      {canUpload && (
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          multiple
          className={styles.fileInput}
          onChange={handleFilesChange}
          disabled={disabled || uploading}
          tabIndex={-1}
        />
      )}
      <div className={styles.actions}>
        {canUpload && (
          <button
            type="button"
            className={styles.actionBtnInteractive}
            onClick={openFilePicker}
            disabled={disabled || uploading}
          >
            <AdminIcon name="add" size={12} />
            {uploading ? 'Uploading…' : 'Add Images'}
          </button>
        )}
        {images.length > 0 && (
          <span className={styles.galleryCount}>{images.length} image(s)</span>
        )}
      </div>
    </div>
  );
}

export default function PlaceholderFieldGroup({ type, ...props }) {
  if (type === 'cover') return <CoverImageField {...props} />;
  if (type === 'gallery') return <GalleryPlaceholder {...props} />;
  return <ImagePlaceholder {...props} />;
}
