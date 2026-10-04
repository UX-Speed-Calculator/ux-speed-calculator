interface ToggleControlProps {
  defaultChecked?: boolean;
  hint?: string;
  label: string;
  onChange?: (checked: boolean) => void;
}

// On/off switch. A visually hidden checkbox keeps native keyboard and screen reader
// behavior, while the styled track and knob are drawn from its checked state.
function ToggleControl(props: ToggleControlProps) {
  return (
    <label class="flex cursor-pointer items-center justify-between gap-2" title={props.hint}>
      <span class="text-sm">{props.label}</span>
      <input
        checked={props.defaultChecked ?? false}
        class="peer sr-only"
        onChange={(event) => props.onChange?.(event.currentTarget.checked)}
        role="switch"
        type="checkbox"
      />
      <span
        aria-hidden="true"
        class="relative h-6 w-11 shrink-0 rounded-full bg-stone-600 transition-colors peer-checked:bg-sky-600 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-white after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:after:translate-x-5"
      />
    </label>
  );
}

export { ToggleControl };
