'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { timeAgo } from '@/lib/utils';

const statusStyles = {
    lost: { bg: 'rgba(239,71,111,0.1)', color: 'var(--danger)', label: '🚨 LOST', border: 'var(--danger)' },
    found: { bg: 'rgba(0,180,216,0.1)', color: 'var(--accent)', label: '✅ FOUND', border: 'var(--accent)' },
    resolved: { bg: 'rgba(45,198,83,0.1)', color: 'var(--success)', label: '🎉 REUNITED', border: 'var(--success)' },
};

const s = {
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    filters: { display: 'flex', gap: '8px', marginBottom: '24px' },
    filterBtn: {
        padding: '8px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', fontWeight: '600',
        border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)',
        cursor: 'pointer', transition: 'all 0.2s',
    },
    filterActive: { background: 'var(--primary)', color: '#FFF', borderColor: 'var(--primary)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' },
    card: {
        background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)',
        overflow: 'hidden', transition: 'all 0.3s',
    },
    cardHeader: { padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    cardTitle: { display: 'flex', alignItems: 'center', gap: '10px' },
    cardName: { fontWeight: '700', fontSize: '1.125rem' },
    cardSpecies: { fontSize: '0.8125rem', color: 'var(--text-secondary)' },
    cardBody: { padding: '0 20px 20px' },
    cardDesc: { fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '12px' },
    cardMeta: { display: 'flex', gap: '16px', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '16px' },
    cardActions: { display: 'flex', gap: '8px' },
    empty: {
        textAlign: 'center', padding: '60px 24px', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
        border: '2px dashed var(--border)',
    },
};

const petEmojis = { Dog: '🐩', Cat: '🐈', Bird: '🐦', Fish: '🐠', Rabbit: '🐇' };

export default function LostFoundPage() {
    const [filter, setFilter] = useState('all');
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!supabase) return;
        supabase
            .from('lost_found')
            .select('*')
            .order('created_at', { ascending: false })
            .then(({ data }) => { setReports(data || []); setLoading(false); });
    }, []);

    const filtered = filter === 'all' ? reports : reports.filter(r => r.status === filter);

    return (
        <div className="animate-fade-in">
            <div style={s.header}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'var(--font-display)' }}>Lost & Found</h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {loading ? 'Loading...' : `${reports.length} report${reports.length !== 1 ? 's' : ''} in your area`}
                    </p>
                </div>
                <Link href="/dashboard/lost-found/new" className="btn btn-danger">🚨 Report Lost/Found</Link>
            </div>

            <div style={s.filters}>
                {['all', 'lost', 'found', 'resolved'].map(f => (
                    <button key={f} style={{ ...s.filterBtn, ...(filter === f ? s.filterActive : {}) }} onClick={() => setFilter(f)}>
                        {f === 'all' ? 'All' : statusStyles[f]?.label || f}
                    </button>
                ))}
            </div>

            {!loading && filtered.length === 0 ? (
                <div style={s.empty}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📍</div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>
                        {reports.length === 0 ? 'No reports yet' : 'No matching reports'}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                        {reports.length === 0
                            ? 'No lost or found pets reported in your area. Let\'s keep it that way! 🎉'
                            : 'Try a different filter to see more reports.'}
                    </p>
                </div>
            ) : (
                <div style={s.grid}>
                    {filtered.map(report => {
                        const st = statusStyles[report.status] || statusStyles.lost;
                        return (
                            <div
                                key={report.id}
                                style={{ ...s.card, borderLeft: `4px solid ${st.border}` }}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                <div style={s.cardHeader}>
                                    <div style={s.cardTitle}>
                                        <span style={{ fontSize: '1.75rem' }}>{petEmojis[report.species] || '🐾'}</span>
                                        <div>
                                            <div style={s.cardName}>{report.pet_name}</div>
                                            <div style={s.cardSpecies}>{report.species || 'Unknown'}</div>
                                        </div>
                                    </div>
                                    <span className="badge" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                                </div>
                                <div style={s.cardBody}>
                                    <p style={s.cardDesc}>{report.description || 'No description provided.'}</p>
                                    <div style={s.cardMeta}>
                                        {report.address && <span>📍 {report.address}</span>}
                                        <span>🕐 {timeAgo(report.created_at)}</span>
                                    </div>
                                    {report.status !== 'resolved' && report.contact_phone && (
                                        <div style={s.cardActions}>
                                            <a href={`tel:${report.contact_phone}`} className="btn btn-primary btn-sm">📞 Contact</a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
