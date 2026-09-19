import { useEffect } from 'react';
import { usePath } from './lib/router';
import { SITE } from './lib/site';
import { Cursor } from './components/Cursor';
import { Footer } from './components/Footer';
import { Navigation } from './components/Navigation';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { Project } from './pages/Project';
import { Search } from './pages/Search';
import { Work } from './pages/Work';

function renderRoute(path: string) {
  if (path === '/') return <Home />;
  if (path === '/work') return <Work />;
  if (path === '/about') return <About />;
  if (path === '/search') return <Search />;
  if (path === '/contact') return <Contact />;

  const m = path.match(/^\/work\/([\w-]+)$/);
  if (m) return <Project slug={m[1]} />;

  return <NotFound />;
}

export function App() {
  const path = usePath();

  // CMS-selectable serif (Site Settings → Theme). Preloaded in index.html;
  // unused families are never downloaded by the browser.
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--serif',
      `'${SITE.theme.serif}', Georgia, 'Times New Roman', serif`
    );
  }, []);

  return (
    <>
      <Cursor />
      <Navigation />
      {/* key={path} remounts pages so each route fades in once */}
      <main key={path} className="page">
        {renderRoute(path)}
      </main>
      <Footer />
    </>
  );
}
