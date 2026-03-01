'use client';

import { SignIn } from '@clerk/nextjs';

const styles = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--gradient-hero)',
        position: 'relative',
        overflow: 'hidden',
    },
    overlay: {
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 30%, rgba(255,107,53,0.12) 0%, transparent 50%)',
    },
};

export default function SignInPage() {
    return (
        <div style={styles.page}>
            <div style={styles.overlay} />
            <SignIn
                appearance={{
                    elements: {
                        rootBox: { zIndex: 2 },
                        card: {
                            borderRadius: '20px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                        },
                    },
                }}
            />
        </div>
    );
}
