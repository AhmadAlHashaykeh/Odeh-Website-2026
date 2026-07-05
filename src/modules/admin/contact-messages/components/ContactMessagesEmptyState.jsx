import { EmptyState } from '../../ui';

export default function ContactMessagesEmptyState() {
  return (
    <EmptyState
      variant="featured"
      icon="messages"
      title="No contact messages yet"
      description="Website inquiries will appear here once users submit the Reach Out contact form. When visitors reach out, you can review, organize, and respond to their messages from this inbox."
    />
  );
}
