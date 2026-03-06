import { useState } from 'react';
import type { FormEvent } from 'react';
import { subscribeToNewsletter } from '../newsletter';

type NewsletterProps = {
  businessId: string;
};

type Status = 'idle' | 'loading' | 'success' | 'error';

function Newsletter({ businessId }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailOptIn, setEmailOptIn] = useState(false);
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    if (!emailOptIn && !smsOptIn) {
      setStatus('error');
      setMessage('Please select at least one subscription option.');
      return;
    }
    if (smsOptIn && !phone) {
      setStatus('error');
      setMessage('Please provide a phone number to subscribe to SMS.');
      return;
    }
    if (emailOptIn && !email) {
      setStatus('error');
      setMessage('Please provide an email to subscribe to emails.');
      return;
    }

    const result = await subscribeToNewsletter({
      businessId,
      email: emailOptIn ? email : undefined,
      phoneNumber: smsOptIn ? phone : undefined,
      emailOptIn,
      smsOptIn,
    });

    if (result.success) {
      setStatus('success');
      setMessage('Thank you for subscribing!');
      setEmail('');
      setPhone('');
      setEmailOptIn(false);
      setSmsOptIn(false);
    } else {
      setStatus('error');
      setMessage(result.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="newsletter-form">
      <div className="form-group">
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email"
        />
      </div>
      <div className="form-group">
        <input
          type="tel"
          placeholder="Your Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-label="Phone Number"
        />
      </div>
      <div className="form-group-checkbox">
        <label>
          <input
            type="checkbox"
            checked={emailOptIn}
            onChange={(e) => setEmailOptIn(e.target.checked)}
          />
          Subscribe to Emails
        </label>
      </div>
      <div className="form-group-checkbox">
        <label>
          <input
            type="checkbox"
            checked={smsOptIn}
            onChange={(e) => setSmsOptIn(e.target.checked)}
          />
          Subscribe to SMS
        </label>
      </div>
      <button type="submit" className="btn" disabled={status === 'loading'}>
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
      {message && <p className={`form-message ${status}`}>{message}</p>}
    </form>
  );
}

export default Newsletter;