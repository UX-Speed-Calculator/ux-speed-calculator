import './app.css';

import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { Suspense } from 'solid-js';
import ThreeScene from './components/ThreeScene.tsx';

import { Nav } from './components/Nav.tsx';

function App() {
  return (
    <Router
      root={(props) => (
        <div class="min-h-screen bg-stone-950 text-stone-200">
          <div class="fixed inset-0 z-0 pointer-events-none">
            <ThreeScene />
          </div>
          <div class="relative z-10 flex flex-col min-h-screen">
            <Nav />
            <Suspense>
              <div class="flex-grow container mx-auto px-4 py-8">
                {props.children}
              </div>
            </Suspense>
            <footer class="p-8 text-center text-stone-500 text-xs border-t border-stone-900">
              <p>© 2026 UX Speed Calculator. Ported to SolidStart ✨🤖✨</p>
            </footer>
          </div>
        </div>
      )}
    >
      <FileRoutes />
    </Router>
  );
}

// eslint-disable-next-line import/no-default-export -- App is expected to be a default export
export default App;
