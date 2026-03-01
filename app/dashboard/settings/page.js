'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

const s = {
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '900px' },
    section: { marginBottom: '32px' },
    sectionTitle: { fontSize: '1.125rem', fontWeight: '700', fontFamily: 'var(--font-display)', marginBottom: '16px' },
    profileCard: {
        background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)',
        padding: '24px', display: 'flex', gap: '20px', alignItems: 'center',
    },
    avatar: {
        width: '80px', height: '80px', borderRadius: '50%', background: 'var(--gradient-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF',
        fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-display)', flexShrink: 0,
    },
    planCard: {
        background: 'var(--gradient-hero)', borderRadius: 'var(--radius-xl)', padding: '24px', color: '#FFF',
    },
    toggleRow: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0',
        borderBottom: '1px solid var(--border-light)',
    },
    toggleLabel: { fontSize: '0.9375rem', fontWeight: '500' },
    toggleDesc: { fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' },
    toggle: {
        width: '48px', height: '26px', borderRadius: '13px', padding: '2px', cursor: 'pointer',
        transition: 'background 0.3s',
    },
    toggleKnob: {
        width: '22px', height: '22px', borderRadius: '50%', background: '#FFF', transition: 'transform 0.3s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
    },
    dangerZone: {
        background: 'rgba(239,71,111,0.05)', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(239,71,111,0.2)',
        padding: '24px',
    },
};

export default function SettingsPage() {
    const { user } = useUser();
    const [notifications, setNotifications] = useState(true);
    const [emailUpdates, setEmailUpdates] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const userName = user?.fullName || user?.firstName || 'User';
    const userEmail = user?.primaryEmailAddress?.emailAddress || '';
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'var(--font-display)', marginBottom: '24px' }}>Settings</h2>

            {/* Profile */}
            <div style={s.section}>
                <h3 style={s.sectionTitle}>Profile</h3>
                <div style={s.profileCard}>
                    {user?.imageUrl ? (
                        <img src={user.imageUrl} alt={userName} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                        <div style={s.avatar}>{userInitials}</div>
                    )}
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '700', fontSize: '1.125rem', marginBottom: '2px' }}>{userName}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>{userEmail}</div>
                        <button className="btn btn-secondary btn-sm" onClick={() => user?.update && window.open('https://accounts.clerk.dev/user', '_blank')}>Edit Profile</button>
                    </div>
                </div>
            </div>

            {/* Subscription */}
            <div style={s.section}>
                <h3 style={s.sectionTitle}>Subscription</h3>
                <div style={s.planCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6 }}>Current Plan</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-display)' }}>Free</div>
                        </div>
                        <span style={{ padding: '4px 12px', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.15)', fontSize: '0.8125rem', fontWeight: '600' }}>Active</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', marginBottom: '16px' }}>Upgrade to Pro for unlimited pets, health analytics, and no ads.</p>
                    <Link href="/dashboard/marketplace" className="btn btn-primary btn-sm">⚡ Upgrade to Pro — ₹199/mo</Link>
                </div>
            </div>

            {/* Notifications */}
            <div style={s.section}>
                <h3 style={s.sectionTitle}>Notifications</h3>
                <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', padding: '4px 20px' }}>
                    {[
                        { label: 'Push Notifications', desc: 'Vaccine reminders, lost pet alerts', state: notifications, toggle: setNotifications },
                        { label: 'Email Updates', desc: 'Weekly pet health summaries', state: emailUpdates, toggle: setEmailUpdates },
                        { label: 'Dark Mode', desc: 'Coming soon', state: darkMode, toggle: setDarkMode },
                    ].map((item, i) => (
                        <div key={i} style={{ ...s.toggleRow, borderBottom: i < 2 ? '1px solid var(--border-light)' : 'none' }}>
                            <div>
                                <div style={s.toggleLabel}>{item.label}</div>
                                <div style={s.toggleDesc}>{item.desc}</div>
                            </div>
                            <div
                                style={{ ...s.toggle, background: item.state ? 'var(--primary)' : 'var(--border)' }}
                                onClick={() => item.toggle(!item.state)}
                            >
                                <div style={{ ...s.toggleKnob, transform: item.state ? 'translateX(22px)' : 'translateX(0)' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Danger Zone */}
            <div style={s.section}>
                <h3 style={s.sectionTitle}>Danger Zone</h3>
                <div style={s.dangerZone}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                            <div style={{ fontWeight: '600', color: 'var(--danger)' }}>Delete Account</div>
                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Permanently delete your account and all data</div>
                        </div>
                        <button className="btn btn-danger btn-sm">Delete Account</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
