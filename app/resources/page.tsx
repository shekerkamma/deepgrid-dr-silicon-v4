'use client';

import {Shell, useQuery, useNav} from '../shell';
import {SectionHead} from '../detail';
import Library from '../library';
import Related from '../related';

export default function Page() {
  const {go} = useNav();
  const [params, update] = useQuery();
  return (
    <Shell route="resources">
      <section className="page-wrap">
        <SectionHead
          title="The documents, decks and films behind every figure"
          copy="Six source documents carry every number on this site. Each one is here as the full PDF and as a readable specification, with the architecture and datasheet decks and the narrated films made from them."
        />
        <Library
          pkgId={params.get('pkg') || 'lite'}
          slide={Number(params.get('slide')) || 1}
          onChange={update}
          go={go}
        />
      <Related route="resources"/>
      </section>
    </Shell>
  );
}
