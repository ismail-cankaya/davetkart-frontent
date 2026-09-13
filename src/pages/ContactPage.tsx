import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Clock3, Loader2, Mail, MailCheck, MapPin, MessageCircle, Phone, Send, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { toast } from '../components/ui/Toast';
import { sendContactMessage, ContactSubject } from '../services/contact';
import { HoneypotField } from '../components/ui/HoneypotField';
import { toDisplayError } from '../utils/toDisplayError';

const EASE_LUXE = [0.22, 1, 0.36, 1] as const;

const SUBJECTS: { value: ContactSubject; label: string }[] = [
  { value: 'general', label: 'Genel Sorular' },
  { value: 'support', label: 'Teknik Destek' },
  { value: 'pricing', label: 'Fiyatlandırma ve Ödeme' },
  { value: 'partnership', label: 'Kurumsal İş Birliği' },
  { value: 'kvkk', label: 'KVKK Başvurusu' }
];

const CONTACT_CHANNELS = [
  {
    icon: <Mail size={18} />,
    title: 'E-posta',
    lines: ['destek@davetkart.com'],
    note: 'Tüm sorularınız için — genellikle aynı gün dönüş yapıyoruz.'
  },
  {
    icon: <ShieldCheck size={18} />,
    title: 'KVKK Başvuruları',
    lines: ['kvkk@davetkart.com'],
    note: 'Kişisel verilerinize ilişkin talepler en geç 30 günde yanıtlanır.'
  },
  {
    icon: <Phone size={18} />,
    title: 'Telefon',
    lines: ['+90 (212) 555 01 23'],
    note: 'Hafta içi 09.00 – 18.00 arasında ulaşabilirsiniz.'
  },
  {
    icon: <MapPin size={18} />,
    title: 'Ofis',
    lines: ['Maslak Mah. Zarafet Sk. No: 4', 'Sarıyer / İstanbul'],
    note: 'Ziyaretler için lütfen önceden randevu alın.'
  }
];

const INPUT_CLASS =
  'w-full bg-cream/60 border border-ink/10 rounded-xl px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all duration-300';

interface FormState {
  name: string;
  email: string;
  subject: ContactSubject;
  message: string;
  /** Bot tuzağı — görünmez alan; bkz. `HoneypotField`. */
  website: string;
}

const INITIAL_FORM: FormState = {
  name: '',
  email: '',
  subject: 'general',
  message: '',
  website: ''
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast('Lütfen adınızı ve soyadınızı girin.', 'info');
      return;
    }
    if (!form.email.trim() || !form.email.includes('@')) {
      toast('Lütfen geçerli bir e-posta adresi girin.', 'info');
      return;
    }
    if (form.message.trim().length < 10) {
      toast('Mesajınız en az 10 karakter olmalı.', 'info');
      return;
    }

    setSending(true);
    try {
      await sendContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject,
        message: form.message.trim(),
        // Tuzağın değeri olduğu gibi taşınır; boş dizgiyi backend null'a
        // çevirip görmezden gelir, dolu gelirse 204 döner ve kaydetmez.
        website: form.website
      });
      setSent(true);
      toast('Mesajınız bize ulaştı. Teşekkür ederiz!');
    } catch (error) {
      toast(toDisplayError(error), 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-cream">
      <PageHeader
        badge="İletişim"
        icon={<MessageCircle size={13} />}
        title="Size Nasıl"
        accent="Yardımcı"
        tail="Olabiliriz?"
        description="Sorularınız, önerileriniz veya iş birliği talepleriniz için buradayız. Formu doldurun; destek ekibimiz en kısa sürede size dönüş yapsın."
      />

      <div className="max-w-7xl mx-auto px-4 md:px-12 pb-16 md:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* İletişim kanalları */}
        <motion.aside
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE_LUXE }}
          className="lg:col-span-5 space-y-4"
        >
          {CONTACT_CHANNELS.map((channel, idx) => (
            <motion.div
              key={channel.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE_LUXE, delay: idx * 0.08 }}
              className="group flex gap-4 rounded-3xl bg-white border border-ink/[0.06] p-6 shadow-sm hover:shadow-xl hover:shadow-brand/10 hover:border-brand/15 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="w-11 h-11 rounded-xl bg-brand/[0.06] text-brand border border-brand/10 flex items-center justify-center shrink-0 group-hover:bg-brand group-hover:text-champagne transition-all duration-500">
                {channel.icon}
              </div>
              <div className="min-w-0">
                <h2 className="font-serif text-base font-bold text-ink mb-0.5">{channel.title}</h2>
                {channel.lines.map(line => (
                  <p key={line} className="text-brand text-sm font-semibold">{line}</p>
                ))}
                <p className="text-muted text-xs leading-relaxed mt-1">{channel.note}</p>
              </div>
            </motion.div>
          ))}

          <div className="flex items-center gap-3 rounded-3xl bg-brand-deep text-white p-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-700/25 rounded-full blur-3xl pointer-events-none" />
            <Clock3 size={18} className="text-gold shrink-0 relative z-10" />
            <p className="text-emerald-100/70 text-xs leading-relaxed relative z-10">
              Destek taleplerini hafta içi ortalama <span className="text-champagne font-semibold">4 saat</span>,
              hafta sonu 24 saat içinde yanıtlıyoruz.
            </p>
          </div>
        </motion.aside>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE_LUXE, delay: 0.1 }}
          className="lg:col-span-7"
        >
          <div className="rounded-[2rem] bg-white border border-ink/[0.06] shadow-sm p-7 md:p-10">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: EASE_LUXE }}
                  className="text-center py-12 space-y-5"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-brand/[0.06] text-brand border border-brand/10 flex items-center justify-center">
                    <MailCheck size={28} />
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink">
                    Mesajınız <span className="italic text-brand font-medium">bize ulaştı</span>
                  </h2>
                  <p className="text-muted text-sm leading-relaxed max-w-sm mx-auto">
                    Teşekkür ederiz! Destek ekibimiz en kısa sürede {form.email} adresinden size dönüş yapacak.
                  </p>
                  <button
                    onClick={() => {
                      setForm(INITIAL_FORM);
                      setSent(false);
                    }}
                    className="inline-flex items-center gap-2 text-brand font-semibold text-sm underline decoration-gold/50 underline-offset-4 hover:decoration-gold transition-colors cursor-pointer"
                  >
                    Yeni bir mesaj gönder
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: EASE_LUXE }}
                  onSubmit={handleSubmit}
                  className="relative space-y-5"
                  noValidate
                >
                  <HoneypotField
                    id="contact-website"
                    value={form.website}
                    onChange={(value) => updateField('website', value)}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-name" className="text-xs font-bold text-ink uppercase tracking-wide">
                        Ad Soyad
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={form.name}
                        onChange={e => updateField('name', e.target.value)}
                        placeholder="Adınız ve soyadınız"
                        className={INPUT_CLASS}
                        autoComplete="name"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="text-xs font-bold text-ink uppercase tracking-wide">
                        E-posta
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={form.email}
                        onChange={e => updateField('email', e.target.value)}
                        placeholder="ornek@eposta.com"
                        className={INPUT_CLASS}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-subject" className="text-xs font-bold text-ink uppercase tracking-wide">
                      Konu
                    </label>
                    <select
                      id="contact-subject"
                      value={form.subject}
                      onChange={e => updateField('subject', e.target.value as ContactSubject)}
                      className={`${INPUT_CLASS} cursor-pointer`}
                    >
                      {SUBJECTS.map(subject => (
                        <option key={subject.value} value={subject.value}>
                          {subject.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="text-xs font-bold text-ink uppercase tracking-wide">
                      Mesajınız
                    </label>
                    <textarea
                      id="contact-message"
                      value={form.message}
                      onChange={e => updateField('message', e.target.value)}
                      placeholder="Size nasıl yardımcı olabiliriz?"
                      rows={6}
                      className={`${INPUT_CLASS} resize-y min-h-32`}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                    <p className="text-muted text-[11px] leading-relaxed">
                      Formu göndererek{' '}
                      <Link to="/privacy" className="text-brand underline decoration-gold/50 underline-offset-2 hover:decoration-gold">
                        Gizlilik Sözleşmesi
                      </Link>
                      &apos;ni kabul etmiş olursunuz.
                    </p>
                    <button
                      type="submit"
                      disabled={sending}
                      className="relative overflow-hidden inline-flex items-center justify-center gap-2.5 bg-brand text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-brand-soft transition-all duration-500 shadow-md shadow-brand/15 hover:shadow-lg hover:shadow-brand/25 hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none cursor-pointer shrink-0 w-full sm:w-auto"
                    >
                      <span className="absolute inset-0 animate-shimmer pointer-events-none" />
                      {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                      {sending ? 'Gönderiliyor…' : 'Mesajı Gönder'}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
