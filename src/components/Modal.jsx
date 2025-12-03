import { useEffect } from 'react';

// But : modale réutilisable
// Props : isOpen, onClose, title, children, size (small, medium, large)
function Modal({ isOpen, onClose, title, children, size = 'medium' }) {
    // Gestion de la touche ESC pour fermer
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Tailles de modale
    const sizeStyles = {
        small: { width: '400px', maxWidth: '90%' },
        medium: { width: '600px', maxWidth: '90%' },
        large: { width: '800px', maxWidth: '90%' }
    };

    if (!isOpen) return null;

    return (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}
            onClick={onClose} // Fermer en cliquant sur l'overlay
        >
            <div 
                style={{
                    ...sizeStyles[size],
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    maxHeight: '90vh',
                    overflow: 'auto'
                }}
                onClick={(e) => e.stopPropagation()} // Empêcher la fermeture en cliquant dans la modale
            >
                {title && (
                    <div style={{ 
                        marginBottom: '1rem', 
                        paddingBottom: '1rem', 
                        borderBottom: '1px solid #eee',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{title}</h2>
                        <button 
                            onClick={onClose} 
                            style={{ 
                                background: 'none',
                                border: 'none',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                padding: '0.25rem 0.5rem',
                                color: '#666'
                            }}
                            aria-label="Fermer"
                        >
                            ×
                        </button>
                    </div>
                )}
                {!title && (
                    <button 
                        onClick={onClose} 
                        style={{ 
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            padding: '0.25rem 0.5rem',
                            color: '#666'
                        }}
                        aria-label="Fermer"
                    >
                        ×
                    </button>
                )}
                {children}
            </div>
        </div>
    );
}

export default Modal;