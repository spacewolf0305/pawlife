'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { getPetAge } from '@/lib/utils';

const petEmojis = { Dog: '🐕', Cat: '🐈', Bird: '🐦', Fish: '🐠', Rabbit: '🐇' };

const s = {
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
    card: {
        background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)',
        overflow: 'hidden', transition: 'all 0.3s', cursor: 'pointer', textDecoration: 'none', display: 'block',
    },
    cardTop: {
        height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '4rem', position: 'relative',
    },
    cardBody: { padding: '20px' },
    cardName: { fontSize: '1.125rem', fontWeight: '700', fontFamily: 'var(--font-display)', marginBottom: '4px' },
    cardMeta: { fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '12px' },
    cardDetails: { display: 'flex', gap: '16px', marginBottom: '12px' },
    detail: { display: 'flex', flexDirection: 'column', gap: '2px' },
    detailLabel: { fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' },
    detailValue: { fontSize: '0.875rem', fontWeight: '600' },
    addCard: {
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '280px', borderStyle: 'dashed', color: 'var(--text-muted)',
        background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '2px dashed var(--border)',
        cursor: 'pointer', transition: 'all 0.3s', textDecoration: 'none',
    },
    empty: {
        textAlign: 'center', padding: '60px 24px', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
        border: '2px dashed var(--border)',
    },
};

const bgColors = ['linear-gradient(135deg, rgba(255,107,53,0.15), rgba(255,140,90,0.1))', 'linear-gradient(135deg, rgba(0,180,216,0.15), rgba(72,202,228,0.1))', 'linear-gradient(135deg, rgba(45,198,83,0.15), rgba(100,220,130,0.1))'];

export default function PetsPage() {
    const { user } = useUser();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !supabase) return;
        supabase
            .from('pets')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .then(({ data }) => { setPets(data || []); setLoading(false); });
    }, [user]);

    return (
        <div className="animate-fade-in">
            <div style={s.header}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'var(--font-display)' }}>My Pets</h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {loading ? 'Loading...' : `${pets.length} pet${pets.length !== 1 ? 's' : ''} registered`}
                    </p>
                </div>
                <Link href="/dashboard/pets/new" className="btn btn-primary">+ Add Pet</Link>
            </div>

            {!loading && pets.length === 0 ? (
                <div style={s.empty}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🐾</div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>No pets yet</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Add your first pet to start their digital profile!</p>
                    <Link href="/dashboard/pets/new" className="btn btn-primary">+ Add Your First Pet</Link>
                </div>
            ) : (
                <div style={s.grid}>
                    {pets.map((pet, i) => (
                        <Link
                            key={pet.id}
                            href={`/dashboard/pets/${pet.id}`}
                            style={s.card}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <div style={{ ...s.cardTop, background: bgColors[i % bgColors.length] }}>
                                {petEmojis[pet.species] || '🐾'}
                            </div>
                            <div style={s.cardBody}>
                                <div style={s.cardName}>{pet.name}</div>
                                <div style={s.cardMeta}>{pet.breed || 'Unknown breed'} • {pet.species}</div>
                                <div style={s.cardDetails}>
                                    <div style={s.detail}>
                                        <span style={s.detailLabel}>Age</span>
                                        <span style={s.detailValue}>{pet.dob ? getPetAge(pet.dob) : '—'}</span>
                                    </div>
                                    <div style={s.detail}>
                                        <span style={s.detailLabel}>Weight</span>
                                        <span style={s.detailValue}>{pet.weight ? `${pet.weight} kg` : '—'}</span>
                                    </div>
                                    <div style={s.detail}>
                                        <span style={s.detailLabel}>Gender</span>
                                        <span style={s.detailValue}>{pet.gender || '—'}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}

                    <Link
                        href="/dashboard/pets/new"
                        style={s.addCard}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                        <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>+</div>
                        <div style={{ fontSize: '0.9375rem', fontWeight: '600' }}>Add New Pet</div>
                    </Link>
                </div>
            )}
        </div>
    );
}
