import React, { lazy, Suspense } from 'react';

const LazySignIn = lazy(() => import('./SignIn'));

const SignIn = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode }): JSX.Element => (
  <Suspense fallback={null}>
    <LazySignIn {...props} />
  </Suspense>
);

export default SignIn;
