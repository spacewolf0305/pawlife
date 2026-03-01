'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';

export default function ReportLostFoundPage() {
    const router = useRouter();
    const { user } = useUser();
    const [form, setForm] = useState({ petName: '', species: 'Dog', status: 'lost', description: '', address: '', contactPhone: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!supabase || !user) return;
        setSaving(true);
        setError('');

        const { error: insertError } = await supabase.from('lost_found').insert({
            user_id: user.id,
            pet_name: form.petName,
            species: form.species,
            status: form.status,
            description: form.description,
            address: form.address,
            contact_phone: form.contactPhone || null,
        });

        if (insertError) {
            setError(insertError.message);
            setSaving(false);
            return;
        }
        router.push('/dashboard/lost-found');
    };

    return (
        <div style={{ maxWidth: '600px' }} className="animate-fade-in">
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'var(--font-display)', marginBottom: '24px' }}>Report Lost/Found Pet</h2>

            {error && (
                <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(239,71,111,0.1)', color: 'var(--danger)', fontSize: '0.875rem', marginBottom: '16px' }}>
                    ⚠️ {error}
                </div>
            )}

            <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleSubmit}>
                <div style={{ width: '100%', height: '200px', borderRadius: 'var(--radius-xl)', border: '2px dashed var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
                    <span style={{ fontSize: '2.5rem' }}>📷</span>
                    <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>Upload Pet Photo</span>
                    <span style={{ fontSize: '0.75rem' }}>Coming soon</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" className={`btn ${form.status === 'lost' ? 'btn-danger' : 'btn-secondary'}`} style={{ flex: 1 }} onClick={() => update('status', 'lost')}>🚨 Lost</button>
                    <button type="button" className={`btn ${form.status === 'found' ? 'btn-accent' : 'btn-secondary'}`} style={{ flex: 1 }} onClick={() => update('status', 'found')}>✅ Found</button>
                </div>

                <div className="input-group"><label>Pet Name *</label><input className="input" placeholder="e.g., Charlie" value={form.petName} onChange={e => update('petName', e.target.value)} required /></div>
                <div className="input-group"><label>Species</label>
                    <select className="input" value={form.species} onChange={e => update('species', e.target.value)}>
                        <option>Dog</option><option>Cat</option><option>Bird</option><option>Other</option>
                    </select>
                </div>
                <div className="input-group"><label>Description *</label><textarea className="input" placeholder="Describe the pet, any identifying features, collar color, etc." value={form.description} onChange={e => update('description', e.target.value)} required /></div>
                <div className="input-group"><label>Last Seen Location *</label><input className="input" placeholder="e.g., Near MG Road Park, Bangalore" value={form.address} onChange={e => update('address', e.target.value)} required /></div>
                <div className="input-group"><label>Contact Phone</label><input className="input" placeholder="+91 98765 43210" value={form.contactPhone} onChange={e => update('contactPhone', e.target.value)} /></div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
                        {saving ? '⏳ Submitting...' : '🚨 Submit Report'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => router.back()}>Cancel</button>
                </div>
            </form>
        </div>
    );
}
