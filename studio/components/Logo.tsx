import React from 'react';

/** OIKOS wordmark για το navbar του Studio. */
export function Logo() {
  return (
    <span
      style={{
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontWeight: 800,
        fontSize: '20px',
        letterSpacing: '0.12em',
        color: '#c9a96e',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      OIKOS
      <span
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 500,
          fontSize: '11px',
          letterSpacing: '0.08em',
          color: '#8a8175',
          textTransform: 'uppercase',
        }}
      >
        Μενού
      </span>
    </span>
  );
}
