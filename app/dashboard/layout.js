'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, SignOutButton } from '@clerk/nextjs';
import PawBuddy from './PawBuddy';
import ErrorBoundary from './ErrorBoundary';

const navItems = [
    { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { href: '/dashboard/pets', icon: '🐾', label: 'My Pets' },
    { href: '/dashboard/health', icon: '💉', label: 'Health' },
    { href: '/dashboard/lost-found', icon: '📍', label: 'Lost & Found' },
    { href: '/dashboard/social', icon: '📸', label: 'Community' },
    { href: '/dashboard/services', icon: '🏥', label: 'Services' },
    { href: '/dashboard/marketplace', icon: '🛒', label: 'Marketplace' },
];

const bottomNav = [
    { href: '/dashboard/settings', icon: '⚙️', label: 'Settings' },
];

const sidebarStyles = {
    sidebar: {
        width: 'var(--sidebar-width)',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        background: '#FFFFFF',
        borderRight: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
        transition: 'transform 0.3s ease',
    },
    logo: {
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '1.25rem',
        fontWeight: '800',
        fontFamily: 'var(--font-display)',
        color: 'var(--primary)',
    },
    nav: {
        flex: 1,
        padding: '8px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 16px',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.9375rem',
        fontWeight: '500',
        color: 'var(--text-secondary)',
        transition: 'all 0.2s',
        textDecoration: 'none',
        cursor: 'pointer',
    },
    navItemActive: {
        background: 'rgba(255,107,53,0.08)',
        color: 'var(--primary)',
        fontWeight: '600',
    },
    navItemHover: {
        background: 'var(--bg-hover)',
    },
    bottomSection: {
        padding: '12px',
        borderTop: '1px solid var(--border-light)',
    },
    userCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        transition: 'background 0.2s',
    },
    userAvatar: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'var(--gradient-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFF',
        fontWeight: '700',
        fontSize: '0.875rem',
    },
    userName: {
        fontSize: '0.875rem',
        fontWeight: '600',
    },
    userEmail: {
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
    },
};

const layoutStyles = {
    wrapper: {
        display: 'flex',
        minHeight: '100vh',
    },
    main: {
        flex: 1,
        marginLeft: 'var(--sidebar-width)',
        background: 'var(--bg)',
    },
    topbar: {
        height: 'var(--topbar-height)',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-light)',
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
    },
    topbarTitle: {
        fontSize: '1.125rem',
        fontWeight: '700',
        fontFamily: 'var(--font-display)',
    },
    topbarActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    notifBtn: {
        width: '40px',
        height: '40px',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--border-light)',
        background: 'var(--bg-card)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '1.1rem',
        position: 'relative',
    },
    notifDot: {
        position: 'absolute',
        top: '8px',
        right: '8px',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: 'var(--danger)',
    },
    content: {
        padding: '32px',
    },
    mobileMenuBtn: {
        display: 'none',
        width: '40px',
        height: '40px',
        borderRadius: 'var(--radius-md)',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--border-light)',
        background: 'var(--bg-card)',
        cursor: 'pointer',
        fontSize: '1.25rem',
    },
    mobileOverlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 45,
    },
};

const pageTitles = {
    '/dashboard': 'Dashboard',
    '/dashboard/pets': 'My Pets',
    '/dashboard/pets/new': 'Add Pet',
    '/dashboard/health': 'Health Tracker',
    '/dashboard/lost-found': 'Lost & Found',
    '/dashboard/lost-found/new': 'Report',
    '/dashboard/social': 'Community',
    '/dashboard/services': 'Services',
    '/dashboard/marketplace': 'Marketplace',
    '/dashboard/settings': 'Settings',
};

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user } = useUser();
    const title = pageTitles[pathname] || 'Dashboard';

    const userName = user?.fullName || user?.firstName || 'User';
    const userEmail = user?.primaryEmailAddress?.emailAddress || '';
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div style={layoutStyles.wrapper}>
            {/* Mobile overlay */}
            {mobileOpen && (
                <div style={layoutStyles.mobileOverlay} onClick={() => setMobileOpen(false)} />
            )}

            {/* Sidebar */}
            <aside
                style={{
                    ...sidebarStyles.sidebar,
                    ...(mobileOpen ? {} : {}),
                }}
                className="sidebar"
            >
                <div style={sidebarStyles.logo}>🐾 PawLife</div>

                <nav style={sidebarStyles.nav}>
                    {navItems.map(item => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    ...sidebarStyles.navItem,
                                    ...(isActive ? sidebarStyles.navItemActive : {}),
                                }}
                                onClick={() => setMobileOpen(false)}
                                onMouseEnter={e => {
                                    if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)';
                                }}
                                onMouseLeave={e => {
                                    if (!isActive) e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div style={sidebarStyles.bottomSection}>
                    {bottomNav.map(item => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    ...sidebarStyles.navItem,
                                    ...(isActive ? sidebarStyles.navItemActive : {}),
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                    <div
                        style={sidebarStyles.userCard}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        {user?.imageUrl ? (
                            <img src={user.imageUrl} alt={userName} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                            <div style={sidebarStyles.userAvatar}>{userInitials}</div>
                        )}
                        <div style={{ flex: 1 }}>
                            <div style={sidebarStyles.userName}>{userName}</div>
                            <div style={sidebarStyles.userEmail}>{userEmail}</div>
                        </div>
                    </div>
                    <SignOutButton>
                        <button
                            style={{ ...sidebarStyles.navItem, color: 'var(--danger)', fontSize: '0.8125rem', marginTop: '4px' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,71,111,0.06)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            <span style={{ fontSize: '1.2rem' }}>🚪</span> Sign Out
                        </button>
                    </SignOutButton>
                </div>
            </aside>

            {/* Main Content */}
            <main style={layoutStyles.main}>
                <header style={layoutStyles.topbar}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                            style={layoutStyles.mobileMenuBtn}
                            className="mobile-menu-btn"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            ☰
                        </button>
                        <h1 style={layoutStyles.topbarTitle}>{title}</h1>
                    </div>
                    <div style={layoutStyles.topbarActions}>
                        <button
                            style={layoutStyles.notifBtn}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
                        >
                            🔔
                            <span style={layoutStyles.notifDot} />
                        </button>
                    </div>
                </header>
                <div style={layoutStyles.content}>
                    <ErrorBoundary>
                        {children}
                    </ErrorBoundary>
                </div>
            </main>

            <PawBuddy />

            <style jsx global>{`
        @media (max-width: 768px) {
          .sidebar {
            transform: ${mobileOpen ? 'translateX(0)' : 'translateX(-100%)'} !important;
          }
          main {
            margin-left: 0 !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
        </div>
    );
}
