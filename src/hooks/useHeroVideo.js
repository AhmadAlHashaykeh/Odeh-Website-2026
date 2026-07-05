import { useEffect, useRef, useState } from 'react';

export function useHeroVideo() {
  const videoElRef = useRef(null);
  const activatedRef = useRef(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const video = videoElRef.current;
    if (!video || videoFailed) return;

    let cancelled = false;

    const activateVideo = () => {
      if (cancelled || activatedRef.current) return;
      activatedRef.current = true;

      const reveal = () => {
        if (!cancelled) setVideoReady(true);
      };

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(reveal).catch(reveal);
      } else {
        reveal();
      }
    };

    const onError = () => {
      if (!cancelled) setVideoFailed(true);
    };

    const onCanPlayThrough = () => activateVideo();

    video.addEventListener('canplaythrough', onCanPlayThrough, { once: true });
    video.addEventListener('error', onError, { once: true });

    video.load();

    if (video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
      activateVideo();
    }

    return () => {
      cancelled = true;
      video.removeEventListener('canplaythrough', onCanPlayThrough);
      video.removeEventListener('error', onError);
    };
  }, [videoFailed]);

  return { videoElRef, videoReady, videoFailed };
}
