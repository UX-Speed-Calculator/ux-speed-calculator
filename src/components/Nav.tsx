import { A } from '@solidjs/router';
import { For } from 'solid-js';

import { STEPS } from '../steps.ts';

// Links come from STEPS (src/steps.ts), shared with the in-page step arrows
function Nav() {
  return (
    <nav class="flex flex-col items-center bg-stone-900">
      <ul class="container flex items-center justify-evenly p-2">
        <For each={STEPS}>
          {(step) => (
            <li class={`font-[1000]`}>
              {/* "/" is a prefix of every path, so it needs an exact match to be marked active */}
              <A end={step.href === '/'} href={step.href}>
                {step.label}
              </A>
            </li>
          )}
        </For>
      </ul>
    </nav>
  );
}

export { Nav };
