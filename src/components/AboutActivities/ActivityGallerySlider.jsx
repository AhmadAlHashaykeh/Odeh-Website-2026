import { GallerySlider } from '../Gallery';

export default function ActivityGallerySlider({ gallery, activityTitle }) {
  return (
    <GallerySlider
      gallery={gallery}
      title={activityTitle}
      ariaLabel={`${activityTitle} photo gallery`}
    />
  );
}
