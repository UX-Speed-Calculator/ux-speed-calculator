import { useLocation } from '@solidjs/router';
import { A } from '@solidjs/router';

function Nav() {
  const location = useLocation();

  return (
    <nav class="flex flex-col items-center bg-stone-900">
      <ul class="container flex items-center justify-evenly p-2">
        <li class={`font-[1000]`}>
          <A href="/" end>
            Level 1
          </A>
        </li>
        <li class={`font-[1000]`}>
          <A href="/step2">Step2</A>
        </li>
        <li class={`font-[1000]`}>
          <A href="/step3">Step3</A>
        </li>
        <li class={`font-[1000]`}>
          <A href="/step4">Step4</A>
        </li>
        <li class={`font-[1000]`}>
          <A href="/step5">Step5</A>
        </li>
        <li class={`font-[1000]`}>
          <A href="/step6">Step6</A>
        </li>
        <li class={`font-[1000]`}>
          <A href="/step7">Step7</A>
        </li>
      </ul>
    </nav>
  );
}

export { Nav };
