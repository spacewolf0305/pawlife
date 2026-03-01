'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';

const typeStyles = {
    vaccine: { bg: 'rgba(0,180,216,0.1)', color: 'var(--accent)', icon: '💉' },
    checkup: { bg: 'rgba(45,198,83,0.1)', color: 'var(--success)', icon: '🩺' },
    medication: { bg: 'rgba(255,182,39,0.1)', color: 'var(--warning)', icon: '💊' },
    surgery: { bg: 'rgba(239,71,111,0.1)', color: 'var(--danger)', icon: '🏥' },
};

const s = {
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    reminders: { display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '32px' },
    reminderCard: {
        minWidth: '240px', padding: '16px', borderRadius: 'var(--radius-lg)', border: '2px solid var(--warning)',
        background: 'rgba(255,182,39,0.05)', display: 'flex', gap: '12px', alignItems: 'center',
    },
    reminderIcon: {
        width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'rgba(255,182,39,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0,
    },
    reminderTitle: { fontWeight: '600', fontSize: '0.875rem' },
    reminderMeta: { fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' },
    filters: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
    filterBtn: {
        padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', fontWeight: '600',
        border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)',
        cursor: 'pointer', transition: 'all 0.2s',
    },
    filterActive: { background: 'var(--primary)', color: '#FFF', borderColor: 'var(--primary)' },
    timeline: { display: 'flex', flexDirection: 'column', gap: '12px' },
    record: {
        display: 'flex', gap: '16px', padding: '20px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)',
        border: '1px solid var(--border-light)', alignItems: 'flex-start', transition: 'all 0.3s',
    },
    recordIcon: {
        width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0,
    },
    recordTitle: { fontWeight: '700', fontSize: '1rem', marginBottom: '4px' },
    recordMeta: { fontSize: '0.8125rem', color: 'var(--text-secondary)' },
    recordDetails: { display: 'flex', gap: '16px', marginTop: '8px', flexWrap: 'wrap' },
    recordDetail: { fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' },
    addModal: { display: 'flex', flexDirection: 'column', gap: '16px' },
    empty: {
        textAlign: 'center', padding: '60px 24px', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
        border: '2px dashed var(--border)',
    },
};

const petEmojis = { Dog: '🐕', Cat: '🐈', Bird: '🐦', Fish: '🐠', Rabbit: '🐇' };

export default function HealthPage() {
    const { user } = useUser();
    const [filter, setFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [records, setRecords] = useState([]);
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ pet_id: '', type: 'vaccine', title: '', date: '', next_reminder: '', vet_name: '', notes: '' });

    useEffect(() => {
        if (!user || !supabase) return;

        async function load() {
            const { data: petsData } = await supabase.from('pets').select('*').eq('user_id', user.id);
            setPets(petsData || []);

            if (petsData && petsData.length > 0) {
                const petIds = petsData.map(p => p.id);
                const { data: recordsData } = await supabase
                    .from('health_records')
                    .select('*, pets(name, species)')
                    .in('pet_id', petIds)
                    .order('date', { ascending: false });
                setRecords(recordsData || []);
            }
            setLoading(false);
        }
        load();
    }, [user]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!supabase) return;
        setSaving(true);

        const { error } = await supabase.from('health_records').insert({
            pet_id: formData.pet_id,
            type: formData.type,
            title: formData.title,
            date: formData.date,
            next_reminder: formData.next_reminder || null,
            vet_name: formData.vet_name || null,
            notes: formData.notes || null,
        });

        if (!error) {
            // Refresh records
            const petIds = pets.map(p => p.id);
            const { data } = await supabase.from('health_records').select('*, pets(name, species)').in('pet_id', petIds).order('date', { ascending: false });
            setRecords(data || []);
            setShowModal(false);
            setFormData({ pet_id: '', type: 'vaccine', title: '', date: '', next_reminder: '', vet_name: '', notes: '' });
        }
        setSaving(false);
    };

    const upcomingReminders = records.filter(r => r.next_reminder && new Date(r.next_reminder) <= new Date(Date.now() + 30 * 86400000));
    const filtered = filter === 'all' ? records : records.filter(r => r.type === filter);

    return (
        <div className="animate-fade-in">
            <div style={s.header}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'var(--font-display)' }}>Health Tracker</h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {loading ? 'Loading...' : `${records.length} health record${records.length !== 1 ? 's' : ''}`}
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)} disabled={pets.length === 0}>
                    + Add Record
                </button>
            </div>

            {!loading && pets.length === 0 ? (
                <div style={s.empty}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>💉</div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>No pets to track</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Add a pet first, then you can start tracking their health records.</p>
                    <a href="/dashboard/pets/new" className="btn btn-primary">+ Add a Pet First</a>
                </div>
            ) : (
                <>
                    {/* Upcoming Reminders */}
                    {upcomingReminders.length > 0 && (
                        <>
                            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>⏰ Upcoming Reminders</h3>
                            <div style={s.reminders}>
                                {upcomingReminders.map(r => (
                                    <div key={r.id} style={s.reminderCard}>
                                        <div style={s.reminderIcon}>⏰</div>
                                        <div>
                                            <div style={s.reminderTitle}>{r.title} — {r.pets?.name || 'Pet'}</div>
                                            <div style={s.reminderMeta}>Due {new Date(r.next_reminder).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Filters */}
                    <div style={s.filters}>
                        {['all', 'vaccine', 'checkup', 'medication', 'surgery'].map(f => (
                            <button key={f} style={{ ...s.filterBtn, ...(filter === f ? s.filterActive : {}) }} onClick={() => setFilter(f)}>
                                {f === 'all' ? '📋 All' : `${typeStyles[f]?.icon} ${f.charAt(0).toUpperCase() + f.slice(1)}s`}
                            </button>
                        ))}
                    </div>

                    {/* Timeline */}
                    {!loading && filtered.length === 0 ? (
                        <div style={s.empty}>
                            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📋</div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '4px' }}>No health records yet</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Click "+ Add Record" to log your pet's first health entry.</p>
                        </div>
                    ) : (
                        <div style={s.timeline}>
                            {filtered.map(r => {
                                const ts = typeStyles[r.type] || typeStyles.checkup;
                                return (
                                    <div
                                        key={r.id}
                                        style={s.record}
                                        onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateX(0)'; }}
                                    >
                                        <div style={{ ...s.recordIcon, background: ts.bg }}>{ts.icon}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={s.recordTitle}>{r.title}</div>
                                            <div style={s.recordMeta}>
                                                <span style={{ color: ts.color, fontWeight: '600' }}>{r.type.toUpperCase()}</span> • {r.pets?.name || 'Pet'} {petEmojis[r.pets?.species] || '🐾'}
                                            </div>
                                            <div style={s.recordDetails}>
                                                <span style={s.recordDetail}>📅 {new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                {r.vet_name && <span style={s.recordDetail}>👨‍⚕️ {r.vet_name}</span>}
                                                {r.notes && <span style={s.recordDetail}>📝 {r.notes}</span>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {/* Add Record Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', fontFamily: 'var(--font-display)', marginBottom: '20px' }}>Add Health Record</h3>
                        <form style={s.addModal} onSubmit={handleSave}>
                            <div className="input-group">
                                <label>Pet</label>
                                <select className="input" value={formData.pet_id} onChange={e => setFormData({ ...formData, pet_id: e.target.value })} required>
                                    <option value="">Select a pet...</option>
                                    {pets.map(p => <option key={p.id} value={p.id}>{p.name} {petEmojis[p.species] || '🐾'}</option>)}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Type</label>
                                <select className="input" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                    <option value="vaccine">💉 Vaccine</option>
                                    <option value="checkup">🩺 Checkup</option>
                                    <option value="medication">💊 Medication</option>
                                    <option value="surgery">🏥 Surgery</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Title</label>
                                <input className="input" placeholder="e.g., Rabies Vaccine" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div className="input-group"><label>Date</label><input type="date" className="input" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required /></div>
                                <div className="input-group"><label>Next Reminder</label><input type="date" className="input" value={formData.next_reminder} onChange={e => setFormData({ ...formData, next_reminder: e.target.value })} /></div>
                            </div>
                            <div className="input-group"><label>Vet Name</label><input className="input" placeholder="Dr. Sharma" value={formData.vet_name} onChange={e => setFormData({ ...formData, vet_name: e.target.value })} /></div>
                            <div className="input-group"><label>Notes</label><textarea className="input" placeholder="Optional notes..." value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} /></div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>{saving ? '⏳ Saving...' : 'Save Record'}</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
