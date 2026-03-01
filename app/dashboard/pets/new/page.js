'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';

const s = {
    page: { maxWidth: '600px' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    photoUpload: {
        width: '100%', height: '200px', borderRadius: 'var(--radius-xl)', border: '2px dashed var(--border)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
        cursor: 'pointer', transition: 'all 0.3s', background: 'var(--bg-hover)', color: 'var(--text-muted)',
    },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
};

export default function AddPetPage() {
    const router = useRouter();
    const { user } = useUser();
    const [form, setForm] = useState({ name: '', species: 'Dog', breed: '', dob: '', weight: '', gender: 'Male', microchipId: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!supabase || !user) return;

        setSaving(true);
        setError('');

        const { error: insertError } = await supabase.from('pets').insert({
            user_id: user.id,
            name: form.name,
            species: form.species,
            breed: form.breed || null,
            dob: form.dob || null,
            weight: form.weight ? parseFloat(form.weight) : null,
            gender: form.gender,
            microchip_id: form.microchipId || null,
        });

        if (insertError) {
            setError(insertError.message);
            setSaving(false);
            return;
        }

        router.push('/dashboard/pets');
    };

    return (
        <div style={s.page} className="animate-fade-in">
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'var(--font-display)', marginBottom: '24px' }}>
                Add New Pet
            </h2>

            {error && (
                <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(239,71,111,0.1)', color: 'var(--danger)', fontSize: '0.875rem', marginBottom: '16px' }}>
                    ⚠️ {error}
                </div>
            )}

            <form style={s.form} onSubmit={handleSubmit}>
                <div
                    style={s.photoUpload}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                    <span style={{ fontSize: '2.5rem' }}>📷</span>
                    <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>Upload Pet Photo</span>
                    <span style={{ fontSize: '0.75rem' }}>Coming soon</span>
                </div>

                <div className="input-group">
                    <label>Pet Name *</label>
                    <input className="input" placeholder="e.g., Max" value={form.name} onChange={e => update('name', e.target.value)} required />
                </div>

                <div style={s.row}>
                    <div className="input-group">
                        <label>Species *</label>
                        <select className="input" value={form.species} onChange={e => update('species', e.target.value)}>
                            <option>Dog</option>
                            <option>Cat</option>
                            <option>Bird</option>
                            <option>Fish</option>
                            <option>Rabbit</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Breed</label>
                        <input className="input" placeholder="e.g., Golden Retriever" value={form.breed} onChange={e => update('breed', e.target.value)} />
                    </div>
                </div>

                <div style={s.row}>
                    <div className="input-group">
                        <label>Date of Birth</label>
                        <input type="date" className="input" value={form.dob} onChange={e => update('dob', e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Weight (kg)</label>
                        <input type="number" className="input" placeholder="e.g., 28" value={form.weight} onChange={e => update('weight', e.target.value)} />
                    </div>
                </div>

                <div style={s.row}>
                    <div className="input-group">
                        <label>Gender</label>
                        <select className="input" value={form.gender} onChange={e => update('gender', e.target.value)}>
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Microchip ID</label>
                        <input className="input" placeholder="Optional" value={form.microchipId} onChange={e => update('microchipId', e.target.value)} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
                        {saving ? '⏳ Saving...' : '🐾 Add Pet'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => router.back()}>Cancel</button>
                </div>
            </form>
        </div>
    );
}
