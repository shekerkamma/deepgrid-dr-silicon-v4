'use client';

import {Shell, useReduced} from './shell';
import {Overview} from './home-refined';
import Related from './related';

export default function Home() {
  const reduced = useReduced();

  return (
    <Shell route="home">
      <Overview reduced={reduced}/>
    <section className="page-wrap"><Related route="home"/></section>
    </Shell>
  );
}

