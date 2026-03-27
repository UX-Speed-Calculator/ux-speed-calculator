import { A } from '@solidjs/router';
import { For } from 'solid-js';

function Nav() {
  const levels = [
    { href: '/', label: 'Level 1' },
    { href: '/step2', label: 'Level 2' },
    { href: '/step3', label: 'Level 3' },
    { href: '/step4', label: 'Level 4' },
    { href: '/step5', label: 'Level 5' },
    { href: '/step6', label: 'Level 6' },
    { href: '/step7', label: 'Level 7' },
  ];

  return (
    <nav class="flex flex-col items-center bg-stone-900 sticky top-0 z-50 border-b border-stone-800">
      <ul class="container flex items-center justify-evenly p-2">
        <For each={levels}>
          {(level) => (
            <li class="font-bold text-xs uppercase tracking-widest">
              <A
                href={level.href}
                end={level.href === '/'}
                class="px-3 py-2 rounded-lg transition-colors hover:bg-stone-800 text-stone-400"
                activeClass="text-emerald-400 bg-stone-800"
              >
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
