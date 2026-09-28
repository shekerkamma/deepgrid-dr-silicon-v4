'use client';

import {Shell} from '../../shell';
import CompanyPageView from '../../company-page';
import Related from '../../related';
import {pageById} from '../../company-pages';

export default function Page() {
  return (
    <Shell route="docs">
      <CompanyPageView page={pageById('docs')!}/>
      <div className="page-wrap"><Related route="docs"/></div>
    </Shell>
  );
}
