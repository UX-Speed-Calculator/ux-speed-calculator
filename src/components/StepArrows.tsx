import { A, useLocation } from '@solidjs/router';
import { createMemo, Show } from 'solid-js';

import { STEPS } from '../steps.ts';

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

function StepArrows() {
  const location = useLocation();

  // Index of the current step, or -1 on pages that aren't steps (e.g. About, 404)
  const currentIndex = createMemo(() => {
    // Ignore a trailing slash so "/step2/" still matches "/step2"
    const path = location.pathname.replace(/(.)\/$/, '$1');

    return STEPS.findIndex((step) => step.href === path);
  });

  const previousStep = () => (currentIndex() > 0 ? STEPS[currentIndex() - 1] : undefined);
  const nextStep = () =>
    currentIndex() !== -1 && currentIndex() < STEPS.length - 1
      ? STEPS[currentIndex() + 1]
      : undefined;

  return (
    <>
      <Show when={previousStep()}>
        {(step) => (
          <A
            aria-label={`Previous: ${step().label}`}
            class={`${arrowClass} left-4`}
            href={step().href}
          >
            <Chevron direction="left" />
          </A>
        )}
      </Show>
      <Show when={nextStep()}>
        {(step) => (
          <A
            aria-label={`Next: ${step().label}`}
            class={`${arrowClass} right-4`}
            href={step().href}
          >
            <Chevron direction="right" />
          </A>
        )}
      </Show>
    </>
  );
}

export { StepArrows };
