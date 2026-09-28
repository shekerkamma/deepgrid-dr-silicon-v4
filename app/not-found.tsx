import {url} from './routes';
import {NotFoundRedirect} from './not-found-redirect';

export const metadata = {title: 'Page not found · DG32 · DeepGrid Semi'};

// Pages serves 404.html for any unknown path. Keep it in the site's look and point back in.
export default function NotFound() {
  const links: [string, string][] = [
    ['/', 'Home'], ['/products', 'Products'], ['/technology', 'Technology'], ['/use-cases/motors', 'Use cases'],
    ['/evidence', 'Evidence'], ['/resources', 'Resources'], ['/about', 'About'], ['/contact', 'Contact'],
  ];
  return (
    <main className="page-wrap nf-page" id="main">
      <NotFoundRedirect/>
      <p className="kicker">404</p>
      <h1>This page is not here.</h1>
      <p>The link may be from an earlier version of this site, or the page may have moved. These are the main sections:</p>
      <nav aria-label="Main sections" className="nf-links">
        {links.map(([href, label]) => <a key={href} href={url(href)}>{label}</a>)}
      </nav>
    </main>
  );
}
