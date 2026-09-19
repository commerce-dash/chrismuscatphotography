/**
 * About page content — loaded from content/about.json (CMS-editable).
 */
import aboutJson from '../../content/about.json';

export interface AboutContent {
  portrait: string;
  bio: string[];
  clients: string[];
  publications: string[];
  awards: string[];
  exhibitions: string[];
}

export const about = aboutJson as AboutContent;
