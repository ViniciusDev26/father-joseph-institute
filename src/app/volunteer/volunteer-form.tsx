'use client';

import { useState } from 'react';
import { registerVolunteer } from './actions';

type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

const WEEKDAYS: Weekday[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

interface VolunteerFormProps {
  content: {
    form: {
      name: string;
      namePlaceholder: string;
      profession: string;
      professionPlaceholder: string;
      availability: string;
      days: string;
      startTime: string;
      endTime: string;
      submit: string;
      submitting: string;
    };
    days: Record<string, string>;
    success: { title: string; description: string; button: string };
    error: string;
  };
}

export function VolunteerForm({ content: c }: VolunteerFormProps) {
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [selectedDays, setSelectedDays] = useState<Weekday[]>([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  function toggleDay(day: Weekday) {
    setSelectedDays(prev => (prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await registerVolunteer({
      name,
      profession,
      availability: { days: selectedDays, startTime, endTime },
    });

    setSubmitting(false);

    if (result.success) {
      setWhatsappUrl(result.whatsappUrl);
    } else {
      setError(result.message);
    }
  }

  if (whatsappUrl) {
    return (
      <div className="rounded-2xl border border-sage/30 bg-sage-light p-8 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-sage/20">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-sage"
            aria-hidden="true"
          >
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="font-display text-2xl font-semibold text-bark">{c.success.title}</h3>
        <p className="mx-auto mt-3 max-w-sm text-bark-light">{c.success.description}</p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-full bg-terracotta px-8 py-3 font-medium text-cream transition-colors hover:bg-terracotta-dark"
        >
          {c.success.button}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="volunteer-name" className="mb-1.5 block text-sm font-medium text-bark">
          {c.form.name}
        </label>
        <input
          id="volunteer-name"
          type="text"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={c.form.namePlaceholder}
          className="w-full rounded-xl border border-bark/15 bg-cream px-4 py-3 text-bark placeholder:text-bark-light/50 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
        />
      </div>

      {/* Profession */}
      <div>
        <label
          htmlFor="volunteer-profession"
          className="mb-1.5 block text-sm font-medium text-bark"
        >
          {c.form.profession}
        </label>
        <input
          id="volunteer-profession"
          type="text"
          required
          value={profession}
          onChange={e => setProfession(e.target.value)}
          placeholder={c.form.professionPlaceholder}
          className="w-full rounded-xl border border-bark/15 bg-cream px-4 py-3 text-bark placeholder:text-bark-light/50 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
        />
      </div>

      {/* Availability */}
      <fieldset>
        <legend className="mb-3 text-sm font-medium text-bark">{c.form.availability}</legend>

        {/* Days */}
        <p className="mb-2 text-xs text-bark-light">{c.form.days}</p>
        <div className="flex flex-wrap gap-2">
          {WEEKDAYS.map(day => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                selectedDays.includes(day)
                  ? 'border-terracotta bg-terracotta text-cream'
                  : 'border-bark/15 bg-cream text-bark hover:border-terracotta/50'
              }`}
            >
              {c.days[day]}
            </button>
          ))}
        </div>

        {/* Time range */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="volunteer-start" className="mb-1.5 block text-xs font-medium text-bark">
              {c.form.startTime}
            </label>
            <input
              id="volunteer-start"
              type="time"
              required
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="w-full rounded-xl border border-bark/15 bg-cream px-4 py-2.5 text-bark focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
            />
          </div>
          <div>
            <label htmlFor="volunteer-end" className="mb-1.5 block text-xs font-medium text-bark">
              {c.form.endTime}
            </label>
            <input
              id="volunteer-end"
              type="time"
              required
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className="w-full rounded-xl border border-bark/15 bg-cream px-4 py-2.5 text-bark focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
            />
          </div>
        </div>
      </fieldset>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={submitting || selectedDays.length === 0}
        className="w-full rounded-full bg-terracotta py-3 font-medium text-cream transition-colors hover:bg-terracotta-dark disabled:opacity-60"
      >
        {submitting ? c.form.submitting : c.form.submit}
      </button>
    </form>
  );
}
