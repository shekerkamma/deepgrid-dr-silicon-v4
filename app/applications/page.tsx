'use client';

import {Shell} from '../shell';
import {SectionHead} from '../detail';
import ApplicationsStory from '../applications-story';
import {PRE_SILICON} from '../copy';
import Related from '../related';

export default function Page() {
  return (
    <Shell route="applications">
      <section className="page-wrap">
        <SectionHead
          title="Ten chips, five kinds of system"
          copy="DeepGrid's portfolio by the systems it goes into. Open a chip for what it replaces and its annex sheet; DG32-LITE, the part on first silicon, opens into its diagnostic story and films."
        />
        <ApplicationsStory/>
        <p className="disclaimer">{PRE_SILICON}</p>
      <Related route="applications"/>
      </section>
    </Shell>
  );
}
