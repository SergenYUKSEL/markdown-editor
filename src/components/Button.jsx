// But : bouton réutilisable avec variantes
// Props : variant (primary, secondary, danger), size (small, medium, large), onClick, disabled, children, className, style
function Button({ 
    children, 
    onClick, 
    variant = 'primary', 
    size = 'medium', 
    disabled = false,
    type = 'button',
    className = '',
    style = {}
}) {
    // Styles selon la variante
    const variantStyles = {
        primary: {
            backgroundColor: '#007bff',
            color: 'white',
            border: '1px solid #007bff'
        },
        secondary: {
            backgroundColor: '#6c757d',
            color: 'white',
            border: '1px solid #6c757d'
        },
        danger: {
            backgroundColor: '#dc3545',
            color: 'white',
            border: '1px solid #dc3545'
        }
    };

    // Styles selon la taille
    const sizeStyles = {
        small: {
            padding: '0.25rem 0.5rem',
            fontSize: '0.875rem'
        },
        medium: {
            padding: '0.5rem 1rem',
            fontSize: '1rem'
        },
        large: {
            padding: '0.75rem 1.5rem',
            fontSize: '1.125rem'
        }
    };

    const baseStyle = {
        borderRadius: '0.25rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: 'none',
        fontWeight: '500',
        transition: 'opacity 0.2s',
        opacity: disabled ? 0.6 : 1,
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style
    };

    return (
        <button 
            type={type}
            onClick={disabled ? undefined : onClick} 
            disabled={disabled}
            style={baseStyle}
            className={className}
        >
            {children}
        </button>
    );
}

export default Button;