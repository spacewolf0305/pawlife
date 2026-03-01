'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';

const SUGGESTIONS = [
    '🍫 Is chocolate toxic for dogs?',
    '💉 Vaccination schedule',
    '🐶 New puppy checklist',
    '🤮 My pet is vomiting',
    '✂️ Grooming & nail care tips',
    '😰 My pet has anxiety',
    '🎓 How to stop biting',
    '🦷 Pet dental care',
];

const styles = {
    // Floating bubble
    bubble: {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'var(--gradient-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 8px 32px rgba(255,107,53,0.4)',
        zIndex: 1000,
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        border: 'none',
        fontSize: '1.75rem',
    },
    bubbleHover: {
        transform: 'scale(1.1)',
        boxShadow: '0 12px 40px rgba(255,107,53,0.5)',
    },
    // Notification dot
    notifDot: {
        position: 'absolute',
        top: '2px',
        right: '2px',
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        background: 'var(--success)',
        border: '2px solid white',
    },
    // Chat panel
    panel: {
        position: 'fixed',
        bottom: '96px',
        right: '24px',
        width: '400px',
        maxHeight: '560px',
        borderRadius: '24px',
        background: 'var(--bg-card)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'chatSlideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)',
    },
    // Header
    header: {
        background: 'var(--gradient-hero)',
        padding: '20px',
        color: '#FFF',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    headerAvatar: {
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        flexShrink: 0,
    },
    headerTitle: {
        fontWeight: '700',
        fontSize: '1.0625rem',
        fontFamily: 'var(--font-display)',
    },
    headerSubtitle: {
        fontSize: '0.75rem',
        opacity: 0.7,
        marginTop: '1px',
    },
    closeBtn: {
        marginLeft: 'auto',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: 'none',
        color: '#FFF',
        fontSize: '1rem',
        transition: 'background 0.2s',
    },
    // Messages area
    messages: {
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        minHeight: '300px',
        maxHeight: '360px',
    },
    // Message bubbles
    msgUser: {
        alignSelf: 'flex-end',
        background: 'var(--gradient-primary)',
        color: '#FFF',
        padding: '10px 16px',
        borderRadius: '18px 18px 4px 18px',
        maxWidth: '80%',
        fontSize: '0.9375rem',
        lineHeight: '1.5',
        wordBreak: 'break-word',
    },
    msgBot: {
        alignSelf: 'flex-start',
        background: 'var(--bg-hover)',
        color: 'var(--text)',
        padding: '10px 16px',
        borderRadius: '18px 18px 18px 4px',
        maxWidth: '85%',
        fontSize: '0.9375rem',
        lineHeight: '1.6',
        wordBreak: 'break-word',
    },
    // Typing indicator
    typing: {
        alignSelf: 'flex-start',
        background: 'var(--bg-hover)',
        padding: '12px 18px',
        borderRadius: '18px 18px 18px 4px',
        display: 'flex',
        gap: '4px',
        alignItems: 'center',
    },
    typingDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: 'var(--text-muted)',
        animation: 'typingBounce 1.4s infinite ease-in-out',
    },
    // Suggestions
    suggestions: {
        padding: '0 16px 12px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
    },
    chip: {
        padding: '6px 12px',
        borderRadius: 'var(--radius-full)',
        background: 'rgba(255,107,53,0.08)',
        color: 'var(--primary)',
        fontSize: '0.75rem',
        fontWeight: '600',
        cursor: 'pointer',
        border: '1px solid rgba(255,107,53,0.15)',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
    },
    // Input area
    inputArea: {
        padding: '12px 16px',
        borderTop: '1px solid var(--border-light)',
        display: 'flex',
        gap: '8px',
        alignItems: 'flex-end',
    },
    input: {
        flex: 1,
        padding: '10px 16px',
        borderRadius: 'var(--radius-full)',
        border: '1.5px solid var(--border)',
        fontSize: '0.9375rem',
        outline: 'none',
        background: 'var(--bg)',
        color: 'var(--text)',
        transition: 'border-color 0.2s',
        fontFamily: 'inherit',
    },
    sendBtn: {
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        background: 'var(--gradient-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: 'none',
        color: '#FFF',
        fontSize: '1.2rem',
        transition: 'all 0.2s',
        flexShrink: 0,
    },
    sendBtnDisabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
    },
    // Welcome message
    welcome: {
        textAlign: 'center',
        padding: '16px',
        color: 'var(--text-secondary)',
        fontSize: '0.875rem',
        lineHeight: '1.6',
    },
    welcomeIcon: {
        fontSize: '2.5rem',
        marginBottom: '8px',
    },
    welcomeTitle: {
        fontWeight: '700',
        fontSize: '1rem',
        color: 'var(--text)',
        marginBottom: '4px',
    },
    // Mode badge
    modeBadge: {
        fontSize: '0.625rem',
        padding: '2px 8px',
        borderRadius: 'var(--radius-full)',
        fontWeight: '600',
        display: 'inline-block',
        marginTop: '4px',
    },
};

// Simple markdown-like formatting for bot messages
function formatMessage(text) {
    if (!text) return '';
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br/>');
}

export default function PawBuddy() {
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [petContext, setPetContext] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [hovering, setHovering] = useState(false);
    const [hasNewMsg, setHasNewMsg] = useState(true);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Fetch user's pets for context
    useEffect(() => {
        if (!user || !supabase) return;
        supabase
            .from('pets')
            .select('name, species, breed, dob')
            .eq('user_id', user.id)
            .then(({ data }) => {
                if (data) {
                    setPetContext(data.map(p => ({
                        name: p.name,
                        species: p.species,
                        breed: p.breed,
                        age: p.dob ? getAge(p.dob) : null,
                    })));
                }
            });
    }, [user]);

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Focus input when panel opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
            setHasNewMsg(false);
        }
    }, [isOpen]);

    function getAge(dob) {
        const now = new Date();
        const birth = new Date(dob);
        const years = now.getFullYear() - birth.getFullYear();
        if (years > 0) return `${years} year${years > 1 ? 's' : ''} old`;
        const months = now.getMonth() - birth.getMonth();
        if (months > 0) return `${months} month${months > 1 ? 's' : ''} old`;
        return 'newborn';
    }

    async function sendMessage(text) {
        const userMsg = text || input.trim();
        if (!userMsg) return;

        setInput('');
        setShowSuggestions(false);
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg,
                    petContext,
                    history: messages.slice(-10), // Last 10 for context
                }),
            });

            const data = await res.json();
            setMessages(prev => [...prev, {
                role: 'bot',
                content: data.reply,
                mode: data.mode,
            }]);
        } catch {
            setMessages(prev => [...prev, {
                role: 'bot',
                content: '😿 Oops! I had trouble connecting. Please try again in a moment.',
                mode: 'error',
            }]);
        }

        setIsTyping(false);
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    return (
        <>
            {/* Chat Panel */}
            {isOpen && (
                <div style={styles.panel}>
                    {/* Header */}
                    <div style={styles.header}>
                        <div style={styles.headerAvatar}>🐾</div>
                        <div>
                            <div style={styles.headerTitle}>PawBuddy</div>
                            <div style={styles.headerSubtitle}>
                                AI Pet Assistant • {petContext.length > 0 ? `Knows ${petContext.map(p => p.name).join(', ')}` : 'Ask me anything!'}
                            </div>
                        </div>
                        <button
                            style={styles.closeBtn}
                            onClick={() => setIsOpen(false)}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                        >✕</button>
                    </div>

                    {/* Messages */}
                    <div style={styles.messages}>
                        {messages.length === 0 && (
                            <div style={styles.welcome}>
                                <div style={styles.welcomeIcon}>🤖🐾</div>
                                <div style={styles.welcomeTitle}>Hey there! I&apos;m PawBuddy</div>
                                <div>Your AI pet care assistant. Ask me about nutrition, health, training, or anything pet-related!</div>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div key={i} style={msg.role === 'user' ? styles.msgUser : styles.msgBot}>
                                {msg.role === 'user' ? (
                                    msg.content
                                ) : (
                                    <>
                                        <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                                        {msg.mode && (
                                            <span style={{
                                                ...styles.modeBadge,
                                                background: msg.mode === 'ai' ? 'rgba(45,198,83,0.1)' : 'rgba(255,182,39,0.1)',
                                                color: msg.mode === 'ai' ? 'var(--success)' : 'var(--warning)',
                                            }}>
                                                {msg.mode === 'ai' ? '✨ AI' : '📚 Quick Info'}
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div style={styles.typing}>
                                <div style={{ ...styles.typingDot, animationDelay: '0s' }} />
                                <div style={{ ...styles.typingDot, animationDelay: '0.2s' }} />
                                <div style={{ ...styles.typingDot, animationDelay: '0.4s' }} />
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestion Chips */}
                    {showSuggestions && messages.length === 0 && (
                        <div style={styles.suggestions}>
                            {SUGGESTIONS.map((s, i) => (
                                <button
                                    key={i}
                                    style={styles.chip}
                                    onClick={() => sendMessage(s)}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,53,0.15)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,107,53,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,107,53,0.15)'; }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div style={styles.inputArea}>
                        <input
                            ref={inputRef}
                            style={styles.input}
                            placeholder="Ask PawBuddy..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={e => e.target.style.borderColor = 'var(--border)'}
                            disabled={isTyping}
                        />
                        <button
                            style={{ ...styles.sendBtn, ...((!input.trim() || isTyping) ? styles.sendBtnDisabled : {}) }}
                            onClick={() => sendMessage()}
                            disabled={!input.trim() || isTyping}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Bubble */}
            <button
                style={{ ...styles.bubble, ...(hovering ? styles.bubbleHover : {}) }}
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                title="Chat with PawBuddy AI"
            >
                {isOpen ? '✕' : '🐾'}
                {!isOpen && hasNewMsg && <span style={styles.notifDot} />}
            </button>

            {/* Keyframe animations */}
            <style jsx global>{`
                @keyframes chatSlideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes typingBounce {
                    0%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-6px); }
                }
                @media (max-width: 480px) {
                    .pawbuddy-panel {
                        width: calc(100vw - 32px) !important;
                        right: 16px !important;
                        bottom: 80px !important;
                    }
                }
            `}</style>
        </>
    );
}
