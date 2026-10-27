import { A, useLocation } from '@solidjs/router';
import { createMemo, Show } from 'solid-js';

import { LEVELS } from '../levels.ts';

const arrowClass =
  'fixed top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-stone-900/80 text-stone-200 shadow-lg hover:bg-stone-700 hover:text-white focus-visible:outline-2 focus-visible:outline-white';

// Chevron drawn as SVG (rather than a text glyph) so it centers exactly in the button;
// both paths span x 9–15, centered on the 24-unit viewBox
function Chevron(props: { direction: 'left' | 'right' }) {
  return (
    <svg
      aria-hidden="true"
      class="h-7 w-7"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="3"
      viewBox="0 0 24 24"
    >
      <path d={props.direction === 'left' ? 'M15 5l-6 7 6 7' : 'M9 5l6 7-6 7'} />
    </svg>
  );
}

function LevelArrows() {
  const location = useLocation();

  // Index of the current level, or -1 on pages that aren't levels (e.g. About, 404)
  const currentIndex = createMemo(() => {
    // Ignore a trailing slash so "/level2/" still matches "/level2"
    const path = location.pathname.replace(/(.)\/$/, '$1');

    return LEVELS.findIndex((level) => level.href === path);
  });

  const previousLevel = () => (currentIndex() > 0 ? LEVELS[currentIndex() - 1] : undefined);
  const nextLevel = () =>
    currentIndex() !== -1 && currentIndex() < LEVELS.length - 1
      ? LEVELS[currentIndex() + 1]
      : undefined;

  return (
    <>
      <Show when={previousLevel()}>
        {(level) => (
          <A
            aria-label={`Previous: ${level().label}`}
            class={`${arrowClass} left-4`}
            href={level().href}
          >
            <Chevron direction="left" />
          </A>
        )}
      </Show>
      <Show when={nextLevel()}>
        {(level) => (
          <A
            aria-label={`Next: ${level().label}`}
            class={`${arrowClass} right-4`}
            href={level().href}
          >
            <Chevron direction="right" />
          </A>
        )}
      </Show>
    </>
  );
}

export { LevelArrows };
