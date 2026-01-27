import { useLocation } from '@solidjs/router';

function Nav() {
  const location = useLocation();
  const active = (path: string) =>
    path === location.pathname ? 'border-sky-600' : 'border-transparent hover:border-sky-600';
  return (
    <nav class="flex flex-col items-center bg-stone-900">
      <ul class="container flex items-center justify-evenly p-2">
        <li class={`font-[1000] ${active('/step1')} `}>
          <a href="/step1">Step1</a>
        </li>
        <li class={`font-[1000] ${active('/step2')} `}>
          <a href="/step2">Step2</a>
        </li>
        <li class={`font-[1000] ${active('/step3')} `}>
          <a href="/step3">Step3</a>
        </li>
        <li class={`font-[1000] ${active('/step4')} `}>
          <a href="/step4">Step4</a>
        </li>
        <li class={`font-[1000] ${active('/step5')} `}>
          <a href="/step5">Step5</a>
        </li>
        <li class={`font-[1000] ${active('/step6')} `}>
          <a href="/step6">Step6</a>
        </li>
        <li class={`font-[1000] ${active('/step7')} `}>
          <a href="/step7">Step7</a>
        </li>
      </ul>
    </nav>
  );
}

export { Nav };
