'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { supabase, ensureUser } from '@/lib/supabase';
import { getPetAge } from '@/lib/utils';

const quickActions = [
    { icon: '🐾', label: 'Add Pet', href: '/dashboard/pets/new', bg: 'rgba(255,107,53,0.1)', color: 'var(--primary)' },
    { icon: '💉', label: 'Health Check', href: '/dashboard/health', bg: 'rgba(0,180,216,0.1)', color: 'var(--accent)' },
    { icon: '📍', label: 'Report Lost', href: '/dashboard/lost-found/new', bg: 'rgba(239,71,111,0.1)', color: 'var(--danger)' },
    { icon: '🛒', label: 'Pet Shop', href: '/dashboard/marketplace', bg: 'rgba(138,75,255,0.1)', color: '#8a4bff' },
];

const petEmojis = { Dog: '🐕', Cat: '🐈', Bird: '🐦', Fish: '🐠', Rabbit: '🐇' };

const s = {
    greeting: {
        background: 'var(--gradient-hero)', borderRadius: 'var(--radius-xl)', padding: '32px',
        color: '#FFFFFF', position: 'relative', overflow: 'hidden', marginBottom: '24px',
    },
    greetingOverlay: { position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 20%, rgba(255,107,53,0.2) 0%, transparent 50%)' },
    greetingContent: { position: 'relative', zIndex: 2 },
    greetingTitle: { fontSize: '1.75rem', fontWeight: '800', fontFamily: 'var(--font-display)', marginBottom: '4px' },
    greetingSubtitle: { fontSize: '0.9375rem', color: 'rgba(255,255,255,0.7)' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
    quickGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' },
    quickCard: {
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '20px',
        borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)', border: '1px solid var(--border-light)',
        cursor: 'pointer', transition: 'all 0.3s', textDecoration: 'none', textAlign: 'center',
    },
    quickIcon: { width: '48px', height: '48px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' },
    quickLabel: { fontSize: '0.875rem', fontWeight: '600', color: 'var(--text)' },
    sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' },
    sectionTitle: { fontSize: '1.125rem', fontWeight: '700', fontFamily: 'var(--font-display)' },
    sectionLink: { fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: '600' },
    petsScroll: { display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '32px' },
    petCard: {
        minWidth: '220px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)', padding: '20px', cursor: 'pointer', transition: 'all 0.3s', textDecoration: 'none',
    },
    petEmoji: { fontSize: '2.5rem', marginBottom: '12px' },
    petName: { fontSize: '1rem', fontWeight: '700', marginBottom: '2px' },
    petBreed: { fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '10px' },
    empty: {
        textAlign: 'center', padding: '48px 24px', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
        border: '2px dashed var(--border)', marginBottom: '32px',
    },
    emptyIcon: { fontSize: '3rem', marginBottom: '12px' },
    emptyTitle: { fontSize: '1.125rem', fontWeight: '700', marginBottom: '4px' },
    emptyText: { fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px' },
};

export default function DashboardPage() {
    const { user } = useUser();
    const [pets, setPets] = useState([]);
    const [stats, setStats] = useState({ pets: 0, records: 0, posts: 0, reports: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !supabase) return;

        async function loadDashboard() {
            // Sync Clerk user to Supabase
            await ensureUser(user);

            // Fetch pets
            const { data: petsData } = await supabase
                .from('pets')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            // Fetch counts
            const { count: recordCount } = await supabase
                .from('health_records')
                .select('*', { count: 'exact', head: true })
                .in('pet_id', (petsData || []).map(p => p.id));

            const { count: postCount } = await supabase
                .from('posts')
                .select('*', { count: 'exact', head: true });

            const { count: reportCount } = await supabase
                .from('lost_found')
                .select('*', { count: 'exact', head: true });

            setPets(petsData || []);
            setStats({
                pets: petsData?.length || 0,
                records: recordCount || 0,
                posts: postCount || 0,
                reports: reportCount || 0,
            });
            setLoading(false);
        }

        loadDashboard();
    }, [user]);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const firstName = user?.firstName || 'there';

    const statCards = [
        { icon: '🐾', value: stats.pets, label: 'My Pets', bg: 'rgba(255,107,53,0.1)' },
        { icon: '💉', value: stats.records, label: 'Health Records', bg: 'rgba(0,180,216,0.1)' },
        { icon: '📍', value: stats.reports, label: 'Lost & Found', bg: 'rgba(239,71,111,0.1)' },
        { icon: '📸', value: stats.posts, label: 'Community Posts', bg: 'rgba(138,75,255,0.1)' },
    ];

    return (
        <div className="animate-fade-in">
            {/* Greeting */}
            <div style={s.greeting}>
                <div style={s.greetingOverlay} />
                <div style={s.greetingContent}>
                    <h2 style={s.greetingTitle}>{greeting}, {firstName} 👋</h2>
                    <p style={s.greetingSubtitle}>
                        {stats.pets > 0
                            ? `You have ${stats.pets} pet${stats.pets > 1 ? 's' : ''} registered.`
                            : 'Welcome to PawLife! Add your first pet to get started.'}
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div style={s.statsGrid} className="responsive-grid-4">
                {statCards.map((stat, i) => (
                    <div key={i} className="stat-card animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className="stat-icon" style={{ background: stat.bg }}>{stat.icon}</div>
                        {loading ? (
                            <>
                                <div className="skeleton skeleton-text" style={{ width: '60px', height: '28px', marginBottom: '4px' }} />
                                <div className="skeleton skeleton-text" style={{ width: '90px', height: '14px' }} />
                            </>
                        ) : (
                            <>
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div style={s.sectionHeader}>
                <h3 style={s.sectionTitle}>Quick Actions</h3>
            </div>
            <div style={s.quickGrid} className="responsive-grid-4">
                {quickActions.map((action, i) => (
                    <Link
                        key={i}
                        href={action.href}
                        style={s.quickCard}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            e.currentTarget.style.borderColor = action.color;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.borderColor = 'var(--border-light)';
                        }}
                    >
                        <div style={{ ...s.quickIcon, background: action.bg }}>{action.icon}</div>
                        <span style={s.quickLabel}>{action.label}</span>
                    </Link>
                ))}
            </div>

            {/* My Pets */}
            <div style={s.sectionHeader}>
                <h3 style={s.sectionTitle}>My Pets</h3>
                {pets.length > 0 && <Link href="/dashboard/pets" style={s.sectionLink}>View All →</Link>}
            </div>

            {!loading && pets.length === 0 ? (
                <div style={s.empty}>
                    <div style={s.emptyIcon}>🐾</div>
                    <div style={s.emptyTitle}>No pets yet</div>
                    <div style={s.emptyText}>Add your first furry friend to start tracking their health and memories!</div>
                    <Link href="/dashboard/pets/new" className="btn btn-primary">+ Add Your First Pet</Link>
                </div>
            ) : (
                <div style={s.petsScroll}>
                    {pets.map(pet => (
                        <Link
                            key={pet.id}
                            href={`/dashboard/pets/${pet.id}`}
                            style={s.petCard}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <div style={s.petEmoji}>{petEmojis[pet.species] || '🐾'}</div>
                            <div style={s.petName}>{pet.name}</div>
                            <div style={s.petBreed}>{pet.breed || pet.species}{pet.dob ? ` • ${getPetAge(pet.dob)}` : ''}</div>
                        </Link>
                    ))}
                    <Link
                        href="/dashboard/pets/new"
                        style={{
                            ...s.petCard, display: 'flex', flexDirection: 'column', alignItems: 'center',
                            justifyContent: 'center', borderStyle: 'dashed', color: 'var(--text-muted)',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>+</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>Add Pet</div>
                    </Link>
                </div>
            )}
        </div>
    );
}
