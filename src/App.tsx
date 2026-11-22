import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { useDocumentDirection } from './hooks/useDocumentDirection';
import { routes } from './routes';

// The route table and its error boundaries live in routes.tsx (FE-02) so
// verify:render can mount the very same table in a memory router.
const router = createBrowserRouter(routes);

function App() {
  // Keeps <html lang> and <html dir> in sync with the active language.
  useDocumentDirection();
  return (
    // "Hareketi azalt" tercihi açıksa Motion transform/layout animasyonlarını
    // atlar, opaklık geçişlerini korur. `transform` dizesiyle yazılmış girişler
    // bunu kendi bileşenlerinde `useReducedMotion` ile ayrıca yapar.
    <MotionConfig reducedMotion="user">
      <RouterProvider router={router} />
    </MotionConfig>
  );
}

export default App;
