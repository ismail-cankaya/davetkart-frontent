import React, { useState } from 'react';
import { Film } from 'lucide-react';
import { TemplatePreset } from '../../types';
import { cn } from '../../utils/cn';

interface TemplateCoverProps {
  preset: TemplatePreset;
  alt: string;
  className?: string;
}

/**
 * Şablon kartının kapak görseli.
 *
 * Üç durum vardır ve ikisi birbirinden ayrılmalıdır:
 *
 *  1. Görsel var → normal <img>.
 *  2. `imageUrl` boş → şablon tamamen kod tabanlı (videosuz, fotoğrafsız);
 *     kapağı zaten kendi degradesidir. Bu bir eksiklik DEĞİL, o yüzden
 *     hiçbir uyarı ikonu gösterilmez.
 *  3. Görsel yüklenemedi → video posteri henüz eklenmemiş; degradeye düşer
 *     ve film ikonu bunun bekleyen bir varlık olduğunu belli eder.
 *
 * İkisini aynı şekilde göstermek, kod tabanlı şablonları "bozuk" gibi
 * okuturdu.
 */
export function TemplateCover({ preset, alt, className }: TemplateCoverProps) {
  const [failed, setFailed] = useState(false);
  const hasImage = Boolean(preset.imageUrl);

  if (!hasImage || failed) {
    return (
      <div
        className={cn(
          'w-full h-full flex items-center justify-center',
          preset.backgroundStyle,
          className
        )}
        role="img"
        aria-label={alt}
      >
        {failed && <Film size={26} strokeWidth={1.4} className="text-white/45" />}
      </div>
    );
  }

  return (
    <img
      className={className}
      src={preset.imageUrl}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
