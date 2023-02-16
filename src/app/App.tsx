import React, { Suspense, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LayoutProvider } from '../contexts';
import { Nav } from '../components';
import { ApolloProvider } from '@apollo/client';
import { client } from './client';
import { ErrorBoundary } from '../screens/ErrorBoundary';
import ErrorDetail from '../components/ErrorDetail';

const Loading: React.FC = () => {
  return <div>{'Loading....'}</div>;
};

const Home = React.lazy(() => import('../screens/Home'));

const ListPage = React.lazy(() => import('../screens/ListPage'));

const ListDetailPage = React.lazy(() => import('../screens/ListDetailPage'));

function App() {
  const classes = useStyles();
  return (
    <ErrorBoundary
      FallbackComponent={ErrorDetail}
      onError={(error, errorInfo) => {
        console.log('Error =: ', error, errorInfo);
      }}
    >
      <ApolloProvider client={client}>
        <LayoutProvider>
          <div className={classes.root}>
            <BrowserRouter>
              <Nav />
              <div className={classes.content}>
                <div className={classes.scrollableArea}>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <Suspense fallback={<Loading />}>
                          <Home />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/pokemon"
                      element={
                        <Suspense fallback={<Loading />}>
                          <ListPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/pokemon/:pokemonId/:pokemonName"
                      element={
                        <Suspense fallback={<Loading />}>
                          <ListDetailPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="*"
                      element={
                        <Suspense fallback={<Loading />}>
                          <Home />
                        </Suspense>
                      }
                    />
                  </Routes>
                </div>
              </div>
            </BrowserRouter>
          </div>
        </LayoutProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
}

const useStyles = createUseStyles(
  {
    root: {
      background: '#171E2b',
      minHeight: '100vh',
      minWidth: '100vw',
      height: '100%',
      width: '100%',
      display: 'flex',
    },
    content: {
      flex: '1',
      overflow: 'hidden',
      position: 'relative',
    },
    scrollableArea: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'auto',
    },
  },
  { name: 'App' }
);

export default App;
