import { A } from '@solidjs/router';

import { Counter } from '../components/Counter.tsx';

export default function About() {
  return (
    <main class="mx-auto p-4 text-gray-700">
      <h1 class="max-6-xs my-16 text-6xl font-thin text-sky-700 uppercase">About Page</h1>
      <Counter />
      <p class="mt-8">
        Visit{' '}
        <a class="text-sky-600 hover:underline" href="https://solidjs.com" target="_blank">
          solidjs.com
        </a>{' '}
        to learn how to build Solid apps.
      </p>
      <p class="my-4">
        <A class="text-sky-600 hover:underline" href="/">
          Home
        </A>
        {' - '}
        <span>About Page</span>
      </p>
    </main>
  );
}
