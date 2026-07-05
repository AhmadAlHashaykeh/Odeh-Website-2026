import { useState, useCallback } from 'react';

export default function useDrawer(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen);

  const openDrawer = useCallback(() => setOpen(true), []);
  const closeDrawer = useCallback(() => setOpen(false), []);
  const toggleDrawer = useCallback(() => setOpen((prev) => !prev), []);

  return { open, openDrawer, closeDrawer, toggleDrawer, setOpen };
}
