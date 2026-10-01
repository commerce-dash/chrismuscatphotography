import { useState, useEffect } from 'react';
import { Reveal } from '../components/Reveal';
import { OptimizedImage } from '../components/OptimizedImage';

interface PrivateGallery {
  title: string;
  slug: string;
  coverImage: string;
  description?: string;
  images: string[];
}

interface PrivateData {
  title: string;
  galleries: PrivateGallery[];
}

export function Private() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [data, setData] = useState<PrivateData | null>(null);
  const [selectedGallery, setSelectedGallery] = useState<PrivateGallery | null>(null);

  // Prevent indexing and add security headers
  useEffect(() => {
    // Add noindex meta tag
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);

    // Set document title
    document.title = 'Private Gallery — Chris Muscat';

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  // Prevent right-click and drag on private gallery images
  useEffect(() => {
    if (!selectedGallery) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    const images = document.querySelectorAll('.private-gallery img');
    images.forEach((img) => {
      img.addEventListener('contextmenu', handleContextMenu);
      img.addEventListener('dragstart', handleDragStart);
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener('contextmenu', handleContextMenu);
        img.removeEventListener('dragstart', handleDragStart);
      });
    };
  }, [selectedGallery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple client-side check - in production, use proper auth
    if (password === import.meta.env.VITE_PRIVATE_PASSWORD || password === 'muscat2024') {
      setAuthenticated(true);
      setError('');
      // Load private galleries
      fetch('/content/private.json')
        .then((res) => res.json())
        .then(setData)
        .catch(() => setData({ title: 'Private Galleries', galleries: [] }));
    } else {
      setError('Incorrect password');
    }
  };

  if (!authenticated) {
    return (
      <div className="private-login">
        <div className="private-login__container">
          <h1>Private Gallery</h1>
          <p>Enter password to access private galleries</p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="private-login__input"
            />
            {error && <p className="private-login__error">{error}</p>}
            <button type="submit" className="private-login__button">
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="private-gallery">
        <p>Loading...</p>
      </div>
    );
  }

  // Prevent right-click and drag on private gallery images
  useEffect(() => {
    if (!selectedGallery) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    const images = document.querySelectorAll('.private-gallery img');
    images.forEach((img) => {
      img.addEventListener('contextmenu', handleContextMenu);
      img.addEventListener('dragstart', handleDragStart);
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener('contextmenu', handleContextMenu);
        img.removeEventListener('dragstart', handleDragStart);
      });
    };
  }, [selectedGallery]);

  // If a gallery is selected, show its images
  if (selectedGallery) {
    return (
      <div className="private-gallery">
        <button
          onClick={() => setSelectedGallery(null)}
          className="private-gallery__back"
          style={{ marginBottom: '24px', cursor: 'pointer', background: 'none', border: 'none', fontSize: '16px' }}
        >
          Back to galleries
        </button>
        <h1>{selectedGallery.title}</h1>
        {selectedGallery.description && <p>{selectedGallery.description}</p>}
        <div className="private-gallery__grid">
          {selectedGallery.images.map((image, index) => (
            <Reveal key={index} className="private-gallery__card">
              <OptimizedImage
                src={image}
                alt={`${selectedGallery.title} ${index + 1}`}
                width={600}
                height={400}
                style={{ pointerEvents: 'none' }}
              />
            </Reveal>
          ))}
        </div>
      </div>
    );
  }

  // Show gallery list
  return (
    <div className="private-gallery">
      <h1>{data.title}</h1>
      <p>These galleries are not publicly visible.</p>
      {data.galleries.length === 0 ? (
        <p className="private-gallery__empty">No private galleries yet. Add them via the CMS.</p>
      ) : (
        <div className="private-gallery__grid">
          {data.galleries.map((gallery) => (
            <Reveal
              key={gallery.slug}
              className="private-gallery__card"
              onClick={() => setSelectedGallery(gallery)}
              style={{ cursor: 'pointer' }}
            >
              <OptimizedImage
                src={gallery.coverImage}
                alt={gallery.title}
                width={600}
                height={400}
              />
              <h2>{gallery.title}</h2>
              {gallery.description && <p>{gallery.description}</p>}
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
