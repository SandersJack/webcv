import React from 'react';

interface FloorDetailProps {
  floorId: string;
  isActive: boolean;
}

/* ── Lobby: double entrance doors + welcome mat ── */
const LobbyDetail = ({ isActive }: { isActive: boolean }) => (
  <svg viewBox="0 0 56 44" width="56" height="44" style={{ imageRendering: 'pixelated' }}>
    {/* Left door frame */}
    <rect x="2" y="4" width="22" height="32" fill="#5a3e10" />
    {/* Left door panel */}
    <rect x="4" y="6" width="18" height="28" fill="#a07830" />
    {/* Left door window */}
    <rect x="6" y="8" width="14" height="10" fill={isActive ? '#a8d8f0' : '#3a5a70'} />
    {/* Left handle */}
    <rect x="20" y="20" width="3" height="5" fill="#ffd060" />

    {/* Right door frame */}
    <rect x="32" y="4" width="22" height="32" fill="#5a3e10" />
    {/* Right door panel */}
    <rect x="34" y="6" width="18" height="28" fill="#a07830" />
    {/* Right door window */}
    <rect x="36" y="8" width="14" height="10" fill={isActive ? '#a8d8f0' : '#3a5a70'} />
    {/* Right handle */}
    <rect x="33" y="20" width="3" height="5" fill="#ffd060" />

    {/* Door gap */}
    <rect x="26" y="4" width="4" height="32" fill="#3a2008" />

    {/* Welcome mat */}
    <rect x="4" y="37" width="48" height="6" fill="#c0392b" />
    <rect x="4" y="37" width="8" height="6" fill="#e74c3c" />
    <rect x="16" y="37" width="8" height="6" fill="#e74c3c" />
    <rect x="28" y="37" width="8" height="6" fill="#e74c3c" />
    <rect x="40" y="37" width="8" height="6" fill="#e74c3c" />

    {/* Top step */}
    <rect x="0" y="2" width="56" height="2" fill="#7a5a10" />
  </svg>
);

/* ── About: person at desk with laptop ── */
const AboutDetail = ({ isActive }: { isActive: boolean }) => (
  <svg viewBox="0 0 56 44" width="56" height="44" style={{ imageRendering: 'pixelated' }}>
    {/* Desk surface */}
    <rect x="2" y="26" width="52" height="6" fill="#7a5a10" />
    <rect x="2" y="26" width="52" height="2" fill="#a07830" />
    {/* Desk legs */}
    <rect x="4" y="32" width="4" height="10" fill="#5a3e10" />
    <rect x="48" y="32" width="4" height="10" fill="#5a3e10" />

    {/* Laptop base */}
    <rect x="22" y="22" width="20" height="4" fill="#5a3e10" />
    {/* Laptop screen */}
    <rect x="24" y="8" width="16" height="14" fill="#3a2008" />
    {/* Screen glow */}
    <rect x="26" y="10" width="12" height="10" fill={isActive ? '#7ed321' : '#1a3010'} />
    {/* Code lines on screen */}
    {isActive && (
      <>
        <rect x="27" y="11" width="6" height="1" fill="#4a90e2" />
        <rect x="27" y="13" width="9" height="1" fill="#e8c980" />
        <rect x="27" y="15" width="5" height="1" fill="#4a90e2" />
        <rect x="27" y="17" width="8" height="1" fill="#e8c980" />
      </>
    )}

    {/* Person: head */}
    <rect x="6" y="10" width="8" height="8" fill="#e8c980" />
    {/* Hair */}
    <rect x="6" y="10" width="8" height="3" fill="#5a3e10" />
    {/* Body */}
    <rect x="5" y="18" width="10" height="8" fill="#4a90e2" />
    {/* Arms on desk */}
    <rect x="14" y="22" width="8" height="4" fill="#4a90e2" />

    {/* Bookshelf */}
    <rect x="44" y="4" width="10" height="22" fill="#7a5a10" />
    <rect x="45" y="6" width="8" height="4" fill="#e74c3c" />
    <rect x="45" y="11" width="8" height="4" fill="#4a90e2" />
    <rect x="45" y="16" width="8" height="4" fill="#7ed321" />
    <rect x="44" y="24" width="10" height="2" fill="#5a3e10" />
  </svg>
);

/* ── Skills: tech lab with monitor + tools ── */
const SkillsDetail = ({ isActive }: { isActive: boolean }) => (
  <svg viewBox="0 0 56 44" width="56" height="44" style={{ imageRendering: 'pixelated' }}>
    {/* Monitor frame */}
    <rect x="8" y="4" width="32" height="24" fill="#3a2008" />
    {/* Screen */}
    <rect x="10" y="6" width="28" height="20" fill={isActive ? '#0d1a2e' : '#08101a'} />
    {/* Code on screen */}
    <rect x="12" y="8" width="10" height="2" fill={isActive ? '#4a90e2' : '#1a2a3a'} />
    <rect x="12" y="11" width="16" height="2" fill={isActive ? '#7ed321' : '#1a2a1a'} />
    <rect x="12" y="14" width="8" height="2" fill={isActive ? '#e94560' : '#2a1a1a'} />
    <rect x="12" y="17" width="20" height="2" fill={isActive ? '#f5a623' : '#2a1a0a'} />
    <rect x="12" y="20" width="12" height="2" fill={isActive ? '#9b59b6' : '#1a0a2a'} />
    {/* Monitor stand */}
    <rect x="22" y="28" width="8" height="4" fill="#5a3e10" />
    <rect x="18" y="32" width="16" height="3" fill="#5a3e10" />

    {/* Keyboard */}
    <rect x="10" y="36" width="28" height="6" fill="#7a5a10" />
    <rect x="11" y="37" width="4" height="2" fill="#5a3e10" />
    <rect x="16" y="37" width="4" height="2" fill="#5a3e10" />
    <rect x="21" y="37" width="6" height="2" fill="#5a3e10" />
    <rect x="28" y="37" width="4" height="2" fill="#5a3e10" />
    <rect x="33" y="37" width="4" height="2" fill="#5a3e10" />

    {/* Gear icon (right side) */}
    <rect x="42" y="10" width="4" height="12" fill={isActive ? '#f5a623' : '#8b6914'} />
    <rect x="38" y="14" width="12" height="4" fill={isActive ? '#f5a623' : '#8b6914'} />
    <rect x="40" y="12" width="8" height="8" fill={isActive ? '#f5a623' : '#8b6914'} />
    <rect x="43" y="15" width="2" height="2" fill="#3a2008" />

    {/* Screen glow */}
    {isActive && (
      <rect x="10" y="6" width="28" height="20" fill="#4a90e2" opacity="0.05" />
    )}
  </svg>
);

/* ── Projects: physics lab — atom + particle detector ── */
const ProjectsDetail = ({ isActive }: { isActive: boolean }) => {
  const color = isActive ? '#9b59b6' : '#4a2a6a';
  const glow = isActive ? '#e8c980' : '#5a3e10';
  return (
    <svg viewBox="0 0 56 44" width="56" height="44" style={{ imageRendering: 'pixelated' }}>
      {/* Nucleus */}
      <rect x="24" y="18" width="8" height="8" fill={glow} />
      <rect x="26" y="16" width="4" height="12" fill={glow} />
      <rect x="22" y="20" width="12" height="4" fill={glow} />

      {/* Orbital ring 1 (horizontal dots) */}
      <rect x="4" y="21" width="4" height="2" fill={color} />
      <rect x="10" y="21" width="4" height="2" fill={color} />
      <rect x="16" y="21" width="4" height="2" fill={color} />
      <rect x="36" y="21" width="4" height="2" fill={color} />
      <rect x="42" y="21" width="4" height="2" fill={color} />
      <rect x="48" y="21" width="4" height="2" fill={color} />

      {/* Orbital ring 2 (vertical dots) */}
      <rect x="26" y="2" width="4" height="4" fill={color} />
      <rect x="26" y="8" width="4" height="4" fill={color} />
      <rect x="26" y="32" width="4" height="4" fill={color} />
      <rect x="26" y="38" width="4" height="4" fill={color} />

      {/* Diagonal orbital dots */}
      <rect x="8" y="6" width="3" height="3" fill={color} />
      <rect x="14" y="10" width="3" height="3" fill={color} />
      <rect x="44" y="6" width="3" height="3" fill={color} />
      <rect x="40" y="10" width="3" height="3" fill={color} />
      <rect x="8" y="34" width="3" height="3" fill={color} />
      <rect x="14" y="30" width="3" height="3" fill={color} />
      <rect x="44" y="34" width="3" height="3" fill={color} />
      <rect x="40" y="30" width="3" height="3" fill={color} />

      {/* Electrons */}
      <rect x="4" y="20" width="4" height="4" fill={isActive ? '#e94560' : '#6a1a2a'} />
      <rect x="26" y="2" width="4" height="4" fill={isActive ? '#4a90e2' : '#1a2a5a'} />
      <rect x="48" y="20" width="4" height="4" fill={isActive ? '#7ed321' : '#1a3a10'} />
    </svg>
  );
};

/* ── Contact: post office / envelope ── */
const ContactDetail = ({ isActive }: { isActive: boolean }) => (
  <svg viewBox="0 0 56 44" width="56" height="44" style={{ imageRendering: 'pixelated' }}>
    {/* Envelope body */}
    <rect x="4" y="10" width="48" height="30" fill="#7a5a10" />
    <rect x="6" y="12" width="44" height="26" fill={isActive ? '#d4b878' : '#a07830'} />

    {/* Envelope flap (pixel V shape) */}
    <rect x="6" y="12" width="8" height="2" fill="#5a3e10" />
    <rect x="8" y="14" width="8" height="2" fill="#5a3e10" />
    <rect x="12" y="16" width="8" height="2" fill="#5a3e10" />
    <rect x="16" y="18" width="8" height="2" fill="#5a3e10" />
    <rect x="20" y="20" width="8" height="2" fill="#5a3e10" />
    <rect x="24" y="22" width="8" height="2" fill="#5a3e10" />
    <rect x="32" y="20" width="8" height="2" fill="#5a3e10" />
    <rect x="36" y="18" width="8" height="2" fill="#5a3e10" />
    <rect x="40" y="16" width="8" height="2" fill="#5a3e10" />
    <rect x="42" y="14" width="6" height="2" fill="#5a3e10" />
    <rect x="44" y="12" width="6" height="2" fill="#5a3e10" />

    {/* Wax seal */}
    <rect x="24" y="20" width="8" height="8" fill={isActive ? '#e94560' : '#8b1a2a'} />
    <rect x="26" y="22" width="4" height="4" fill={isActive ? '#ff6080' : '#6a1020'} />

    {/* Address lines */}
    <rect x="10" y="30" width="16" height="2" fill="#5a3e10" />
    <rect x="10" y="34" width="12" height="2" fill="#5a3e10" />

    {/* Stamp */}
    <rect x="38" y="28" width="10" height="8" fill="#e74c3c" />
    <rect x="39" y="29" width="8" height="6" fill={isActive ? '#ff8060' : '#c0392b'} />

    {/* Top decorative border */}
    <rect x="4" y="8" width="48" height="2" fill="#5a3e10" />
    <rect x="6" y="6" width="44" height="2" fill="#5a3e10" />
  </svg>
);

export const FloorDetail = ({ floorId, isActive }: FloorDetailProps) => {
  switch (floorId) {
    case 'lobby':    return <LobbyDetail isActive={isActive} />;
    case 'about':    return <AboutDetail isActive={isActive} />;
    case 'skills':   return <SkillsDetail isActive={isActive} />;
    case 'projects': return <ProjectsDetail isActive={isActive} />;
    case 'contact':  return <ContactDetail isActive={isActive} />;
    default:         return null;
  }
};
