'use client';

import {Shell} from '../../shell';
import CompanyPageView from '../../company-page';
import Related from '../../related';
import {pageById} from '../../company-pages';

export default function Page() {
  return (
    <Shell route="team">
      <CompanyPageView page={pageById('team')!}/>
      <div className="page-wrap"><Related route="team"/></div>
    </Shell>
  );
}
