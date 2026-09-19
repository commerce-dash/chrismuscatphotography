import { FormEvent, useState } from 'react';
import { SITE } from '../lib/site';
import { usePageMeta } from '../lib/usePageMeta';
import { Reveal } from '../components/Reveal';

/**
 * Minimal contact. The form composes a mailto: message — no backend —
 * and confirms inline rather than showing a corporate success panel.
 */
export function Contact() {
  usePageMeta({
    title: 'Contact',
    description: `Commissions and enquiries — contact ${SITE.name}, photographer, ${SITE.location}.`,
    path: '/contact',
  });

  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = `Enquiry — ${data.get('type')}`;
    const body = [
      `Name: ${data.get('name')}`,
      `Email: ${data.get('email')}`,
      `Project type: ${data.get('type')}`,
      '',
      String(data.get('message') ?? ''),
    ].join('\n');
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const field = 'field';
  return (
    <div className="contact">
      <Reveal>
        <h1 className="contact__title">
          Let&rsquo;s create<br />
          <em>something.</em>
        </h1>
      </Reveal>

      <div className="contact__grid">
        <Reveal className="contact__details">
          <dl>
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </dd>
            </div>
            <div>
              <dt>Instagram</dt>
              <dd>
                <a href={SITE.instagram} target="_blank" rel="noopener noreferrer">
                  {SITE.instagramHandle}
                </a>
              </dd>
            </div>
            <div>
              <dt>Studio</dt>
              <dd>{SITE.location}</dd>
            </div>
            <div>
              <dt>Availability</dt>
              <dd>Worldwide, by arrangement</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={80}>
          <form className="contact__form" onSubmit={onSubmit} aria-label="Project enquiry">
            <div className={field}>
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" autoComplete="name" required />
            </div>
            <div className={field}>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className={field}>
              <label htmlFor="type">Project Type</label>
              <select id="type" name="type" defaultValue="Portraits">
                <option>Urban</option>
                <option>Travel</option>
                <option>Portraits</option>
                <option>Events</option>
                <option>Animals</option>
                <option>Landscapes</option>
                <option>Commission</option>
                <option>Other</option>
              </select>
            </div>
            <div className={field}>
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={5} required />
            </div>
            <button type="submit" className="contact__submit">
              Send enquiry →
            </button>
            {sent && (
              <p className="contact__note" role="status">
                Your email client should open with the enquiry drafted. If it doesn&rsquo;t,
                write directly to {SITE.email}.
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </div>
  );
}
