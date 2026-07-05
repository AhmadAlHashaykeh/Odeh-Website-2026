import { GalleryLightbox } from '../Gallery';

export default function OfficeGalleryLightbox(props) {
  return (
    <GalleryLightbox
      {...props}
      enableZoom={false}
      ariaLabel="Office gallery viewer"
    />
  );
}
