import { Show } from 'solid-js';

import type { JSX, ParentProps } from 'solid-js';

type ControlPanelProps = ParentProps<{
  defaultOpen?: boolean;
  description?: JSX.Element;
  title: string;
}>;

// Collapsible panel for the controls section at the bottom of each step. Built on
// <details>/<summary> so expanding and collapsing works without JavaScript and is
// keyboard and screen reader accessible out of the box.
function ControlPanel(props: ControlPanelProps) {
  return (
    <details class="group rounded bg-stone-800 text-stone-100" open={props.defaultOpen ?? true}>
      <summary class="flex cursor-pointer list-none items-center justify-between gap-2 rounded p-3 select-none hover:bg-stone-700 focus-visible:outline-2 focus-visible:outline-white [&::-webkit-details-marker]:hidden">
        <h3 class="font-bold">{props.title}</h3>
        <svg
          aria-hidden="true"
          class="h-5 w-5 shrink-0 transition-transform group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2.5"
          viewBox="0 0 24 24"
        >
          <path d="M5 9l7 6 7-6" />
        </svg>
      </summary>
      <div class="flex flex-col gap-3 px-3 pb-3">
        <Show when={props.description}>
          <div class="text-sm text-stone-300">{props.description}</div>
        </Show>
        {props.children}
      </div>
    </details>
  );
}

export { ControlPanel };
