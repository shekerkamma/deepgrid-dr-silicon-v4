'use client';

import {Shell} from '../shell';
import CompanyPageView from '../company-page';
import Related from '../related';
import {pageById} from '../company-pages';

export default function Page() {
  return (
    <Shell route="about">
      <CompanyPageView page={pageById('story')!}/>
      <div className="page-wrap"><Related route="about"/></div>
    </Shell>
  );
}
