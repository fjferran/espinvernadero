import React, { useState } from 'react';

export default function CodeBlock({ code }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ position: 'relative' }}>
            <button
                className="copy-btn"
                onClick={handleCopy}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    margin: 0
                }}
            >
                {copied ? '¡Copiado!' : 'Copiar'}
            </button>
            <pre style={{ margin: 0 }}>
                <code>{code}</code>
            </pre>
        </div>
    );
}
