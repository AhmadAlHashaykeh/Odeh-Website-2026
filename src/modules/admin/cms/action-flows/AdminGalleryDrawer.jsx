import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '../../../../api/client';
import { uploadImage } from '../../../../api/uploads';
import { resolveMediaPath, resolveMediaUrl } from '../../../../utils/mediaUrl';
import { Drawer, Button } from '../../ui';
import AdminIcon from '../../components/AdminIcons';
import styles from './AdminGalleryDrawer.module.css';

const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp,image/avif';

function formatUploadError(error) {
  if (error instanceof ApiError) {
    return error.message;
  }

  return 'Image upload failed. Please try again.';
}

export default function AdminGalleryDrawer({
  open,
  onClose,
  title = 'Manage Gallery',
  coverImage: initialCoverImage,
  gallery: initialGallery = [],
  itemLabel,
  uploadModule = 'projects',
  onSave,
  submitting = false,
}) {
  const fileInputRef = useRef(null);
  const [coverImage, setCoverImage] = useState(() => resolveMediaPath(initialCoverImage));
  const [coverPreviewUrl, setCoverPreviewUrl] = useState(() => resolveMediaUrl(initialCoverImage));
  const [gallery, setGallery] = useState(() =>
    (Array.isArray(initialGallery) ? initialGallery : []).map((image) => ({
      ...image,
      src: resolveMediaPath(image),
      url: resolveMediaUrl(image),
    })),
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setCoverImage(resolveMediaPath(initialCoverImage));
    setCoverPreviewUrl(resolveMediaUrl(initialCoverImage));
    setGallery(
      (Array.isArray(initialGallery) ? initialGallery : []).map((image) => ({
        ...image,
        src: resolveMediaPath(image),
        url: resolveMediaUrl(image),
      })),
    );
    setError('');
  }, [open, initialCoverImage, initialGallery]);

  const images = gallery.length > 0
    ? gallery
    : coverImage
      ? [{ src: coverImage, alt: 'Cover' }]
      : [];

  const saveDisabled = submitting || uploading;

  const uploadFiles = useCallback(
    async (files) => {
      if (!files.length) return;

      setError('');
      setUploading(true);

      try {
        const uploaded = [];

        for (const file of files) {
          const result = await uploadImage(file, uploadModule, 'gallery');
          uploaded.push({ src: result.path, url: result.url, alt: '' });
        }

        setGallery((current) => [...current, ...uploaded]);
      } catch (uploadError) {
        setError(formatUploadError(uploadError));
      } finally {
        setUploading(false);
      }
    },
    [uploadModule],
  );

  const handleCoverReplace = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      event.target.value = '';

      if (!file) return;

      setError('');
      setUploading(true);

      try {
        const result = await uploadImage(file, uploadModule, 'coverImage');
        setCoverImage(result.path);
        setCoverPreviewUrl(result.url);
      } catch (uploadError) {
        setError(formatUploadError(uploadError));
      } finally {
        setUploading(false);
      }
    },
    [uploadModule],
  );

  const handleAddImages = useCallback(
    async (event) => {
      const files = Array.from(event.target.files || []);
      event.target.value = '';
      await uploadFiles(files);
    },
    [uploadFiles],
  );

  const handleRemove = useCallback((index) => {
    setGallery((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }, []);

  const handleSetCover = useCallback((index) => {
    const image = gallery[index];
    if (!image?.src) return;
    setCoverImage(image.src);
  }, [gallery]);

  const handleSave = useCallback(() => {
    onSave?.({
      coverImage,
      gallery,
    });
  }, [coverImage, gallery, onSave]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size="large"
      stickyHeader
      stickyFooter
      title={title}
      footer={(
        <>
          <Button variant="secondary" onClick={onClose} disabled={saveDisabled}>
            Cancel
          </Button>
          <Button
            variant="primary"
            icon={<AdminIcon name="check" size={16} />}
            onClick={handleSave}
            loading={submitting}
            disabled={saveDisabled}
          >
            {uploading ? 'Uploading…' : 'Save Gallery'}
          </Button>
        </>
      )}
    >
      {itemLabel && (
        <p className={styles.subtitle}>
          Managing gallery for <strong>{itemLabel}</strong>
        </p>
      )}

      {error && <p className={styles.errorNotice}>{error}</p>}

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Cover Image</h3>
        {coverPreviewUrl || coverImage ? (
          <div className={styles.coverWrap}>
            <img src={coverPreviewUrl || resolveMediaUrl(coverImage)} alt="Cover" className={styles.cover} />
            <span className={styles.coverBadge}>
              <AdminIcon name="star" size={12} />
              Current Cover
            </span>
          </div>
        ) : (
          <div className={styles.emptyCover}>
            <AdminIcon name="images" size={24} />
            <span>No cover image set</span>
          </div>
        )}
        <div className={styles.placeholderActions}>
          <label className={styles.placeholderBtnInteractive}>
            <AdminIcon name="upload" size={14} />
            {uploading ? 'Uploading…' : 'Replace Cover'}
            <input
              type="file"
              accept={ACCEPTED_TYPES}
              className={styles.hiddenInput}
              onChange={handleCoverReplace}
              disabled={saveDisabled}
            />
          </label>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Gallery Images</h3>
          <span className={styles.count}>{gallery.length} images</span>
        </div>

        <div className={styles.grid}>
          {gallery.map((image, index) => (
            <div key={`${image.src}-${index}`} className={styles.item}>
              <div className={styles.thumb}>
                <img src={resolveMediaUrl(image)} alt={image.alt || `Image ${index + 1}`} />
              </div>
              <div className={styles.itemActions}>
                <button
                  type="button"
                  className={styles.itemBtnInteractive}
                  onClick={() => handleSetCover(index)}
                  disabled={saveDisabled}
                >
                  <AdminIcon name="star" size={12} />
                  Set Cover
                </button>
                <button
                  type="button"
                  className={`${styles.itemBtnInteractive} ${styles.removeBtn}`}
                  onClick={() => handleRemove(index)}
                  disabled={saveDisabled}
                >
                  <AdminIcon name="trash" size={12} />
                  Remove
                </button>
              </div>
            </div>
          ))}

          <label className={`${styles.addPlaceholder} ${styles.addPlaceholderInteractive}`}>
            <AdminIcon name="add" size={24} />
            <span>{uploading ? 'Uploading…' : 'Add Image'}</span>
            <span className={styles.addHint}>JPG, PNG, or WebP up to 5MB</span>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES}
              multiple
              className={styles.hiddenInput}
              onChange={handleAddImages}
              disabled={saveDisabled}
            />
          </label>
        </div>
      </section>

      <p className={styles.notice}>
        <AdminIcon name="external" size={14} />
        Uploaded images are converted to WebP and saved when you click Save Gallery.
      </p>
    </Drawer>
  );
}
