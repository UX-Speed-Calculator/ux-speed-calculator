import { createUniqueId } from 'solid-js';

interface InputControlProps {
  defaultValue?: number | string;
  hint?: string;
  label: string;
  max?: number;
  min?: number;
  onChange?: (value: string) => void;
  placeholder?: string;
  step?: number;
  type?: 'number' | 'text';
  unit?: string;
}

// Labelled entry field for free text or numbers
function InputControl(props: InputControlProps) {
  const id = createUniqueId();

  return (
    <div class="flex items-center justify-between gap-2" title={props.hint}>
      <label class="text-sm" for={id}>
        {props.label}
      </label>
      <span class="flex items-center gap-1 text-sm">
        <input
          class={`${props.type === 'text' ? 'w-40' : 'w-24 text-right'} rounded bg-stone-900 px-2 py-1 focus-visible:outline-2 focus-visible:outline-sky-500`}
          id={id}
          max={props.max}
          min={props.min}
          onChange={(event) => props.onChange?.(event.currentTarget.value)}
          placeholder={props.placeholder}
          step={props.step}
          type={props.type ?? 'number'}
          value={props.defaultValue ?? ''}
        />
        {props.unit}
      </span>
    </div>
  );
}

export { InputControl };
