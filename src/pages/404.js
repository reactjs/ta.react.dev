/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Page} from 'components/Layout/Page';
import {MDXComponents} from 'components/MDX/MDXComponents';
import sidebarLearn from '../sidebarLearn.json';

const {Intro, MaxWidth, p: P, a: A} = MDXComponents;

export default function NotFound() {
  return (
    <Page toc={[]} meta={{title: 'வலைப்பக்கம் கண்டறியப்படவில்லை'}} routeTree={sidebarLearn}>
      <MaxWidth>
        <Intro>
          <P>இந்தப் வலைப்பக்கம் கண்டறியப்படவில்லை.</P>
          <P>
            இதில் ஏதேனும் தவறு இருந்தால் {', '}
            <A href="https://github.com/reactjs/ta.react.dev/issues/new">
            எங்களுக்குத் தெரியப்படுத்துங்கள் 
            </A>
            {', '}
            நாங்கள் அதைச் சரிசெய்ய முயற்சிப்போம் !
          </P>
        </Intro>
      </MaxWidth>
    </Page>
  );
}
