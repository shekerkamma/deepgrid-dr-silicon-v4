'use client';

import {Shell} from '../../shell';
import CompanyPageView from '../../company-page';
import Related from '../../related';
import {pageById} from '../../company-pages';

export default function Page() {
  return (
    <Shell route="uc-boards">
      <CompanyPageView page={pageById('uc-boards')!}/>
      <div className="page-wrap"><Related route="uc-boards"/></div>
    </Shell>
  );
}
