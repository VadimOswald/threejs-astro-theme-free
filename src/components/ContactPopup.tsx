import { useState, useEffect, useRef } from 'preact/hooks';

const TG_USERNAME = 'web_desigm';

export default function ContactPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener('open-contact', open);
    return () => window.removeEventListener('open-contact', open);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => firstInputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const modal = modalRef.current;
    const els = modal.querySelectorAll<HTMLElement>('input, textarea, button, [href], [tabindex]:not([tabindex="-1"])');
    const first = els[0], last = els[els.length - 1];
    const onTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
      else { if (document.activeElement === last) { e.preventDefault(); first.focus(); } }
    };
    modal.addEventListener('keydown', onTab);
    return () => modal.removeEventListener('keydown', onTab);
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    setName('');
    setMessage('');
    triggerRef.current?.focus();
  };

  const submit = (e: Event) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    const text = `💬 Contact from ${name}\n\n${message}`;
    window.open(`https://t.me/${TG_USERNAME}?text=${encodeURIComponent(text)}`, '_blank');
    close();
  };

  return (
    <>
      <div class={`popup__backdrop ${isOpen ? 'popup__backdrop--open' : ''}`} onClick={close} aria-hidden="true" />
      <div ref={modalRef} class={`popup ${isOpen ? 'popup--open' : ''}`} role="dialog" aria-modal="true" aria-label="Contact form" tabIndex={-1}>
        <button class="popup__close" onClick={close} aria-label="Close contact form">✕</button>
        <form class="popup__form" onSubmit={submit}>
          <h3 class="popup__title">Get in Touch</h3>
          <div class="popup__field">
            <label for="contact-name">Name <span class="required">*</span></label>
            <input ref={firstInputRef} id="contact-name" type="text" required placeholder="Your name" value={name} onInput={e => setName((e.target as HTMLInputElement).value)} />
          </div>
          <div class="popup__field">
            <label for="contact-message">Message <span class="required">*</span></label>
            <textarea id="contact-message" rows="4" required placeholder="Your message" value={message} onInput={e => setMessage((e.target as HTMLTextAreaElement).value)} />
          </div>
          <button class="popup__submit" type="submit">Send via Telegram</button>
        </form>
      </div>
    </>
  );
}
