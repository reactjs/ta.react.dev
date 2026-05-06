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
    <Page
      toc={[]}
      routeTree={sidebarLearn}
      meta={{title: 'ஏதோ தவறு நடந்துவிட்டது'}}>
      <MaxWidth>
        <Intro>
          <P>ஏதோ தவறு நடந்துவிட்டது.</P>
          <P>இதற்கு வருந்துகிறோம்.</P>
          <P>
            உங்களுக்கு விருப்பமென்றால், தயவுசெய்து  {' '}
            <A href="https://github.com/reactjs/react.dev/issues/new">
            ஒரு முறையீட்டை புகாரளிக்கவும்.
            </A>
          </P>
        </Intro>
      </MaxWidth>
    </Page>
  );
}
