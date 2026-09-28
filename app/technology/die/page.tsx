'use client';

import {Shell, useReduced} from '../../shell';
import {DieStage} from '../../die-stage';
import Related from '../../related';

export default function Page() {
  const reduced = useReduced();
  return (
    <Shell route="die">
      <section className="page-wrap">
        <DieStage reduced={reduced}/>
      <Related route="die"/>
      </section>
    </Shell>
  );
}
