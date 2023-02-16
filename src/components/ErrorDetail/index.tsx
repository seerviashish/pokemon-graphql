import { FallbackProps } from '../../screens/ErrorBoundary';

const ErrorDetail: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        style={{
          color: 'black',
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        Try again
      </button>
    </div>
  );
};

export default ErrorDetail;
