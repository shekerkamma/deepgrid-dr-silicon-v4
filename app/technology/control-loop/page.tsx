'use client';

import {Shell, useNav} from '../../shell';
import {ControlLoop} from '../../package-control';
import Related from '../../related';
import {ControlScene} from '../../three/blocks';

export default function Page() {
  const {navigate} = useNav();
  return (
    <Shell route="control">
      <ControlLoop go={navigate}/>
      <ControlScene/>
    <section className="page-wrap"><Related route="control"/></section>
    </Shell>
  );
}
