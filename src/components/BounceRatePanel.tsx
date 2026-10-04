import { ControlPanel } from './ControlPanel.tsx';
import { SliderControl } from './SliderControl.tsx';

// Bounce rate settings, shared by the steps that expose them
function BounceRatePanel() {
  return (
    <ControlPanel description="How bounce rate responds to page speed." title="Bounce Rate">
      <SliderControl
        defaultValue={20}
        hint="Minimum bounce rate at theoretical 0"
        label="Min bounce rate"
        max={100}
        min={0}
        step={0.5}
        unit="%"
      />
      <SliderControl
        defaultValue={4}
        hint="How fast does bounce rate affect the users"
        label="Bounce time compression"
        max={100}
        min={0}
        step={0.05}
      />
      <SliderControl
        defaultValue={50}
        hint="How high is the bounce rate on the site"
        label="Bounce rate scale"
        max={100}
        min={0}
        step={0.5}
        unit="%"
      />
    </ControlPanel>
  );
}

export { BounceRatePanel };
