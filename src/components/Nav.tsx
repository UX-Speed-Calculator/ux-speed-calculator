import { A } from '@solidjs/router';
import { For } from 'solid-js';

import { LEVELS } from '../levels.ts';

// Links come from LEVELS (src/levels.ts), shared with the in-page level arrows
function Nav() {
  return (
    <nav class="flex flex-col items-center bg-stone-900">
      <ul class="container flex items-center justify-evenly p-2">
        <For each={LEVELS}>
          {(level) => (
            <li class={`font-[1000]`}>
              {/* "/" is a prefix of every path, so it needs an exact match to be marked active */}
              <A end={level.href === '/'} href={level.href}>
                {level.label}
              </A>
            </li>
          )}
        </For>
      </ul>
    </nav>
  );
}

export { Nav };
