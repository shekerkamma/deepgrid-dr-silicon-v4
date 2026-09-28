'use client';

import {Shell} from '../../shell';
import CompanyPageView from '../../company-page';
import Related from '../../related';
import {pageById} from '../../company-pages';

export default function Page() {
  return (
    <Shell route="uc-grid">
      <CompanyPageView page={pageById('uc-grid')!}/>
      <div className="page-wrap"><Related route="uc-grid"/></div>
    </Shell>
  );
}
