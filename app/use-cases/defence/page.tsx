'use client';

import {Shell} from '../../shell';
import CompanyPageView from '../../company-page';
import Related from '../../related';
import {pageById} from '../../company-pages';

export default function Page() {
  return (
    <Shell route="uc-defence">
      <CompanyPageView page={pageById('uc-defence')!}/>
      <div className="page-wrap"><Related route="uc-defence"/></div>
    </Shell>
  );
}
