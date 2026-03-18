import React from 'react';

interface FloorDetailProps {
  floorId: string;
  isActive: boolean;
}

/* ── Lobby: full-width reception scene with textures ── */
const LobbyDetail = ({ isActive }: { isActive: boolean }) => (
  <svg
    viewBox="0 0 200 56"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid slice"
    style={{ imageRendering: 'pixelated', display: 'block' }}
  >
    <defs>
      <clipPath id="lobbyClip">
        <rect x="0" y="0" width="200" height="56" />
      </clipPath>
    </defs>

    {/* ── BACK WALL — brick texture ── */}
    {/* Base wall colour */}
    <rect x="0" y="0" width="200" height="40" fill="#d4b896" />
    {/* Brick rows — offset pattern */}
    {[0,6,12,18,24,30,36].map(y => (
      <g key={y}>
        {[0,16,32,48,64,80,96,112,128,144,160,176,192].map((x, i) => (
          <rect key={x} x={x + (y % 12 === 0 ? 0 : 8)} y={y} width="14" height="5" fill="none"
            stroke="#b89070" strokeWidth="1" />
        ))}
      </g>
    ))}
    {/* Wainscoting panel — lower wall */}
    <rect x="0" y="30" width="200" height="10" fill="#c8a870" />
    <rect x="0" y="30" width="200" height="1" fill="#a07840" />
    <rect x="0" y="39" width="200" height="1" fill="#a07840" />
    {/* Panel grooves */}
    {[8,24,40,56,72,88,104,120,136,152,168,184].map(x => (
      <rect key={x} x={x} y="31" width="1" height="8" fill="#a07840" />
    ))}

    {/* ── CEILING cornice ── */}
    <rect x="0" y="0" width="200" height="4" fill="#b8947a" />
    <rect x="0" y="3" width="200" height="2" fill="#c8a484" />
    {/* Ceiling lights */}
    <rect x="34" y="2" width="10" height="3" fill={isActive ? '#fffce0' : '#c8b060'} />
    <rect x="95" y="2" width="10" height="3" fill={isActive ? '#fffce0' : '#c8b060'} />
    <rect x="156" y="2" width="10" height="3" fill={isActive ? '#fffce0' : '#c8b060'} />

    {/* ── FLOOR — chequered marble tiles ── */}
    <rect x="0" y="40" width="200" height="16" fill="#e8e0d0" />
    {/* Tile grid */}
    {[0,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190].map((x, xi) =>
      [40,50].map((y, yi) => (
        (xi + yi) % 2 === 0
          ? <rect key={`${x}-${y}`} x={x} y={y} width="10" height="10" fill="#d8d0c0" />
          : null
      ))
    )}
    {/* Grout lines */}
    {[40,50].map(y => <rect key={y} x="0" y={y} width="200" height="1" fill="#c0b8a8" />)}
    {[0,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200].map(x =>
      <rect key={x} x={x} y="40" width="1" height="16" fill="#c0b8a8" />
    )}

    {/* ── DESK ── */}
    <rect x="64" y="28" width="80" height="12" fill="#8b5e3c" />
    <rect x="64" y="26" width="80" height="4" fill="#c8a070" />
    <rect x="64" y="26" width="80" height="2" fill="#ddb880" />
    {/* Desk panels */}
    <rect x="68" y="31" width="22" height="8" fill="#7a4e2c" />
    <rect x="98" y="31" width="22" height="8" fill="#7a4e2c" />
    <rect x="128" y="31" width="12" height="8" fill="#7a4e2c" />

    {/* Monitor */}
    <rect x="98" y="14" width="18" height="12" fill="#2a2a3a" />
    <rect x="100" y="16" width="14" height="8" fill={isActive ? '#1a3a6a' : '#08101a'} />
    <rect x="101" y="17" width="6" height="1" fill={isActive ? '#4a90e2' : '#0a1020'} />
    <rect x="101" y="19" width="10" height="1" fill={isActive ? '#7ed321' : '#081008'} />
    <rect x="101" y="21" width="7" height="1" fill={isActive ? '#e8c980' : '#101008'} />
    <rect x="106" y="26" width="2" height="2" fill="#2a2a3a" />

    {/* ── RECEPTIONIST ── */}
    <rect x="90" y="14" width="8" height="8" fill="#f0c080" />
    <rect x="90" y="14" width="8" height="3" fill="#4a2810" />
    <rect x="91" y="12" width="6" height="3" fill="#4a2810" />
    <rect x="88" y="22" width="12" height="6" fill="#e74c3c" />
    <rect x="84" y="23" width="5" height="4" fill="#f0c080" />
    <rect x="99" y="23" width="5" height="4" fill="#f0c080" />

    {/* ── PLANT left ── */}
    <rect x="2" y="32" width="8" height="8" fill="#8b5e1c" />
    <rect x="3" y="30" width="6" height="3" fill="#7a4e10" />
    <rect x="0" y="14" width="5" height="18" fill="#2d7a2d" />
    <rect x="3" y="10" width="7" height="22" fill="#3a9a3a" />
    <rect x="8" y="16" width="5" height="16" fill="#2d7a2d" />

    {/* ── PLANT right ── */}
    <rect x="190" y="32" width="8" height="8" fill="#8b5e1c" />
    <rect x="191" y="30" width="6" height="3" fill="#7a4e10" />
    <rect x="190" y="14" width="5" height="18" fill="#2d7a2d" />
    <rect x="192" y="10" width="7" height="22" fill="#3a9a3a" />
    <rect x="195" y="16" width="5" height="16" fill="#2d7a2d" />

    {/* ── CHAIRS right ── */}
    <rect x="162" y="30" width="20" height="10" fill="#c8a070" />
    <rect x="180" y="22" width="4" height="18" fill="#a07830" />
    <rect x="162" y="38" width="3" height="4" fill="#8b6914" />
    <rect x="177" y="38" width="3" height="4" fill="#8b6914" />

    {/* Standing visitor — smart casual, near desk */}
    {/* Head */}
    <rect x="44" y="18" width="8" height="9" fill="#e8b870" />
    {/* Short hair */}
    <rect x="44" y="18" width="8" height="3" fill="#8b5010" />
    <rect x="43" y="19" width="2" height="3" fill="#8b5010" />
    {/* Eyes */}
    <rect x="45" y="22" width="2" height="2" fill="#2a1808" />
    <rect x="49" y="22" width="2" height="2" fill="#2a1808" />
    <rect x="46" y="22" width="1" height="1" fill="#6a4020" />
    <rect x="50" y="22" width="1" height="1" fill="#6a4020" />
    {/* Eyebrows */}
    <rect x="45" y="21" width="2" height="1" fill="#7a3808" />
    <rect x="49" y="21" width="2" height="1" fill="#7a3808" />
    {/* Nose */}
    <rect x="47" y="24" width="2" height="1" fill="#c88850" />
    {/* Mouth — slight smile */}
    <rect x="46" y="26" width="4" height="1" fill="#b06040" />
    <rect x="45" y="26" width="1" height="1" fill="#b06040" />
    <rect x="50" y="26" width="1" height="1" fill="#b06040" />
    {/* Ear */}
    <rect x="43" y="22" width="1" height="3" fill="#d8a060" />
    <rect x="52" y="22" width="1" height="3" fill="#d8a060" />
    {/* Neck */}
    <rect x="46" y="27" width="4" height="2" fill="#e8b870" />
    {/* Shirt collar + tie */}
    <rect x="44" y="29" width="8" height="2" fill="#f0f0f0" />
    <rect x="47" y="29" width="2" height="6" fill="#e94560" />
    <rect x="46" y="32" width="4" height="2" fill="#c03050" />
    {/* Shirt body */}
    <rect x="43" y="30" width="10" height="10" fill="#f0f0f0" />
    {/* Shirt lines */}
    <rect x="47" y="30" width="1" height="10" fill="#d8d8d8" />
    {/* Left arm (resting on desk) */}
    <rect x="39" y="30" width="5" height="7" fill="#f0f0f0" />
    <rect x="39" y="37" width="5" height="3" fill="#e8b870" />
    {/* Right arm */}
    <rect x="53" y="30" width="4" height="7" fill="#f0f0f0" />
    <rect x="53" y="37" width="4" height="3" fill="#e8b870" />
    {/* Trousers */}
    <rect x="44" y="40" width="8" height="8" fill="#3a3a5a" />
    <rect x="47" y="40" width="2" height="8" fill="#2a2a4a" />
    {/* Shoes */}
    <rect x="43" y="47" width="5" height="3" fill="#1a1010" />
    <rect x="48" y="47" width="5" height="3" fill="#1a1010" />

    {/* ── WALKING PERSON 1 — left to right, blue shirt, briefcase ── */}
    <g clipPath="url(#lobbyClip)">
      <g>
        <animateTransform attributeName="transform" type="translate"
          from="-16 0" to="218 0" dur="7s" repeatCount="indefinite" />
        {/* Head */}
        <rect x="1" y="18" width="8" height="9" fill="#f0c080" />
        {/* Hair */}
        <rect x="1" y="18" width="8" height="3" fill="#5a2808" />
        <rect x="0" y="19" width="2" height="4" fill="#5a2808" />
        {/* Eyes */}
        <rect x="2" y="22" width="2" height="2" fill="#1a1010" />
        <rect x="6" y="22" width="2" height="2" fill="#1a1010" />
        <rect x="3" y="22" width="1" height="1" fill="#4a8ae0" />
        <rect x="7" y="22" width="1" height="1" fill="#4a8ae0" />
        {/* Eyebrows */}
        <rect x="2" y="21" width="2" height="1" fill="#5a2808" />
        <rect x="6" y="21" width="2" height="1" fill="#5a2808" />
        {/* Nose */}
        <rect x="4" y="24" width="2" height="1" fill="#c88050" />
        {/* Mouth */}
        <rect x="3" y="26" width="4" height="1" fill="#c06040" />
        {/* Ear */}
        <rect x="0" y="22" width="1" height="3" fill="#d8a870" />
        <rect x="9" y="22" width="1" height="3" fill="#d8a870" />
        {/* Neck */}
        <rect x="3" y="27" width="4" height="3" fill="#f0c080" />
        {/* Shirt collar */}
        <rect x="2" y="29" width="6" height="2" fill="#ffffff" />
        <rect x="4" y="29" width="2" height="4" fill="#e8e8e8" />
        {/* Shirt body */}
        <rect x="0" y="30" width="10" height="10" fill="#4a90e2" />
        {/* Shirt buttons */}
        <rect x="4" y="32" width="1" height="1" fill="#2a6ab0" />
        <rect x="4" y="35" width="1" height="1" fill="#2a6ab0" />
        {/* Left arm */}
        <rect x="-2" y="30" width="3" height="8" fill="#4a90e2" />
        <rect x="-2" y="37" width="3" height="3" fill="#f0c080" />
        {/* Right arm + briefcase */}
        <rect x="9" y="30" width="3" height="8" fill="#4a90e2" />
        <rect x="9" y="37" width="3" height="3" fill="#f0c080" />
        <rect x="10" y="39" width="7" height="5" fill="#8b5e1c" />
        <rect x="11" y="38" width="5" height="2" fill="#6a4010" />
        <rect x="13" y="38" width="1" height="6" fill="#c8a030" />
        {/* Trousers */}
        <rect x="1" y="40" width="8" height="8" fill="#2a3a7a" />
        <rect x="4" y="40" width="2" height="8" fill="#222e5a" />
        {/* Left leg walking anim */}
        <g>
          <animateTransform attributeName="transform" type="translate"
            values="0,0; 0,-2; 0,0; 0,2; 0,0" dur="0.55s" repeatCount="indefinite" />
          <rect x="1" y="48" width="4" height="5" fill="#2a3a7a" />
          <rect x="0" y="52" width="5" height="2" fill="#1a0a0a" />
        </g>
        {/* Right leg walking anim (offset phase) */}
        <g>
          <animateTransform attributeName="transform" type="translate"
            values="0,2; 0,0; 0,-2; 0,0; 0,2" dur="0.55s" repeatCount="indefinite" />
          <rect x="5" y="48" width="4" height="5" fill="#1e2e6a" />
          <rect x="5" y="52" width="5" height="2" fill="#1a0a0a" />
        </g>
      </g>
    </g>

    {/* ── WALKING PERSON 2 — right to left, purple dress, dark hair ── */}
    <g clipPath="url(#lobbyClip)">
      <g>
        <animateTransform attributeName="transform" type="translate"
          from="218 0" to="-16 0" dur="9s" repeatCount="indefinite" begin="3.5s" />
        {/* Head */}
        <rect x="1" y="18" width="8" height="9" fill="#c87840" />
        {/* Hair — long dark */}
        <rect x="0" y="18" width="10" height="4" fill="#120808" />
        <rect x="0" y="18" width="2" height="12" fill="#120808" />
        <rect x="8" y="18" width="2" height="12" fill="#120808" />
        <rect x="0" y="28" width="2" height="6" fill="#120808" />
        <rect x="8" y="28" width="2" height="6" fill="#120808" />
        {/* Eyes */}
        <rect x="2" y="22" width="2" height="2" fill="#1a0808" />
        <rect x="6" y="22" width="2" height="2" fill="#1a0808" />
        <rect x="3" y="22" width="1" height="1" fill="#6a1a1a" />
        <rect x="7" y="22" width="1" height="1" fill="#6a1a1a" />
        {/* Eyelashes */}
        <rect x="2" y="21" width="3" height="1" fill="#120808" />
        <rect x="6" y="21" width="3" height="1" fill="#120808" />
        {/* Nose */}
        <rect x="4" y="24" width="2" height="1" fill="#a85a30" />
        {/* Mouth — lipstick */}
        <rect x="3" y="26" width="4" height="1" fill="#e94560" />
        {/* Ears */}
        <rect x="0" y="22" width="1" height="3" fill="#b87030" />
        <rect x="9" y="22" width="1" height="3" fill="#b87030" />
        {/* Earrings */}
        <rect x="0" y="25" width="1" height="2" fill="#f5d020" />
        <rect x="9" y="25" width="1" height="2" fill="#f5d020" />
        {/* Neck */}
        <rect x="3" y="27" width="4" height="3" fill="#c87840" />
        {/* Dress / top */}
        <rect x="0" y="29" width="10" height="12" fill="#9b59b6" />
        {/* Dress detail */}
        <rect x="3" y="30" width="4" height="1" fill="#7d3f9a" />
        <rect x="2" y="33" width="6" height="1" fill="#b07acc" />
        {/* Left arm */}
        <rect x="-2" y="30" width="3" height="7" fill="#9b59b6" />
        <rect x="-2" y="37" width="3" height="3" fill="#c87840" />
        {/* Right arm — bag */}
        <rect x="9" y="30" width="3" height="7" fill="#9b59b6" />
        <rect x="9" y="37" width="3" height="3" fill="#c87840" />
        <rect x="10" y="36" width="6" height="6" fill="#e94560" />
        <rect x="11" y="34" width="4" height="3" fill="#c03050" />
        <rect x="12" y="34" width="2" height="8" fill="#f06080" />
        {/* Skirt */}
        <rect x="-1" y="41" width="12" height="7" fill="#7d3f9a" />
        {/* Left leg walking anim */}
        <g>
          <animateTransform attributeName="transform" type="translate"
            values="0,2; 0,0; 0,-2; 0,0; 0,2" dur="0.55s" repeatCount="indefinite" />
          <rect x="1" y="48" width="4" height="5" fill="#6a3090" />
          <rect x="0" y="52" width="5" height="2" fill="#e94560" />
        </g>
        {/* Right leg walking anim */}
        <g>
          <animateTransform attributeName="transform" type="translate"
            values="0,0; 0,-2; 0,0; 0,2; 0,0" dur="0.55s" repeatCount="indefinite" />
          <rect x="5" y="48" width="4" height="5" fill="#5a2080" />
          <rect x="5" y="52" width="5" height="2" fill="#c03050" />
        </g>
      </g>
    </g>
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
