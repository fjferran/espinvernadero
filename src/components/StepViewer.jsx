import React from 'react';
import CodeBlock from './CodeBlock';

export default function StepViewer({ step, onNext, onPrev, isFirst, isLast }) {
    return (
        <div className="premium-card fade-in">
            <h2>{step.title}</h2>

            <div
                className="step-content"
                dangerouslySetInnerHTML={{ __html: step.content }}
            />

            {step.code && <CodeBlock code={step.code} />}

            <div className="step-nav">
                <button
                    onClick={onPrev}
                    disabled={isFirst}
                    className="secondary"
                >
                    Anterior
                </button>
                <button
                    onClick={onNext}
                >
                    {isLast ? '¡Finalizar!' : 'Siguiente'}
                </button>
            </div>
        </div>
    );
}
