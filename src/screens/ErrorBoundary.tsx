import React from 'react';

interface State {
  isError: boolean;
}

function withErrorBoundary(Component: any, FallbackComponent?: any) {
  return class ErrorBoundary extends React.Component {
    state: State = {
      isError: false,
    };

    static getDerivedStateFromError(error: any) {
      return { isError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
      console.log('error => ', error, errorInfo);
    }

    render() {
      if (this.state.isError)
        return FallbackComponent ? (
          <FallbackComponent />
        ) : (
          <p>Something went wrong!</p>
        );
      return <Component />;
    }
  };
}

export { withErrorBoundary };
