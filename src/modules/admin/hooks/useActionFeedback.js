import { useCallback, useState } from 'react';

const INITIAL_FEEDBACK = { open: false, message: '', type: 'success' };

export function useActionFeedback() {
  const [feedback, setFeedback] = useState(INITIAL_FEEDBACK);

  const showFeedback = useCallback((message, type = 'success') => {
    setFeedback({ open: true, message, type });
  }, []);

  const closeFeedback = useCallback(() => {
    setFeedback((prev) => ({ ...prev, open: false }));
  }, []);

  return { feedback, showFeedback, closeFeedback };
}
