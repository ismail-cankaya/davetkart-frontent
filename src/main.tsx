import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n'; // initialize i18next before the tree renders
import { useAuthStore } from './stores/useAuthStore';

// Faz 10 (10.29): önbellekteki oturum sunucuya BİR KEZ doğrulatılır. Token
// 30 günlük (K90) ya da başka cihazdan iptal edilmişse ilk kimlikli işlemde
// değil, açılışta düşer; kullanıcı bilgisi de tazelenir.
//
// Neden bir bileşenin useEffect'i değil? StrictMode geliştirmede efektleri iki
// kez çalıştırır (iki istek); buradaki çağrı uygulama başına yalnızca bir kez
// koşar. İlk çizimi de bekletmez: store önbellekten zaten kurulu.
void useAuthStore.getState().refreshSession();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
