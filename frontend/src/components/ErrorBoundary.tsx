import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          style={{
            padding: '2rem',
            margin: '1rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 8,
            color: '#991b1b',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Something went wrong</h2>
          <pre style={{ margin: 0, fontSize: 12, overflow: 'auto' }}>
            {this.state.error.message}
          </pre>
          <p style={{ margin: '0.75rem 0 0 0', fontSize: 12 }}>
            Check the browser console for details. Fix the error and refresh the page.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
