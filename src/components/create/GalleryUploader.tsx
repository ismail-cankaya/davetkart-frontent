import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { useInvitationStore } from '../../stores/useInvitationStore';
import { mediaService } from '../../services/media';
import { toast } from '../ui/Toast';
import { toDisplayError } from '../../utils/toDisplayError';

const EASE_LUXE = [0.22, 1, 0.36, 1] as const;
const MAX_PHOTOS = 8;

/**
 * Davetiye galerisinin yükleyicisi.
 *
 * 🔴 Yükleme ucu davetiye kimliği ister (`POST /invitations/{id}/media`) ve
 * kimlik ancak ilk otomatik kaydetme tamamlandığında doğar. Kullanıcı
 * tasarıma başlar başlamaz fotoğraf seçebildiği için burada bir **sıra
 * sorunu** var: `recordId` henüz `null` olabilir.
 *
 * Sessizce başarısız olmak yerine kaydetmeyi bekletiyoruz — kullanıcının
 * seçtiği dosyanın nereye gittiğini bilmemesi, hata görmesinden kötüdür.
 */
export function GalleryUploader() {
  const images = useInvitationStore((s) => s.invitation.galleryImages);
  const updateField = useInvitationStore((s) => s.updateField);
  const recordId = useInvitationStore((s) => s.recordId);
  const saveInvitation = useInvitationStore((s) => s.saveInvitation);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList).slice(0, MAX_PHOTOS - images.length);
    if (files.length === 0) return;

    setUploading(true);
    try {
      // Kimlik yoksa önce kaydet: sunucudaki kayıt doğmadan ona dosya
      // iliştirilemez. Kaydetmeler sıraya alındığı için bu çağrı, uçmakta
      // olan bir otomatik kaydetmeyle çakışmaz.
      let invitationId = recordId;
      if (!invitationId) {
        await saveInvitation();
        invitationId = useInvitationStore.getState().recordId;
      }

      if (!invitationId) {
        toast('Fotoğraf eklemeden önce davetiyenin kaydedilmesi gerekiyor. Lütfen tekrar deneyin.', 'error');
        return;
      }

      const uploaded = await Promise.all(
        files.map((file) => mediaService.uploadForOwner(invitationId, file)),
      );
      // Liste yüklemeden SONRA okunur: yükleme sürerken kullanıcı bir
      // fotoğrafı kaldırmış olabilir; render anındaki `images` onu geri getirirdi.
      const current = useInvitationStore.getState().invitation.galleryImages;
      updateField('galleryImages', [...current, ...uploaded.map((media) => media.url)]);
    } catch (error) {
      toast(toDisplayError(error), 'error');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeImage = (url: string) =>
    updateField('galleryImages', images.filter((image) => image !== url));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2.5">
        <AnimatePresence initial={false}>
          {images.map((url) => (
            <motion.div
              key={url}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.4, ease: EASE_LUXE }}
              className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group"
            >
              <img src={url} alt="Galeri fotoğrafı" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                aria-label="Fotoğrafı kaldır"
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 hover:bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              >
                <X size={11} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {images.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-lg border border-dashed border-white/20 hover:border-gold/50 text-white/50 hover:text-champagne flex flex-col items-center justify-center gap-1 transition-colors duration-300 cursor-pointer disabled:opacity-50"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
            <span className="text-[9px] font-semibold">{uploading ? 'Yükleniyor' : 'Ekle'}</span>
          </button>
        )}
      </div>

      <p className="text-[11px] text-white/35">
        En fazla {MAX_PHOTOS} fotoğraf • {images.length} / {MAX_PHOTOS} yüklendi
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => void handleFiles(e.target.files)}
      />
    </div>
  );
}
