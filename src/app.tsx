import './app.css';

import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { Suspense } from 'solid-js';

import { LevelArrows } from './components/LevelArrows.tsx';
import { Nav } from './components/Nav.tsx';
import { ThreeScene } from './components/ThreeScene.tsx';

function App() {
  return (
    <Router
      root={(props) => (
        <>
          <Nav />
          <Suspense>{props.children}</Suspense>
          <LevelArrows />
          <ThreeScene />
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}

// eslint-disable-next-line import/no-default-export -- App is expected to be a default export
export default App;
