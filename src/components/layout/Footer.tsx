import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import { toast } from '../ui/Toast';
import { BrandMark } from '../ui/BrandMark';

export const Footer = React.memo(function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (!email.trim() || !email.includes('@')) {
      toast('Lütfen geçerli bir e-posta adresi girin.', 'info');
      return;
    }
    setEmail('');
    toast('Bültene başarıyla kayıt oldunuz! Teşekkür ederiz.');
  };

  return (
    <footer className="bg-brand-deep border-t border-white/5 text-white/90 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-emerald-800/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-12 py-16 grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">

        <div className="md:col-span-4 space-y-4">
          <span className="font-serif text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 border border-gold/20 text-gold">
              <BrandMark size={18} />
            </span>
            Davet<span className="italic font-medium text-champagne -ml-1">Kart</span>
          </span>
          <p className="text-emerald-100/50 text-xs leading-relaxed">
            Özel anlarınız için özenle tasarlanmış, doğa dostu, pratik ve lüks dijital davetiyeler. Hayatınızın en mutlu gününü sevdiklerinizle lüks zarafetle paylaşın.
          </p>
        </div>

        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs uppercase font-bold text-champagne tracking-[0.12em]">Koleksiyonlar</h4>
          <ul className="space-y-2.5 text-xs text-emerald-100/50">
            <li><Link to="/create" className="hover:text-white hover:translate-x-1 rtl:hover:-translate-x-1 transition duration-200 inline-block">Düğün &amp; Nikah</Link></li>
            <li><Link to="/create" className="hover:text-white hover:translate-x-1 rtl:hover:-translate-x-1 transition duration-200 inline-block">Sünnet Düğünü</Link></li>
            <li><Link to="/create" className="hover:text-white hover:translate-x-1 rtl:hover:-translate-x-1 transition duration-200 inline-block">Baby Shower</Link></li>
            <li><Link to="/create" className="hover:text-white hover:translate-x-1 rtl:hover:-translate-x-1 transition duration-200 inline-block">Doğum Günü</Link></li>
            <li><Link to="/create" className="hover:text-white hover:translate-x-1 rtl:hover:-translate-x-1 transition duration-200 inline-block">Kurumsal Gala</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs uppercase font-bold text-champagne tracking-[0.12em]">Kurumsal</h4>
          <ul className="space-y-2.5 text-xs text-emerald-100/50">
            <li><Link to="/about" className="hover:text-white hover:translate-x-1 rtl:hover:-translate-x-1 transition duration-200 inline-block">Hakkımızda</Link></li>
            <li><Link to="/" className="hover:text-white hover:translate-x-1 rtl:hover:-translate-x-1 transition duration-200 inline-block">Özellikler</Link></li>
            <li><Link to="/pricing" className="hover:text-white hover:translate-x-1 rtl:hover:-translate-x-1 transition duration-200 inline-block">Fiyatlandırma</Link></li>
            <li><Link to="/sustainability" className="hover:text-white hover:translate-x-1 rtl:hover:-translate-x-1 transition duration-200 inline-block">Sürdürülebilirlik</Link></li>
            <li><Link to="/contact" className="hover:text-white hover:translate-x-1 rtl:hover:-translate-x-1 transition duration-200 inline-block">İletişim</Link></li>
          </ul>
        </div>

        <div className="md:col-span-4 space-y-4">
          <h4 className="text-xs uppercase font-bold text-champagne tracking-[0.12em]">Haber Bülteni</h4>
          <p className="text-emerald-100/50 text-xs leading-relaxed">
            Kampanyalardan, yeni lüks şablon tasarımlarından ve davetiye tüyolarından ilk siz haberdar olun.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSubscribe(); }}
              placeholder="E-posta adresiniz"
              className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 flex-grow transition duration-300"
            />
            <button
              onClick={handleSubscribe}
              className="bg-champagne text-brand-deep border-none px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-gold transition duration-300 cursor-pointer flex items-center gap-1.5 hover:-translate-y-0.5"
            >
              <Send size={12} />
              Kayıt Ol
            </button>
          </div>
        </div>

      </div>

      {/* Legal Credits */}
      <div className="border-t border-white/5 bg-black/30 py-6 text-center text-emerald-100/40 text-xs relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 DavetKart. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <Link to="/terms" className="hover:text-champagne transition-colors">Kullanım Şartları</Link>
            <Link to="/privacy" className="hover:text-champagne transition-colors">Gizlilik Sözleşmesi</Link>
            <Link to="/cookies" className="hover:text-champagne transition-colors">Çerez Politikası</Link>
          </div>
        </div>
      </div>
    </footer>
  );
});
