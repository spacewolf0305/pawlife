'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { timeAgo } from '@/lib/utils';

const avatarColors = ['linear-gradient(135deg, #FF6B35, #FF8C5A)', 'linear-gradient(135deg, #0096C7, #48CAE4)', 'linear-gradient(135deg, #2DC653, #5CD87A)', 'linear-gradient(135deg, #8a4bff, #b07aff)'];

const imageBgs = [
    'linear-gradient(135deg, rgba(255,107,53,0.15), rgba(255,182,39,0.1))',
    'linear-gradient(135deg, rgba(0,180,216,0.15), rgba(72,202,228,0.1))',
    'linear-gradient(135deg, rgba(45,198,83,0.15), rgba(100,220,130,0.1))',
    'linear-gradient(135deg, rgba(138,75,255,0.15), rgba(176,122,255,0.1))',
];

const s = {
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    feed: { maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' },
    card: {
        background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)',
        overflow: 'hidden',
    },
    cardHeader: { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px' },
    avatar: {
        width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: '#FFF', fontWeight: '700', fontSize: '0.8rem', flexShrink: 0,
    },
    userName: { fontWeight: '600', fontSize: '0.9375rem' },
    userMeta: { fontSize: '0.75rem', color: 'var(--text-muted)' },
    actions: { display: 'flex', gap: '16px', padding: '12px 20px' },
    actionBtn: {
        display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: 'var(--radius-full)',
        fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s', border: 'none', background: 'transparent',
        color: 'var(--text-secondary)',
    },
    caption: { padding: '0 20px 16px', fontSize: '0.9375rem', lineHeight: '1.6' },
    captionUser: { fontWeight: '700' },
    createPost: {
        background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)',
        padding: '20px', maxWidth: '600px', margin: '0 auto 24px',
    },
    empty: {
        textAlign: 'center', padding: '60px 24px', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
        border: '2px dashed var(--border)', maxWidth: '600px', margin: '0 auto',
    },
    previewImg: {
        width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: 'var(--radius-lg)',
        marginTop: '12px',
    },
};

export default function SocialPage() {
    const { user } = useUser();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [caption, setCaption] = useState('');
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);
    const [posting, setPosting] = useState(false);
    const [likedPosts, setLikedPosts] = useState(new Set());
    const fileInputRef = useRef(null);
    const userInitials = (user?.fullName || user?.firstName || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    // Load user's liked posts from localStorage
    useEffect(() => {
        if (!user) return;
        try {
            const stored = localStorage.getItem(`pawlife_likes_${user.id}`);
            if (stored) setLikedPosts(new Set(JSON.parse(stored)));
        } catch { /* ignore */ }
    }, [user]);

    const loadPosts = async () => {
        if (!supabase) return;
        const { data } = await supabase
            .from('posts')
            .select('*, users(name, avatar_url)')
            .order('created_at', { ascending: false })
            .limit(30);
        setPosts(data || []);
        setLoading(false);
    };

    useEffect(() => { loadPosts(); }, []);

    const handlePhotoSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPhotoFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setPhotoPreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const removePhoto = () => {
        setPhotoFile(null);
        setPhotoPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handlePost = async () => {
        if (!supabase || !user || (!caption.trim() && !photoFile)) return;
        setPosting(true);

        let imageUrl = null;

        // Upload photo if selected
        if (photoFile) {
            const fileExt = photoFile.name.split('.').pop();
            const fileName = `${user.id}_${Date.now()}.${fileExt}`;

            // Try to upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('post-images')
                .upload(fileName, photoFile);

            if (!uploadError && uploadData) {
                const { data: urlData } = supabase.storage.from('post-images').getPublicUrl(fileName);
                imageUrl = urlData?.publicUrl || null;
            } else {
                // If storage isn't set up, convert to base64 as fallback
                console.warn('Storage upload failed, using post without image:', uploadError?.message);
            }
        }

        // Create post
        const { error } = await supabase.from('posts').insert({
            user_id: user.id,
            caption: caption.trim() || null,
            image_url: imageUrl,
            like_count: 0,
        });

        if (!error) {
            setCaption('');
            removePhoto();
            await loadPosts();
        }
        setPosting(false);
    };

    const handleLike = async (postId, currentLikes) => {
        if (!supabase || !user) return;

        // Check if already liked
        if (likedPosts.has(postId)) return;

        // Update in database
        await supabase.from('posts').update({ like_count: (currentLikes || 0) + 1 }).eq('id', postId);

        // Update local state
        setPosts(posts.map(p => p.id === postId ? { ...p, like_count: (p.like_count || 0) + 1 } : p));

        // Track the like
        const newLiked = new Set(likedPosts);
        newLiked.add(postId);
        setLikedPosts(newLiked);

        // Persist to localStorage
        try {
            localStorage.setItem(`pawlife_likes_${user.id}`, JSON.stringify([...newLiked]));
        } catch { /* ignore */ }
    };

    return (
        <div className="animate-fade-in">
            <div style={{ ...s.header, maxWidth: '600px', margin: '0 auto 24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'var(--font-display)' }}>Community</h2>
            </div>

            {/* Create Post */}
            <div style={s.createPost}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    {user?.imageUrl ? (
                        <img src={user.imageUrl} alt="You" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    ) : (
                        <div style={{ ...s.avatar, background: avatarColors[0], width: '40px', height: '40px', fontSize: '0.75rem' }}>{userInitials}</div>
                    )}
                    <div style={{ flex: 1 }}>
                        <textarea
                            className="input"
                            placeholder="Share a moment with your pet... 🐾"
                            value={caption}
                            onChange={e => setCaption(e.target.value)}
                            style={{ minHeight: '60px', resize: 'vertical' }}
                        />

                        {/* Photo Preview */}
                        {photoPreview && (
                            <div style={{ position: 'relative', marginTop: '12px' }}>
                                <img src={photoPreview} alt="Preview" style={s.previewImg} />
                                <button
                                    onClick={removePhoto}
                                    style={{
                                        position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px',
                                        borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none',
                                        cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                >✕</button>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'center' }}>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handlePhotoSelect}
                                style={{ display: 'none' }}
                            />
                            <button
                                className="btn btn-sm btn-secondary"
                                style={{ fontSize: '0.8125rem' }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                📷 Photo
                            </button>
                            <div style={{ flex: 1 }} />
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={handlePost}
                                disabled={posting || (!caption.trim() && !photoFile)}
                                style={{ fontSize: '0.8125rem' }}
                            >
                                {posting ? '⏳ Posting...' : '🐾 Post'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feed */}
            {!loading && posts.length === 0 ? (
                <div style={s.empty}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📸</div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>No posts yet</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Be the first to share a moment with your pet! Write something above and hit Post.</p>
                </div>
            ) : (
                <div style={s.feed}>
                    {posts.map((post, i) => {
                        const posterName = post.users?.name || 'A Pet Parent';
                        const posterInitials = posterName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                        return (
                            <div key={post.id} style={s.card}>
                                <div style={s.cardHeader}>
                                    {post.users?.avatar_url ? (
                                        <img src={post.users.avatar_url} alt={posterName} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ ...s.avatar, background: avatarColors[i % avatarColors.length] }}>{posterInitials}</div>
                                    )}
                                    <div>
                                        <div style={s.userName}>{posterName}</div>
                                        <div style={s.userMeta}>{timeAgo(post.created_at)}</div>
                                    </div>
                                </div>
                                {post.image_url && (
                                    <img src={post.image_url} alt="" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
                                )}
                                {!post.image_url && (
                                    <div style={{
                                        width: '100%', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '4rem', background: imageBgs[i % imageBgs.length],
                                    }}>🐾</div>
                                )}
                                <div style={s.actions}>
                                    <button
                                        style={{
                                            ...s.actionBtn,
                                            color: likedPosts.has(post.id) ? 'var(--danger)' : 'var(--text-secondary)',
                                            fontWeight: likedPosts.has(post.id) ? '700' : '400',
                                            cursor: likedPosts.has(post.id) ? 'default' : 'pointer',
                                        }}
                                        onClick={() => handleLike(post.id, post.like_count)}
                                        title={likedPosts.has(post.id) ? 'Already liked' : 'Like this post'}
                                    >
                                        {likedPosts.has(post.id) ? '❤️' : '🤍'} {post.like_count || 0}
                                    </button>
                                    <button style={s.actionBtn}>💬 Comment</button>
                                    <button style={s.actionBtn}>📤 Share</button>
                                </div>
                                {post.caption && (
                                    <div style={s.caption}>
                                        <span style={s.captionUser}>{posterName.split(' ')[0]}</span> {post.caption}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
