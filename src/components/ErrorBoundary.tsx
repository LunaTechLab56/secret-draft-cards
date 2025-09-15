import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

    // Log error to monitoring service
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // In a real application, you would send this to your error monitoring service
    console.error('Error caught by boundary:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    // Example: Send to error reporting service
    // errorReporting.captureException(error, {
    //   extra: {
    //     componentStack: errorInfo.componentStack,
    //     errorId: this.state.errorId
    //   }
    // });
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportBug = () => {
    const errorDetails = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Create a mailto link with error details
    const subject = `Bug Report - Secret Draft Cards (${this.state.errorId})`;
    const body = `Error Details:\n\n${JSON.stringify(errorDetails, null, 2)}`;
    const mailtoLink = `mailto:support@secretdraftcards.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(mailtoLink);
  };

  private copyErrorDetails = () => {
    const errorDetails = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
      .then(() => {
        // Show success message
        console.log('Error details copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy error details:', err);
      });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-900/20 to-orange-900/20 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-gradient-to-br from-red-900/90 to-orange-900/90 border-red-500/20 backdrop-blur-xl">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-red-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Oops! Something went wrong
              </CardTitle>
              <p className="text-gray-300 mt-2">
                We encountered an unexpected error. Don't worry, our team has been notified.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Error ID */}
              <Alert className="bg-red-500/20 border-red-500/30">
                <Bug className="h-4 w-4" />
                <AlertDescription className="text-red-200">
                  <strong>Error ID:</strong> {this.state.errorId}
                </AlertDescription>
              </Alert>

              {/* Error Message */}
              {this.state.error && (
                <div className="bg-black/20 rounded-lg p-4 border border-red-500/30">
                  <h3 className="font-semibold text-white mb-2">Error Details:</h3>
                  <p className="text-red-200 text-sm font-mono break-words">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  onClick={this.handleRetry}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>

                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="border-green-500/30 text-green-300 hover:bg-green-500/20"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>

                <Button
                  onClick={this.handleReportBug}
                  variant="outline"
                  className="border-orange-500/30 text-orange-300 hover:bg-orange-500/20"
                >
                  <Bug className="h-4 w-4 mr-2" />
                  Report Bug
                </Button>
              </div>

              {/* Additional Help */}
              <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
                <h3 className="font-semibold text-white mb-2">Need Help?</h3>
                <div className="space-y-2 text-sm text-gray-200">
                  <p>• Try refreshing the page</p>
                  <p>• Check your internet connection</p>
                  <p>• Clear your browser cache</p>
                  <p>• Contact support if the problem persists</p>
                </div>
              </div>

              {/* Technical Details (Collapsible) */}
              <details className="bg-black/20 rounded-lg p-4 border border-gray-500/30">
                <summary className="cursor-pointer text-white font-semibold mb-2">
                  Technical Details (Click to expand)
                </summary>
                <div className="space-y-2 text-xs text-gray-300 font-mono">
                  <div>
                    <strong>Error ID:</strong> {this.state.errorId}
                  </div>
                  <div>
                    <strong>Timestamp:</strong> {new Date().toISOString()}
                  </div>
                  <div>
                    <strong>URL:</strong> {window.location.href}
                  </div>
                  <div>
                    <strong>User Agent:</strong> {navigator.userAgent}
                  </div>
                  {this.state.error?.stack && (
                    <div>
                      <strong>Stack Trace:</strong>
                      <pre className="mt-1 p-2 bg-black/40 rounded text-xs overflow-auto max-h-32">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="mt-1 p-2 bg-black/40 rounded text-xs overflow-auto max-h-32">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                  <Button
                    onClick={this.copyErrorDetails}
                    variant="outline"
                    size="sm"
                    className="mt-2 border-gray-500/30 text-gray-300 hover:bg-gray-500/20"
                  >
                    Copy Error Details
                  </Button>
                </div>
              </details>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
