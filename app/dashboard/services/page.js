'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const categories = [
    { key: 'all', label: 'All', icon: '📋' },
    { key: 'vet', label: 'Vets', icon: '🏥' },
    { key: 'groomer', label: 'Groomers', icon: '✂️' },
    { key: 'shop', label: 'Pet Shops', icon: '🛍️' },
    { key: 'walker', label: 'Walkers', icon: '🚶' },
];

const s = {
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    search: { display: 'flex', gap: '12px', marginBottom: '16px' },
    filters: { display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto' },
    filterBtn: {
        padding: '8px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', fontWeight: '600',
        borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)',
        cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
    },
    filterActive: { background: 'var(--primary)', color: '#FFF', borderColor: 'var(--primary)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' },
    card: {
        background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)',
        padding: '24px', transition: 'all 0.3s', position: 'relative',
    },
    sponsored: {
        position: 'absolute', top: '12px', right: '12px', padding: '3px 8px', borderRadius: 'var(--radius-full)',
        background: 'rgba(255,182,39,0.15)', color: 'var(--warning)', fontSize: '0.6875rem', fontWeight: '700',
    },
    cardTop: { display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '16px' },
    icon: {
        width: '52px', height: '52px', borderRadius: 'var(--radius-md)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0,
    },
    cardName: { fontWeight: '700', fontSize: '1rem', marginBottom: '2px' },
    cardAddr: { fontSize: '0.8125rem', color: 'var(--text-secondary)' },
    rating: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' },
    stars: { color: 'var(--warning)', fontSize: '0.875rem' },
    ratingNum: { fontWeight: '700', fontSize: '0.875rem' },
    reviewCount: { fontSize: '0.8125rem', color: 'var(--text-muted)' },
    actions: { display: 'flex', gap: '8px' },
    empty: {
        textAlign: 'center', padding: '60px 24px', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
        border: '2px dashed var(--border)',
    },
};

const iconBgs = { vet: 'rgba(0,180,216,0.1)', groomer: 'rgba(138,75,255,0.1)', shop: 'rgba(255,107,53,0.1)', walker: 'rgba(45,198,83,0.1)' };
const categoryEmojis = { vet: '🏥', groomer: '✂️', shop: '🛍️', walker: '🚶' };

export default function ServicesPage() {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!supabase) return;
        supabase
            .from('services')
            .select('*')
            .order('rating', { ascending: false })
            .then(({ data }) => { setServices(data || []); setLoading(false); });
    }, []);

    const filtered = services
        .filter(s => filter === 'all' || s.category === filter)
        .filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="animate-fade-in">
            <div style={s.header}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'var(--font-display)' }}>Pet Services</h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {loading ? 'Loading...' : `${services.length} service${services.length !== 1 ? 's' : ''} near you`}
                    </p>
                </div>
            </div>

            <div style={s.search}>
                <input className="input" placeholder="🔍 Search services..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1 }} />
            </div>

            <div style={s.filters}>
                {categories.map(c => (
                    <button key={c.key} style={{ ...s.filterBtn, ...(filter === c.key ? s.filterActive : {}) }} onClick={() => setFilter(c.key)}>
                        {c.icon} {c.label}
                    </button>
                ))}
            </div>

            {!loading && filtered.length === 0 ? (
                <div style={s.empty}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🏥</div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>
                        {services.length === 0 ? 'No services listed yet' : 'No matching services'}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {services.length === 0
                            ? 'Pet services directory is coming soon! Vets, groomers, and pet shops will appear here.'
                            : 'Try adjusting your search or filters.'}
                    </p>
                </div>
            ) : (
                <div style={s.grid}>
                    {filtered.map(service => (
                        <div
                            key={service.id}
                            style={s.card}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            {service.is_sponsored && <span style={s.sponsored}>⭐ SPONSORED</span>}
                            <div style={s.cardTop}>
                                <div style={{ ...s.icon, background: iconBgs[service.category] || 'rgba(0,0,0,0.05)' }}>
                                    {categoryEmojis[service.category] || '🐾'}
                                </div>
                                <div>
                                    <div style={s.cardName}>{service.name}</div>
                                    <div style={s.cardAddr}>📍 {service.address || 'Location not specified'}</div>
                                </div>
                            </div>
                            {service.rating && (
                                <div style={s.rating}>
                                    <span style={s.stars}>★★★★★</span>
                                    <span style={s.ratingNum}>{service.rating}</span>
                                    {service.review_count && <span style={s.reviewCount}>({service.review_count} reviews)</span>}
                                </div>
                            )}
                            <div style={s.actions}>
                                {service.phone && <a href={`tel:${service.phone}`} className="btn btn-primary btn-sm">📞 Call</a>}
                                <button className="btn btn-secondary btn-sm">📍 Directions</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
