'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const categories = ['all', 'food', 'toys', 'accessories', 'grooming'];
const tagColors = { Bestseller: 'var(--primary)', Popular: 'var(--accent)', Sale: 'var(--danger)', New: 'var(--success)', Safety: 'var(--warning)' };

const s = {
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    filters: { display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto' },
    filterBtn: {
        padding: '8px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', fontWeight: '600',
        border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)',
        cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize', whiteSpace: 'nowrap',
    },
    filterActive: { background: 'var(--primary)', color: '#FFF', borderColor: 'var(--primary)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' },
    card: {
        background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)',
        overflow: 'hidden', transition: 'all 0.3s', position: 'relative',
    },
    tag: {
        position: 'absolute', top: '12px', left: '12px', padding: '4px 10px', borderRadius: 'var(--radius-full)',
        fontSize: '0.6875rem', fontWeight: '700', color: '#FFF',
    },
    imageArea: {
        height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem',
        background: 'var(--bg-hover)',
    },
    body: { padding: '16px 20px 20px' },
    brand: { fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' },
    name: { fontWeight: '700', fontSize: '1rem', marginTop: '4px', marginBottom: '8px' },
    priceRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' },
    price: { fontWeight: '800', fontSize: '1.25rem', fontFamily: 'var(--font-display)', color: 'var(--primary)' },
    originalPrice: { fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'line-through' },
    discount: { fontSize: '0.75rem', fontWeight: '700', color: 'var(--success)', background: 'rgba(45,198,83,0.1)', padding: '2px 6px', borderRadius: '4px' },
    rating: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', marginBottom: '12px' },
    empty: {
        textAlign: 'center', padding: '60px 24px', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
        border: '2px dashed var(--border)',
    },
};

const categoryEmojis = { food: '🥩', toys: '🎾', accessories: '🛏️', grooming: '✂️' };

export default function MarketplacePage() {
    const [filter, setFilter] = useState('all');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!supabase) return;
        supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })
            .then(({ data }) => { setProducts(data || []); setLoading(false); });
    }, []);

    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

    return (
        <div className="animate-fade-in">
            <div style={s.header}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'var(--font-display)' }}>Pet Marketplace</h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} available`}
                    </p>
                </div>
            </div>

            <div style={s.filters}>
                {categories.map(c => (
                    <button key={c} style={{ ...s.filterBtn, ...(filter === c ? s.filterActive : {}) }} onClick={() => setFilter(c)}>
                        {c === 'all' ? '🛒 All' : `${categoryEmojis[c] || '📦'} ${c}`}
                    </button>
                ))}
            </div>

            {!loading && filtered.length === 0 ? (
                <div style={s.empty}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🛒</div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>
                        {products.length === 0 ? 'Marketplace coming soon!' : 'No matching products'}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {products.length === 0
                            ? 'Premium pet products, food, toys and accessories will be available here soon. Stay tuned! 🐾'
                            : 'Try a different category to find what you need.'}
                    </p>
                </div>
            ) : (
                <div style={s.grid}>
                    {filtered.map(product => {
                        const discount = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : 0;
                        return (
                            <div
                                key={product.id}
                                style={s.card}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-6px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                {product.tag && <span style={{ ...s.tag, background: tagColors[product.tag] || 'var(--primary)' }}>{product.tag}</span>}
                                <div style={s.imageArea}>
                                    {product.image_url
                                        ? <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : (categoryEmojis[product.category] || '📦')
                                    }
                                </div>
                                <div style={s.body}>
                                    {product.brand && <div style={s.brand}>{product.brand}</div>}
                                    <div style={s.name}>{product.name}</div>
                                    <div style={s.priceRow}>
                                        <span style={s.price}>₹{product.price?.toLocaleString()}</span>
                                        {product.original_price && <span style={s.originalPrice}>₹{product.original_price.toLocaleString()}</span>}
                                        {discount > 0 && <span style={s.discount}>{discount}% OFF</span>}
                                    </div>
                                    {product.rating && (
                                        <div style={s.rating}>
                                            <span style={{ color: 'var(--warning)' }}>★</span>
                                            <span style={{ fontWeight: '600' }}>{product.rating}</span>
                                            {product.review_count && <span style={{ color: 'var(--text-muted)' }}>({product.review_count})</span>}
                                        </div>
                                    )}
                                    <button className="btn btn-primary btn-sm w-full">🛒 Add to Cart</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
