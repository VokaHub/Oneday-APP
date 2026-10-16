import React from 'react';

// Insignia oficial tipo Instagram en Verde Lima vibrante (#84cc16) con checkmark blanco
export const LimeVerifiedBadge = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block shrink-0 select-none"
  >
    {/* Roseta estrellada en verde lima */}
    <path
      d="M12 1.8L14.4 4.3L17.7 3.8L18.8 6.9L21.9 8.2L21.3 11.5L23.1 14.3L20.8 16.7L21.2 20L18 20.6L16.2 23.3L13.1 22L10.3 23.6L8.7 20.9L5.4 20.7L5.3 17.4L2.6 15.5L3.8 12.4L1.9 9.8L4.6 8L4.6 4.7L7.9 4.9L10 2.6L12 1.8Z"
      fill="#84cc16"
      stroke="#65a30d"
      strokeWidth="0.5"
    />
    {/* Checkmark blanco interior */}
    <path
      d="M8.2 12.3L10.7 14.8L16 9.3"
      stroke="#ffffff"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Versión de la marca en gris como faltante estilo Instagram
export const GrayVerifiedBadge = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block shrink-0 select-none"
  >
    {/* Roseta en gris */}
    <path
      d="M12 1.8L14.4 4.3L17.7 3.8L18.8 6.9L21.9 8.2L21.3 11.5L23.1 14.3L20.8 16.7L21.2 20L18 20.6L16.2 23.3L13.1 22L10.3 23.6L8.7 20.9L5.4 20.7L5.3 17.4L2.6 15.5L3.8 12.4L1.9 9.8L4.6 8L4.6 4.7L7.9 4.9L10 2.6L12 1.8Z"
      fill="#d1d5db"
      stroke="#9ca3af"
      strokeWidth="0.5"
    />
    {/* Checkmark blanco interior */}
    <path
      d="M8.2 12.3L10.7 14.8L16 9.3"
      stroke="#ffffff"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
