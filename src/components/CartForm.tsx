import { useState, useEffect, useRef } from 'preact/hooks';

const TG_USERNAME = 'web_desigm';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderForm {
  name: string;
  contact: string;
  message: string;
}

function buildTelegramUrl(items: CartItem[], form: OrderForm, total: number): string {
  const lines = [
    `🛒 New Order`,
    ``,
    ...items.map(i => `• ${i.name} ×${i.quantity} — $${i.price * i.quantity}`),
    ``,
    `Total: $${total}`,
    ``,
    `Name: ${form.name}`,
    `Contact: ${form.contact}`,
  ];
  if (form.message) lines.push(`Message: ${form.message}`);
  return `https://t.me/${TG_USERNAME}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export default function CartForm() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [form, setForm] = useState<OrderForm>({ name: '', contact: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const liveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onAdd = (e: Event) => {
      const p = (e as CustomEvent).detail;
      setItems(prev => {
        const ex = prev.find(i => i.id === p.id);
        return ex
          ? prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i)
          : [...prev, { ...p, quantity: 1 }];
      });
    };
    window.addEventListener('add-to-cart', onAdd);
    return () => window.removeEventListener('add-to-cart', onAdd);
  }, []);

  useEffect(() => {
    if (liveRef.current) {
      liveRef.current.textContent = items.length
        ? `${items.length} item${items.length > 1 ? 's' : ''} in cart`
        : 'Cart is empty';
    }
  }, [items]);

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const submit = (e: Event) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim()) {
      setStatus('error');
      return;
    }
    try {
      window.open(buildTelegramUrl(items, form, total), '_blank');
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <section class="order section" id="order">
        <div class="container">
          <h2 class="order__title">Your Order</h2>
          <div class="order__success">
            <p>Thank you! Telegram opened with your order details. Send the message and we'll get back to you shortly.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section class="order section" id="order">
      <div class="container">
        <h2 class="order__title">Your Order</h2>
        <div ref={liveRef} class="sr-only" aria-live="polite" aria-atomic="true" />

        {items.length === 0 ? (
          <p class="order__empty">No items selected yet. Choose your assets from the catalog above.</p>
        ) : (
          <div class="order__cart">
            <ul class="order__items">
              {items.map(item => (
                <li class="order__item" key={item.id}>
                  <span class="order__item-name">{item.name}</span>
                  <span class="order__item-price">${item.price * item.quantity}</span>
                  <button class="order__remove" onClick={() => setItems(p => p.filter(i => i.id !== item.id))} aria-label={`Remove ${item.name} from order`}>✕</button>
                </li>
              ))}
            </ul>
            <p class="order__total">Total: ${total}</p>
          </div>
        )}

        <form class="order__form" onSubmit={submit}>
          <div class="order__field">
            <label for="order-name">Name <span class="required">*</span></label>
            <input id="order-name" type="text" required placeholder="Your full name" value={form.name} onInput={e => setForm({ ...form, name: (e.target as HTMLInputElement).value })} />
          </div>
          <div class="order__field">
            <label for="order-contact">Email or Telegram <span class="required">*</span></label>
            <input id="order-contact" type="text" required placeholder="How can we reach you?" value={form.contact} onInput={e => setForm({ ...form, contact: (e.target as HTMLInputElement).value })} />
          </div>
          <div class="order__field">
            <label for="order-message">Message</label>
            <textarea id="order-message" rows="3" placeholder="Any special requests?" value={form.message} onInput={e => setForm({ ...form, message: (e.target as HTMLTextAreaElement).value })} />
          </div>
          {status === 'error' && <p class="order__error" role="alert">Please fill in all required fields.</p>}
          <button class="order__submit" type="submit">Submit Order</button>
        </form>
      </div>
    </section>
  );
}
