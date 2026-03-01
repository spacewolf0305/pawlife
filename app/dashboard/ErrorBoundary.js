'use client';

import { Component } from 'react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('PawLife Error Boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '400px',
                    padding: '40px',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>😿</div>
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        fontFamily: 'var(--font-display)',
                        marginBottom: '8px',
                    }}>
                        Oops! Something went wrong
                    </h2>
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.9375rem',
                        marginBottom: '24px',
                        maxWidth: '400px',
                        lineHeight: '1.6',
                    }}>
                        Don&apos;t worry — your data is safe. This page encountered an unexpected error.
                    </p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => this.setState({ hasError: false, error: null })}
                        >
                            🔄 Try Again
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => window.location.href = '/dashboard'}
                        >
                            🏠 Go to Dashboard
                        </button>
                    </div>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <details style={{
                            marginTop: '24px',
                            padding: '16px',
                            background: 'var(--bg-hover)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.8125rem',
                            color: 'var(--text-muted)',
                            maxWidth: '600px',
                            width: '100%',
                            textAlign: 'left',
                        }}>
                            <summary style={{ cursor: 'pointer', fontWeight: '600' }}>Error Details (dev only)</summary>
                            <pre style={{ marginTop: '8px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {this.state.error.toString()}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
