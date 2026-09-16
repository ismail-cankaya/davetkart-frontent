import { invalidateConditionalCache } from '../services/conditionalGet';
import { useAuthStore } from './useAuthStore';
import { useCreateWizardStore } from './useCreateWizardStore';
import { useInvitationStore } from './useInvitationStore';
import { useRsvpStore } from './useRsvpStore';

/**
 * Birden çok store'u birlikte değiştirmesi gereken kullanıcı eylemleri.
 *
 * Her store yalnızca kendi durumunu bilir; "yeni bir davetiyeye başla" gibi
 * eylemler ise sihirbazı VE editördeki belgeyi aynı anda ilgilendirir. Bu
 * koordinasyon bileşenlere dağılırsa bir çağrı yerinde adımlardan biri unutulur.
 */

/**
 * "Yeni Davetiye Oluştur" — sihirbazla birlikte editördeki belge de sıfırlanır.
 *
 * 🔴 Yalnızca sihirbaz sıfırlanırsa store'da en son açılan kaydın kimliği
 * kalır ve yeni tasarım o kaydın — belki az önce yayınlanan davetiyenin —
 * üzerine yazılır.
 */
export function startNewInvitation(): void {
  useInvitationStore.getState().resetInvitation();
  useCreateWizardStore.getState().startNew();
}

/**
 * Kullanıcının kendi isteğiyle çıkışı: bu sekmede hesaba ait ne varsa düşer.
 *
 * 🔴 `useAuthStore.logout()` yalnızca oturumu kapatır; editördeki tasarım,
 * LCV listesi ve ETag önbelleği bellekte kalır. Paylaşılan bir cihazda bir
 * sonraki kişi `/create`'e girip önceki hesabın davetiyesini görürdü.
 *
 * Oturum süresi dolduğunda (401) bu fonksiyon ÇAĞRILMAZ: aynı kullanıcı
 * yeniden girip kaldığı yerden devam edebilmeli. O yoldaki hesap değişimini
 * `useInvitationStore`'un sahiplik bekçisi karşılar.
 */
export function signOut(): void {
  useAuthStore.getState().logout();
  useInvitationStore.getState().resetInvitation();
  useCreateWizardStore.getState().startNew();
  useRsvpStore.getState().setInvitationScope(null);
  invalidateConditionalCache();
}
