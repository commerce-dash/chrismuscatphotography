import { usePath } from './lib/router';
import { Cursor } from './components/Cursor';
import { Footer } from './components/Footer';
import { Navigation } from './components/Navigation';
import { About } from './pages/About';
import { Article } from './pages/Article';
import { Contact } from './pages/Contact';
import { Home } from './pages/Home';
import { Journal } from './pages/Journal';
import { NotFound } from './pages/NotFound';
import { Project } from './pages/Project';
import { Work } from './pages/Work';

function renderRoute(path: string) {
  if (path === '/') return <Home />;
  if (path === '/work') return <Work />;
  if (path === '/about') return <About />;
  if (path === '/journal') return <Journal />;
  if (path === '/contact') return <Contact />;

  let m = path.match(/^\/work\/([\w-]+)$/);
  if (m) return <Project slug={m[1]} />;
  m = path.match(/^\/journal\/([\w-]+)$/);
  if (m) return <Article slug={m[1]} />;

  return <NotFound />;
}

export function App() {
  const path = usePath();

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
