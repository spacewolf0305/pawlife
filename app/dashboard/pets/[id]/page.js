'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { getPetAge } from '@/lib/utils';

const petEmojis = { Dog: '🐕', Cat: '🐈', Bird: '🐦', Fish: '🐠', Rabbit: '🐇' };
const typeIcons = { vaccine: '💉', checkup: '🩺', medication: '💊', surgery: '🏥' };
const typeBgs = { vaccine: 'rgba(0,180,216,0.1)', checkup: 'rgba(45,198,83,0.1)', medication: 'rgba(255,182,39,0.1)', surgery: 'rgba(239,71,111,0.1)' };

const s = {
    hero: {
        borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: '24px', position: 'relative',
        height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem',
    },
    heroOverlay: {
        position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', color: '#FFF',
    },
    infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' },
    infoCard: {
        background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)',
        padding: '16px', textAlign: 'center',
    },
    infoLabel: { fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' },
    infoValue: { fontSize: '1rem', fontWeight: '700' },
    sectionTitle: { fontSize: '1.125rem', fontWeight: '700', fontFamily: 'var(--font-display)', marginBottom: '12px' },
    timeline: { display: 'flex', flexDirection: 'column', gap: '10px' },
    record: {
        display: 'flex', gap: '12px', padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)',
        border: '1px solid var(--border-light)', alignItems: 'center',
    },
    recordIcon: {
        width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0,
    },
    empty: {
        textAlign: 'center', padding: '40px 24px', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
        border: '2px dashed var(--border)',
    },
};

export default function PetDetailPage({ params }) {
    const { id } = use(params);
    const { user } = useUser();
    const [pet, setPet] = useState(null);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!supabase || !user) return;

        async function load() {
            const { data: petData } = await supabase
                .from('pets')
                .select('*')
                .eq('id', id)
                .eq('user_id', user.id)
                .single();

            if (petData) {
                setPet(petData);
                const { data: healthData } = await supabase
                    .from('health_records')
                    .select('*')
                    .eq('pet_id', id)
                    .order('date', { ascending: false });
                setRecords(healthData || []);
            }
            setLoading(false);
        }
        load();
    }, [id, user]);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this pet? This cannot be undone.')) return;
        setDeleting(true);
        await supabase.from('pets').delete().eq('id', id);
        window.location.href = '/dashboard/pets';
    };

    if (loading) {
        return <div className="animate-fade-in" style={{ textAlign: 'center', padding: '60px' }}>Loading...</div>;
    }

    if (!pet) {
        return (
            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🐾</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>Pet not found</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>This pet profile doesn&apos;t exist or you don&apos;t have access.</p>
                <Link href="/dashboard/pets" className="btn btn-primary">Back to Pets</Link>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Back */}
            <Link href="/dashboard/pets" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px', fontWeight: '500' }}>
                ← Back to Pets
            </Link>

            {/* Hero */}
            <div style={{ ...s.hero, background: 'linear-gradient(135deg, rgba(255,107,53,0.15), rgba(0,180,216,0.1))' }}>
                {petEmojis[pet.species] || '🐾'}
                <div style={s.heroOverlay}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', fontFamily: 'var(--font-display)' }}>{pet.name}</h2>
                            <p style={{ fontSize: '0.9375rem', opacity: 0.8 }}>{pet.breed || 'Unknown breed'} • {pet.species}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Grid */}
            <div style={s.infoGrid}>
                {[
                    { label: 'Age', value: pet.dob ? getPetAge(pet.dob) : '—' },
                    { label: 'Weight', value: pet.weight ? `${pet.weight} kg` : '—' },
                    { label: 'Gender', value: pet.gender || '—' },
                    { label: 'Microchip', value: pet.microchip_id || '—' },
                ].map((info, i) => (
                    <div key={i} style={s.infoCard}>
                        <div style={s.infoLabel}>{info.label}</div>
                        <div style={s.infoValue}>{info.value}</div>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                <Link href="/dashboard/health" className="btn btn-primary btn-sm">💉 Add Health Record</Link>
                <button className="btn btn-secondary btn-sm" style={{ color: 'var(--danger)' }} onClick={handleDelete} disabled={deleting}>
                    {deleting ? '⏳ Deleting...' : '🗑️ Delete Pet'}
                </button>
            </div>

            {/* Health Timeline */}
            <h3 style={s.sectionTitle}>Health History</h3>
            {records.length === 0 ? (
                <div style={s.empty}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📋</div>
                    <p style={{ color: 'var(--text-secondary)' }}>No health records yet. Add one from the Health Tracker!</p>
                </div>
            ) : (
                <div style={s.timeline}>
                    {records.map(record => (
                        <div key={record.id} style={s.record}>
                            <div style={{ ...s.recordIcon, background: typeBgs[record.type] || typeBgs.checkup }}>{typeIcons[record.type] || '📋'}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '600', fontSize: '0.9375rem' }}>{record.title}</div>
                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                                    {new Date(record.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    {record.vet_name && ` • ${record.vet_name}`}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
