import { useLocation } from '@solidjs/router';

function Nav() {
  const location = useLocation();
  const active = (path: string) =>
    path === location.pathname ? 'border-sky-600' : 'border-transparent hover:border-sky-600';
  return (
    <nav class="bg-orange-700">
      <ul class="container flex items-center p-1 text-green-50">
        <li class={`font-[1000] ${active('/')} mx-1.5 sm:mx-6`}>
          <a href="/">Home</a>
        </li>
        <li class={`font-[1000] ${active('/about')} mx-1.5 sm:mx-6`}>
          <a href="/about">About</a>
        </li>
      </ul>
    </nav>
  );
}

export { Nav };
