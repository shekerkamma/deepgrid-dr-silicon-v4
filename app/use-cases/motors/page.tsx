'use client';

import {Shell} from '../../shell';
import CompanyPageView from '../../company-page';
import Related from '../../related';
import {pageById} from '../../company-pages';

export default function Page() {
  return (
    <Shell route="uc-motors">
      <CompanyPageView page={pageById('uc-motors')!}/>
      <div className="page-wrap"><Related route="uc-motors"/></div>
    </Shell>
  );
}
