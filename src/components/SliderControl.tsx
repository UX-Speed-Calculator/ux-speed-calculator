import { createSignal, createUniqueId } from 'solid-js';

interface SliderControlProps {
  defaultValue: number;
  hint?: string;
  label: string;
  max: number;
  min: number;
  onChange?: (value: number) => void;
  step?: number;
  unit?: string;
}

// Range slider paired with a number field; both stay in sync and are clamped to min/max
function SliderControl(props: SliderControlProps) {
  const id = createUniqueId();
  const [value, setValue] = createSignal(props.defaultValue);

  // Parses, clamps and stores a new value, returning what was stored
  const commit = (raw: string) => {
    const parsed = Number.parseFloat(raw);
    const next = Number.isNaN(parsed) ? value() : Math.min(props.max, Math.max(props.min, parsed));

    setValue(next);
    props.onChange?.(next);

    return next;
  };

  return (
    <div class="flex flex-col gap-1" title={props.hint}>
      <div class="flex items-center justify-between gap-2">
        <label class="text-sm" for={`${id}-number`} id={`${id}-label`}>
          {props.label}
        </label>
        <span class="flex items-center gap-1 text-sm">
          <input
            class="w-20 rounded bg-stone-900 px-2 py-1 text-right focus-visible:outline-2 focus-visible:outline-sky-500"
            id={`${id}-number`}
            max={props.max}
            min={props.min}
            // Commit on change (blur/Enter) rather than every keystroke so partially
            // typed values aren't clamped while the user is still typing
            onChange={(event) => {
              const input = event.currentTarget;
              // Rewrite the field directly in case the clamped value equals the previous
              // one, in which case the signal wouldn't update the DOM
              input.value = String(commit(input.value));
            }}
            step={props.step}
            type="number"
            value={value()}
          />
          {props.unit}
        </span>
      </div>
      <input
        aria-labelledby={`${id}-label`}
        class="w-full accent-sky-500"
        max={props.max}
        min={props.min}
        onInput={(event) => commit(event.currentTarget.value)}
        step={props.step}
        type="range"
        value={value()}
      />
    </div>
  );
}

export { SliderControl };
