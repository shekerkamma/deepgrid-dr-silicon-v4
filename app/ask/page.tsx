'use client';

import {lazy, Suspense} from 'react';
import {Shell, useNav} from '../shell';
import Related from '../related';

// Ask DeepGrid carries a 1.5 MB graph index and the semantic-search loader. It lives on its
// own route so no other page pays for it: first-load JS had grown from 392 to 713 KB gzipped
// when it shipped with the rest.
const AskDeepGrid = lazy(() => import('../ask'));

export default function Page() {
  const {go} = useNav();
  return (
    <Shell route="ask">
      <Suspense fallback={<section className="page-wrap"><p className="disclaimer">Loading Ask DeepGrid…</p></section>}>
        <AskDeepGrid go={go}/>
      </Suspense>
      {/* Outside the Suspense boundary: inside it, the cross-references would render only while the
          lazy chunk was still loading, which is exactly what happened on the first pass. */}
      <section className="page-wrap"><Related route="ask"/></section>
    </Shell>
  );
}
