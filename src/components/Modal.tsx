import { useEffect, useRef, type ReactNode } from "react";
import Icon from "./Icon";
export default function Modal({
  title,
  children,
  onClose,
  full = false,
  onKeyDown,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  full?: boolean;
  onKeyDown?: (key: string) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const dialog = ref.current;
    dialog?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby="dialog-title"
      className={full ? "modal lightbox" : "modal"}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Tab") {
          const controls = [
            ...ref.current!.querySelectorAll<HTMLElement>(
              'button,a[href],input,[tabindex="0"]',
            ),
          ];
          const first = controls[0],
            last = controls.at(-1);
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
        onKeyDown?.(e.key);
      }}
    >
      <header className="modal-header">
        <h2 id="dialog-title">{title}</h2>
        <button
          className="icon-button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
      </header>
      {children}
    </dialog>
  );
}
