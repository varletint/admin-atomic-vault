import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  /** Optional fallback UI. If not provided, a default error card is shown. */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex min-h-[40vh] items-center justify-center p-8">
          <div className="w-full max-w-md border border-[var(--color-border)] bg-admin-surface p-8 text-center">
            <AlertTriangle
              size={32}
              className="mx-auto mb-4 text-[var(--color-error)]"
              strokeWidth={1.5}
            />
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-admin-ink">
              Something went wrong
            </h2>
            <p className="mt-2 text-xs text-admin-muted">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              type="button"
              className="btn btn-secondary mt-6"
              onClick={this.handleReset}>
              <RotateCcw size={14} />
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
