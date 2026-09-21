import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { GalleryImage } from '../../types';
import { useAuthStore } from '../../stores/useAuthStore';
import { useInvitationStore } from '../../stores/useInvitationStore';
import { MEDIA_UPLOAD_LIMIT_BYTES, mediaService } from '../../services/media';
import { apiErrorCode } from '../../services/api';
import { toast } from '../ui/Toast';
import { toDisplayError } from '../../utils/toDisplayError';
import { ease } from '../../utils/motion';

const MAX_PHOTOS = 8;

/**
 * Sunucunun galeri için kabul ettiği biçimler
 * (backend `config/davetkart.php` → `media.gallery.mimes`).
 *
 * İstemcide önceden elenir: dosya seçicisi yalnızca bu biçimleri gösterir.
 * Sunucu yine de doğrular — bu bir kolaylıktır, savunma değil.
 */
const ACCEPTED_TYPES: readonly string[] = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * 🔴 Boyut elemesi burada YAPILMAZ, yalnızca metinde geçer.
 *
 * Fotoğraf yüklenmeden önce tarayıcıda küçültülüyor
 * (`services/media.ts` → `compressImageForUpload`). Seçilen dosyanın ORİJİNAL
 * boyutuna bakıp elemek, sıkıştırıldıktan sonra rahatça sığacak 12 MB'lık bir
 * telefon fotoğrafını reddetmek olurdu. Sınırı, sıkıştırmadan SONRA servis
 * uyguluyor ve aşılırsa `MediaTooLargeError` fırlatıyor.
 */
const MAX_FILE_MB = Math.floor(MEDIA_UPLOAD_LIMIT_BYTES.gallery / (1024 * 1024));

const galleryNow = (): GalleryImage[] => useInvitationStore.getState().invitation.galleryImages;

/**
 * Davetiye galerisinin yükleyicisi.
 *
 * 🔴 Yükleme ucu davetiye kimliği ister (`POST /invitations/{id}/media`) ve
 * kimlik ancak ilk kaydetme tamamlandığında doğar. Kullanıcı tasarıma başlar
 * başlamaz fotoğraf seçebildiği için `recordId` henüz `null` olabilir; o zaman
 * önce kaydedilir. Sessizce başarısız olmak yerine kaydetmeyi bekletiyoruz —
 * kullanıcının seçtiği dosyanın nereye gittiğini bilmemesi, hata görmesinden kötüdür.
 *
 * 🔴 Galerinin üyeliği ve sırası SUNUCUNUNDUR: yükleme fotoğrafı sona ekler,
 * silme ayrı bir uçtur. Editör yalnızca sunucunun onayladığını yansıtır
 * (`applyGallery`) ve galeri davetiye kaydıyla gönderilmez.
 */
export function GalleryUploader() {
  const images = useInvitationStore((s) => s.invitation.galleryImages);
  const recordId = useInvitationStore((s) => s.recordId);
  const saveInvitation = useInvitationStore((s) => s.saveInvitation);
  const applyGallery = useInvitationStore((s) => s.applyGallery);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState<ReadonlySet<string>>(() => new Set());

  const resetInput = () => {
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    // Galeri sunucuda tutulur ve yükleme uçları giriş ister; anonim taslak
    // için dosyayı yüklemeye çalışmak yalnızca anlamsız bir 401 üretirdi.
    if (!isAuthenticated) {
      toast('Fotoğraf eklemek için giriş yapmanız gerekiyor. Tasarımınız korunur.', 'info');
      resetInput();
      return;
    }

    const chosen = Array.from(fileList);
    const valid = chosen.filter((file) => ACCEPTED_TYPES.includes(file.type));

    if (valid.length < chosen.length) {
      toast('Yalnızca JPG, PNG veya WEBP fotoğraflar eklenebilir.', 'error');
    }

    const files = valid.slice(0, Math.max(0, MAX_PHOTOS - galleryNow().length));
    if (files.length === 0) {
      resetInput();
      return;
    }

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

      // 🔴 SIRAYLA, paralel değil. Sunucu her dosyayı galerinin sonuna, kilit
      // altında ekler; paralel yüklemede tamamlanma sırası seçim sırasından
      // farklı olur ve editördeki sıra yeniden açılışta değişirdi. Ayrıca her
      // başarılı fotoğraf anında görünür: tek bir dosyanın hatası, sunucuya
      // zaten yazılmış diğerlerini editörden düşürmez.
      for (const file of files) {
        try {
          const media = await mediaService.uploadForOwner(invitationId, file);
          applyGallery(invitationId, (list) => [...list, { id: media.id, url: media.url }]);
        } catch (error) {
          // Kota, bağlantı ya da oturum hatası sonraki dosyalarda da tekrar
          // ederdi; aynı bildirimi dosya başına göstermek yerine dururuz.
          toast(toDisplayError(error), 'error');
          break;
        }
      }
    } finally {
      setUploading(false);
      resetInput();
    }
  };

  const removeImage = async (image: GalleryImage) => {
    const mediaId = image.id;
    if (!recordId || mediaId === null || removing.has(mediaId)) return;

    const invitationId = recordId;
    setRemoving((prev) => new Set(prev).add(mediaId));

    try {
      await mediaService.removeForOwner(invitationId, mediaId);
      applyGallery(invitationId, (list) => list.filter((item) => item.id !== mediaId));
    } catch (error) {
      // Sunucuda zaten yoksa (başka sekmede silindi) editörden de düşer.
      if (apiErrorCode(error) === 'RESOURCE_NOT_FOUND') {
        applyGallery(invitationId, (list) => list.filter((item) => item.id !== mediaId));
      } else {
        toast(toDisplayError(error), 'error');
      }
    } finally {
      setRemoving((prev) => {
        const next = new Set(prev);
        next.delete(mediaId);
        return next;
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2.5">
        <AnimatePresence initial={false}>
          {images.map((image) => {
            const isRemoving = image.id !== null && removing.has(image.id);
            return (
              <motion.div
                key={image.id ?? image.url}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: isRemoving ? 0.5 : 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.4, ease: ease.out }}
                className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group"
              >
                <img src={image.url} alt="Galeri fotoğrafı" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => void removeImage(image)}
                  disabled={isRemoving}
                  aria-label="Fotoğrafı kaldır"
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 hover:bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 disabled:opacity-100 transition-opacity duration-300 cursor-pointer disabled:cursor-wait"
                >
                  {isRemoving ? <Loader2 size={10} className="animate-spin" /> : <X size={11} />}
                </button>
              </motion.div>
            );
          })}
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
        En fazla {MAX_PHOTOS} fotoğraf • JPG, PNG veya WEBP, en fazla {MAX_FILE_MB} MB • {images.length} /{' '}
        {MAX_PHOTOS} yüklendi
      </p>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        multiple
        className="hidden"
        onChange={(e) => void handleFiles(e.target.files)}
      />
    </div>
  );
}
