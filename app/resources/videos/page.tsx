'use client';

import {Shell} from '../../shell';
import CompanyPageView from '../../company-page';
import Related from '../../related';
import {pageById} from '../../company-pages';

export default function Page() {
  return (
    <Shell route="videos">
      <CompanyPageView page={pageById('videos')!}/>
      <div className="page-wrap"><Related route="videos"/></div>
    </Shell>
  );
}
