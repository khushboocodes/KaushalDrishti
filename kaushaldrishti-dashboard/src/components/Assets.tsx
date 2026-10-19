import React from 'react';
import kaushalLogo from '../assets/kaushaldrishti-logo.png';

/**
 * High-precision standalone SVG recreations of the KaushalDrishti Asset Sheet (Reference Image 2).
 * Preserves exact warm Indian palette (#173F35, #17604D, #D96843, #F2B968, #5B8C69, #E8C59E, #F5F0E7)
 * and transparent backgrounds without any sheet labels or dimension annotations.
 */

export const LogoIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 38,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 128 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="KaushalDrishti Emblem"
  >
    <defs>
      <radialGradient id="kdGlow" cx="50%" cy="45%" r="50%">
        <stop offset="0%" stopColor="#E6F0DC" />
        <stop offset="70%" stopColor="#F5F0E7" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#F8F5EF" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Soft circular aura */}
    <circle cx="64" cy="64" r="58" fill="url(#kdGlow)" />
    <circle cx="64" cy="56" r="36" fill="#DCE9D9" fillOpacity="0.55" />
    {/* Top glowing node */}
    <circle cx="64" cy="24" r="11" fill="#17604D" />
    <circle cx="61" cy="21" r="4" fill="#8CC59E" />
    {/* Central rising pillar / skill torch */}
    <path
      d="M64 36 L64 98 M58 48 L64 40 L70 48"
      stroke="#143B32"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Crossbar / open arms */}
    <path
      d="M42 58 C52 55, 76 55, 86 58"
      stroke="#17604D"
      strokeWidth="6.5"
      strokeLinecap="round"
    />
    {/* Left & right lotus leaves (deep forest green) */}
    <path
      d="M61 96 C38 96, 18 80, 14 58 C30 58, 48 68, 61 96 Z"
      fill="#173F35"
    />
    <path
      d="M67 96 C90 96, 110 80, 114 58 C98 58, 80 68, 67 96 Z"
      fill="#173F35"
    />
    {/* Secondary inner sage leaves */}
    <path
      d="M58 84 C44 76, 34 62, 34 46 C46 52, 54 64, 58 84 Z"
      fill="#568F66"
    />
    <path
      d="M70 84 C84 76, 94 62, 94 46 C82 52, 74 64, 70 84 Z"
      fill="#568F66"
    />
    {/* Base cradle */}
    <path
      d="M36 96 C50 106, 78 106, 92 96"
      stroke="#17604D"
      strokeWidth="6"
      strokeLinecap="round"
    />
  </svg>
);

export const LogoHorizontal: React.FC<{ className?: string; compact?: boolean }> = ({
  className = '',
  compact = false,
}) => (
  <div className={`inline-flex items-center select-none ${className}`}>
    <img
      src={kaushalLogo}
      alt="KaushalDrishti — AI-Powered Labour Market Intelligence"
      className={`${compact ? 'h-[36px] max-w-[178px]' : 'h-[46px] max-w-[220px]'} w-auto object-contain`}
    />
  </div>
);

export const LogoSquare: React.FC<{ className?: string; size?: number }> = ({ className = '', size }) => (
  <div
    style={size ? { width: size, height: size } : undefined}
    className={`${size ? '' : 'w-14 h-14'} rounded-xl bg-[#F5F0E7] border border-[#E9E0D3] flex items-center justify-center shadow-2xs ${className}`}
  >
    <LogoIcon size={size ? Math.round(size * 0.75) : 42} />
  </div>
);

/**
 * Top Header Illustration (header-illustration.png - 1600x200 panoramic Indian skyline & workforce)
 */
export const HeaderIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 920 145"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    preserveAspectRatio="xMaxYMax meet"
    aria-hidden="true"
  >
    {/* Warm sun & soft clouds */}
    <circle cx="480" cy="48" r="34" fill="#F7DFBA" fillOpacity="0.65" />
    <path
      d="M120 95 C140 72, 180 72, 200 90 C220 68, 265 70, 285 95 Z"
      fill="#F4E6CE"
      fillOpacity="0.5"
    />
    <path
      d="M560 90 C585 65, 630 65, 655 88 C675 70, 715 72, 735 92 Z"
      fill="#F4E6CE"
      fillOpacity="0.55"
    />

    {/* Left botanical foliage (green & terracotta leaves) */}
    <g transform="translate(8, 12)">
      <path d="M38 128 C28 92, 18 54, 14 14" stroke="#2D5A47" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M24 62 C8 54, 2 38, 12 28 C24 36, 28 50, 24 62 Z" fill="#4E8763" />
      <path d="M20 42 C32 30, 44 26, 48 38 C38 46, 28 46, 20 42 Z" fill="#7FB088" />
      <path d="M30 88 C12 82, 4 68, 14 58 C26 64, 32 76, 30 88 Z" fill="#2D5A47" />
      <path d="M33 96 C46 82, 60 80, 62 92 C52 100, 40 100, 33 96 Z" fill="#689F77" />
      {/* Warm ochre/terracotta accent sprigs */}
      <path d="M52 128 C58 104, 68 84, 78 68" stroke="#C87D4E" strokeWidth="1.6" strokeLinecap="round" />
      <ellipse cx="66" cy="82" rx="7" ry="4" transform="rotate(-35 66 82)" fill="#E6A168" />
      <ellipse cx="76" cy="70" rx="6" ry="3.5" transform="rotate(-25 76 70)" fill="#D96843" />
      <ellipse cx="58" cy="96" rx="7" ry="4" transform="rotate(25 58 96)" fill="#F2B968" />
    </g>

    {/* Left Heritage Sandstone Palace / Indo-Saracenic Domes */}
    <g transform="translate(86, 22)">
      {/* Main central dome */}
      <path d="M62 32 C62 14, 94 14, 94 32 Z" fill="#E5AF84" />
      <path d="M78 6 L78 16" stroke="#C68658" strokeWidth="2" />
      {/* Side chhatri domes */}
      <path d="M26 48 C26 36, 46 36, 46 48 Z" fill="#E8BA94" />
      <path d="M110 48 C110 36, 130 36, 130 48 Z" fill="#E8BA94" />
      {/* Facade body */}
      <rect x="18" y="48" width="120" height="68" fill="#F0C8A4" stroke="#D59B70" strokeWidth="1.2" />
      <rect x="52" y="32" width="52" height="84" fill="#EAB88F" stroke="#D59B70" strokeWidth="1.2" />
      {/* Pointed Mughal/Rajasthani arches */}
      <path d="M66 116 L66 76 C66 64, 90 64, 90 76 L90 116 Z" fill="#B56E45" />
      <path d="M30 116 L30 84 C30 76, 44 76, 44 84 L44 116 Z" fill="#C67D52" />
      <path d="M112 116 L112 84 C112 76, 126 76, 126 84 L126 116 Z" fill="#C67D52" />
      {/* Secondary white marble dome on right */}
      <path d="M150 52 C150 32, 180 32, 180 52 Z" fill="#F3E5D0" stroke="#D8C3A5" strokeWidth="1.2" />
      <rect x="144" y="52" width="42" height="64" fill="#F7EDE0" stroke="#D8C3A5" strokeWidth="1.2" />
      <path d="M158 116 L158 84 C158 76, 172 76, 172 84 L172 116 Z" fill="#D5BC9D" />
    </g>

    {/* Distant city towers & wind turbines */}
    <g transform="translate(510, 26)">
      <rect x="42" y="18" width="22" height="90" fill="#DFECE2" stroke="#B9D1C0" strokeWidth="1" />
      <rect x="70" y="38" width="26" height="70" fill="#E9DFCF" />
      <rect x="195" y="32" width="24" height="76" fill="#E9DFCF" />
      <rect x="225" y="44" width="20" height="64" fill="#F2DEC4" />
      {/* Wind turbine 1 */}
      <line x1="138" y1="24" x2="138" y2="98" stroke="#8CA899" strokeWidth="2" />
      <path d="M138 24 L122 10 M138 24 L156 16 M138 24 L136 44" stroke="#8CA899" strokeWidth="1.8" strokeLinecap="round" />
      {/* Wind turbine 2 */}
      <line x1="176" y1="36" x2="176" y2="98" stroke="#8CA899" strokeWidth="1.8" />
      <path d="M176 36 L163 24 M176 36 L190 29 M176 36 L175 52" stroke="#8CA899" strokeWidth="1.5" strokeLinecap="round" />
    </g>

    {/* Modern High-Speed Train (Vande Bharat style) on viaduct */}
    <g transform="translate(585, 92)">
      <path
        d="M0 24 L152 24 L142 8 C138 3, 130 2, 120 2 L4 2 C2 2, 0 5, 0 9 Z"
        fill="#F4F7F5"
        stroke="#4B7B6B"
        strokeWidth="1.5"
      />
      <path d="M4 11 L142 11" stroke="#2D6A58" strokeWidth="2.5" />
      {/* Train windows */}
      <rect x="14" y="5" width="14" height="4.5" rx="1" fill="#4B7B6B" />
      <rect x="34" y="5" width="14" height="4.5" rx="1" fill="#4B7B6B" />
      <rect x="54" y="5" width="14" height="4.5" rx="1" fill="#4B7B6B" />
      <rect x="74" y="5" width="14" height="4.5" rx="1" fill="#4B7B6B" />
      <rect x="94" y="5" width="14" height="4.5" rx="1" fill="#4B7B6B" />
      <path d="M122 5 L134 5 L138 9.5 L122 9.5 Z" fill="#173F35" />
      {/* Viaduct line */}
      <line x1="-10" y1="26" x2="165" y2="26" stroke="#B7C4BC" strokeWidth="3" />
    </g>

    {/* Right Red Sandstone Heritage Archway / Monument */}
    <g transform="translate(745, 28)">
      <path d="M36 32 C36 14, 64 14, 64 32 Z" fill="#B5543C" />
      <path d="M50 8 L50 16" stroke="#8E3B27" strokeWidth="2" />
      <rect x="10" y="42" width="80" height="68" rx="2" fill="#C8654B" />
      <rect x="28" y="32" width="44" height="78" fill="#B9573E" />
      {/* Central grand arch */}
      <path d="M38 110 L38 68 C38 56, 62 56, 62 68 L62 110 Z" fill="#F8F5EF" />
      {/* Side arches */}
      <path d="M16 110 L16 80 C16 74, 24 74, 24 80 L24 110 Z" fill="#8E3B27" />
      <path d="M76 110 L76 80 C76 74, 84 74, 84 80 L84 110 Z" fill="#8E3B27" />
    </g>

    {/* Right tropical leaves */}
    <g transform="translate(832, 16)">
      <path d="M22 122 C32 88, 44 52, 52 14" stroke="#173F35" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M34 54 C48 44, 58 30, 48 20 C36 28, 32 42, 34 54 Z" fill="#3B7A57" />
      <path d="M40 38 C26 26, 16 24, 14 36 C24 44, 34 42, 40 38 Z" fill="#74A882" />
      <path d="M28 82 C44 74, 54 62, 44 50 C32 58, 26 70, 28 82 Z" fill="#173F35" />
      <path d="M24 90 C12 78, 2 76, 2 88 C10 96, 18 94, 24 90 Z" fill="#689F77" />
      <circle cx="64" cy="96" r="10" fill="#E6A168" fillOpacity="0.8" />
    </g>

    {/* Foreground green trees & bushes across skyline base */}
    <g fill="#4E8763">
      <circle cx="95" cy="126" r="14" />
      <circle cx="122" cy="128" r="12" fill="#689F77" />
      <circle cx="248" cy="124" r="15" />
      <circle cx="274" cy="128" r="12" fill="#3B7A57" />
      <circle cx="485" cy="126" r="13" fill="#689F77" />
      <circle cx="555" cy="125" r="14" />
      <circle cx="735" cy="126" r="13" fill="#3B7A57" />
    </g>

    {/* Central Group of 4 Indian Skilled Professionals / Youth */}
    <g transform="translate(300, 32)">
      {/* Person 1: Construction / Industrial Engineer in Yellow Hard Hat & Safety Vest */}
      <g transform="translate(0, 12)">
        {/* Legs */}
        <rect x="18" y="66" width="8" height="34" fill="#2A4759" />
        <rect x="29" y="66" width="8" height="34" fill="#2A4759" />
        {/* Torso: Blue shirt + Yellow reflective vest */}
        <path d="M14 34 C14 30, 41 30, 41 34 L43 68 L12 68 Z" fill="#3A6B88" />
        <path d="M16 34 L24 34 L24 68 L15 68 Z" fill="#F2B968" />
        <path d="M31 34 L39 34 L40 68 L31 68 Z" fill="#F2B968" />
        {/* Rolled blueprint under arm */}
        <rect x="6" y="48" width="16" height="5" rx="2" transform="rotate(-20 6 48)" fill="#FFFDF9" stroke="#D59B70" strokeWidth="1" />
        {/* Head & Hard Hat */}
        <circle cx="27.5" cy="20" r="8.5" fill="#C67D52" />
        <path d="M17 17 C17 9, 38 9, 38 17 Z" fill="#F2A93B" />
        <line x1="15" y1="17" x2="40" y2="17" stroke="#D9822B" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* Person 2: Skilled Technician / Trainer in Forest Green Shirt */}
      <g transform="translate(48, 6)">
        <rect x="18" y="72" width="8.5" height="34" fill="#233931" />
        <rect x="30" y="72" width="8.5" height="34" fill="#233931" />
        <path d="M13 36 C13 31, 43 31, 43 36 L45 73 L11 73 Z" fill="#2E6F57" />
        {/* Collar */}
        <path d="M23 32 L28 40 L33 32" stroke="#173F35" strokeWidth="2" fill="none" />
        {/* Head & Hair */}
        <circle cx="28" cy="20" r="8.5" fill="#B86E45" />
        <path d="M19 18 C19 10, 37 10, 37 18 C34 14, 22 14, 19 18 Z" fill="#1E2422" />
      </g>

      {/* Person 3: Woman Professional in Terracotta / Rust Sari & Ochre Blouse holding Tablet */}
      <g transform="translate(98, 14)">
        {/* Sari skirt */}
        <path d="M14 58 L38 58 L41 98 L11 98 Z" fill="#B84A32" />
        {/* Blouse & Sari Pallu */}
        <path d="M14 34 C14 30, 38 30, 38 34 L39 60 L13 60 Z" fill="#E59A54" />
        <path d="M14 34 L36 34 L22 76 L12 62 Z" fill="#D96843" />
        {/* Tablet / Folder in hand */}
        <rect x="24" y="44" width="11" height="14" rx="1.5" fill="#F5F0E7" stroke="#173F35" strokeWidth="1.2" />
        {/* Head & Bun */}
        <circle cx="26" cy="20" r="8" fill="#C67D52" />
        <circle cx="18" cy="20" r="4.5" fill="#1E2422" />
        <path d="M18 18 C19 11, 33 11, 34 18 C30 14, 22 14, 18 18 Z" fill="#1E2422" />
      </g>

      {/* Person 4: Young Trainee / IT Student in Blue Shirt with Backpack */}
      <g transform="translate(142, 16)">
        <rect x="16" y="64" width="7.5" height="32" fill="#2C3E50" />
        <rect x="26.5" y="64" width="7.5" height="32" fill="#2C3E50" />
        {/* Backpack strap & body */}
        <path d="M12 34 C12 30, 38 30, 38 34 L39 65 L11 65 Z" fill="#3B82A6" />
        <path d="M15 33 L18 56 M35 33 L32 56" stroke="#1E2D38" strokeWidth="2.5" strokeLinecap="round" />
        {/* Head */}
        <circle cx="25" cy="20" r="8" fill="#C67D52" />
        <path d="M17 18 C17 11, 33 11, 33 18 C29 14, 21 14, 17 18 Z" fill="#1E2422" />
      </g>
    </g>

    {/* Birds in sky */}
    <path d="M275 24 Q280 19 285 24 Q290 19 295 24" stroke="#C87D4E" strokeWidth="1.5" fill="none" />
    <path d="M625 28 Q629 24 633 28 Q637 24 641 28" stroke="#C87D4E" strokeWidth="1.4" fill="none" />

    {/* Baseline ground strip */}
    <rect x="0" y="134" width="920" height="8" rx="4" fill="#79A882" fillOpacity="0.45" />
  </svg>
);

/**
 * Sidebar Bottom Illustration (sidebar-bottom.png - 320x200)
 * Paired with "Skilled India / Stronger India" branding in the sidebar footer
 */
export const SidebarBottomIllustration: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <svg
    viewBox="0 0 280 155"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Soft warm sky & horizon clouds */}
    <path
      d="M0 95 C40 72, 95 75, 140 90 C185 70, 240 75, 280 95 L280 155 L0 155 Z"
      fill="#F2E4CE"
      fillOpacity="0.65"
    />
    {/* Heritage silhouette domes on left-center */}
    <path d="M78 78 C78 64, 102 64, 102 78 Z" fill="#E5C49E" />
    <rect x="70" y="78" width="40" height="42" fill="#EAD0B1" />
    <path d="M85 120 L85 96 C85 90, 95 90, 95 96 L95 120 Z" fill="#C99B72" />

    {/* Modern towers & wind turbine on right */}
    <rect x="155" y="70" width="18" height="48" fill="#DFD3C3" />
    <rect x="178" y="80" width="15" height="38" fill="#E7DDD0" />
    <line x1="215" y1="68" x2="215" y2="115" stroke="#8CA899" strokeWidth="1.6" />
    <path d="M215 68 L205 58 M215 68 L226 63 M215 68 L214 80" stroke="#8CA899" strokeWidth="1.4" />

    {/* Distant metro train */}
    <rect x="148" y="112" width="76" height="10" rx="3" fill="#E8F0EC" stroke="#568F66" strokeWidth="1" />

    {/* Lush green hills & foliage */}
    <path d="M0 128 Q70 114 145 124 T280 122 L280 155 L0 155 Z" fill="#DCE9D9" />
    <path d="M0 138 Q95 126 190 136 T280 134 L280 155 L0 155 Z" fill="#8CC59E" fillOpacity="0.55" />

    {/* Left & right botanical leaves */}
    <path d="M16 148 C12 122, 8 98, 6 76" stroke="#2D5A47" strokeWidth="2" />
    <ellipse cx="14" cy="105" rx="8" ry="4" transform="rotate(-30 14 105)" fill="#4E8763" />
    <ellipse cx="8" cy="90" rx="7" ry="3.5" transform="rotate(25 8 90)" fill="#74A882" />
    <path d="M258 148 C262 122, 266 98, 270 76" stroke="#2D5A47" strokeWidth="2" />
    <ellipse cx="256" cy="106" rx="8" ry="4" transform="rotate(30 256 106)" fill="#2D5A47" />
    <ellipse cx="266" cy="92" rx="7" ry="3.5" transform="rotate(-25 266 92)" fill="#689F77" />

    {/* Foreground Workers looking toward Skilled India horizon */}
    {/* Worker in yellow shirt & orange safety helmet */}
    <g transform="translate(28, 56)">
      <path d="M10 42 C10 36, 36 36, 36 42 L38 88 L8 88 Z" fill="#F2B968" />
      <path d="M14 40 L32 40 L30 68 L16 68 Z" fill="#E59A54" fillOpacity="0.5" />
      <circle cx="23" cy="24" r="8.5" fill="#B86E45" />
      <path d="M13 21 C13 13, 33 13, 33 21 Z" fill="#D96843" />
    </g>
    {/* Woman in teal/green sari beside worker */}
    <g transform="translate(66, 72)">
      <path d="M8 34 C8 29, 28 29, 28 34 L30 74 L6 74 Z" fill="#17604D" />
      <path d="M10 34 L26 34 L16 64 L8 54 Z" fill="#D96843" />
      <circle cx="18" cy="19" r="7.5" fill="#B86E45" />
      <circle cx="12" cy="20" r="4" fill="#1E2422" />
    </g>
  </svg>
);

/**
 * Mini Heritage & Foliage Illustration (mini-illustration.png - 400x120)
 * Used in bottom corners of Geographic View and Alerts & Insights
 */
export const MiniIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 360 115"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Soft warm background dune */}
    <path d="M70 108 C115 84, 245 84, 290 108 Z" fill="#F8F0E4" />

    {/* Left Heritage Gateway with White Arch */}
    <rect x="42" y="68" width="52" height="40" fill="#DFB28A" />
    <path d="M68 32 C64 48, 49 52, 49 68 L87 68 C87 52, 72 48, 68 32 Z" fill="#CF9369" />
    <path d="M58 108 L58 84 C58 74, 78 74, 78 84 L78 108 Z" fill="#FFFFFF" />

    {/* Center Monument with Grand Onion Dome and Arch Door */}
    <rect x="132" y="70" width="86" height="38" fill="#DFB28A" />
    <path d="M175 28 C169 46, 150 51, 150 70 L200 70 C200 51, 181 46, 175 28 Z" fill="#CF9369" />
    <path d="M162 108 L162 82 C162 70, 188 70, 188 82 L188 108 Z" fill="#B8764B" />

    {/* Right Minaret & Pavilion */}
    <rect x="257" y="52" width="10" height="56" fill="#DFB28A" />
    <rect x="255" y="50" width="14" height="2.5" rx="1" fill="#CF9369" />
    <circle cx="262" cy="45" r="4.5" fill="#CF9369" />
    <rect x="276" y="72" width="38" height="36" fill="#DFB28A" />

    {/* Foliage / Green Tree Circles */}
    <circle cx="34" cy="104" r="13" fill="#477B63" />
    <circle cx="106" cy="103" r="13" fill="#477B63" />
    <circle cx="123" cy="105" r="9" fill="#5F9779" />
    <circle cx="238" cy="103" r="13" fill="#477B63" />
    <circle cx="316" cy="103" r="13" fill="#477B63" />

    {/* Baseline Green Ground Strip */}
    <rect x="0" y="108" width="360" height="7" fill="#9EBFA9" />
  </svg>
);

/**
 * Decorative Botanical Leaves (leaf-left.png, leaf-right.png, decor-left.png)
 */
export const LeafLeft: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
    <path d="M60 110 C58 78, 58 46, 62 16" stroke="#2D5A47" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M59 86 C38 78, 28 62, 38 50 C50 56, 58 70, 59 86 Z" fill="#4E8763" />
    <path d="M60 72 C80 62, 90 48, 80 36 C68 44, 62 58, 60 72 Z" fill="#74A882" />
    <path d="M60 52 C42 42, 36 28, 46 20 C56 26, 60 38, 60 52 Z" fill="#689F77" />
    <path d="M62 34 C72 22, 74 12, 62 8 C54 16, 56 26, 62 34 Z" fill="#2D5A47" />
  </svg>
);

export const LeafRight: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
    <path d="M55 110 C58 78, 64 46, 74 18" stroke="#2D5A47" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M58 88 C78 82, 92 68, 84 56 C70 62, 62 74, 58 88 Z" fill="#4E8763" />
    <path d="M62 66 C44 56, 36 42, 46 32 C58 38, 62 52, 62 66 Z" fill="#74A882" />
    {/* Warm ochre branch */}
    <path d="M56 94 C42 78, 30 62, 22 44" stroke="#C87D4E" strokeWidth="1.8" strokeLinecap="round" />
    <ellipse cx="32" cy="64" rx="9" ry="4.5" transform="rotate(28 32 64)" fill="#F2B968" />
    <ellipse cx="24" cy="48" rx="8" ry="4" transform="rotate(18 24 48)" fill="#E59A54" />
  </svg>
);

export const MandalaPattern: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden="true">
    <g stroke="#D9C3A5" strokeWidth="1.2" opacity="0.55">
      <circle cx="0" cy="200" r="40" />
      <circle cx="0" cy="200" r="70" />
      <circle cx="0" cy="200" r="105" />
      <circle cx="0" cy="200" r="140" />
      <circle cx="0" cy="200" r="175" />
      <path d="M0 95 C25 110, 40 130, 0 160 C-25 130, -10 110, 0 95 Z" />
      <path d="M65 135 C85 115, 110 115, 105 145 C85 155, 75 145, 65 135 Z" />
      <path d="M95 200 C110 175, 130 160, 160 200" />
      <path d="M35 65 C60 55, 85 65, 75 95" />
      <path d="M105 95 C130 85, 150 95, 135 125" />
    </g>
  </svg>
);

/**
 * Empty State Illustrations (400x300) from Reference Image 2
 */
export const EmptyStateIllustration: React.FC<{
  variant: 'search' | 'data' | 'analysis' | 'map' | 'training' | 'reports' | 'construction';
  className?: string;
}> = ({ variant, className = 'w-44 h-32' }) => {
  switch (variant) {
    case 'search':
      return (
        <svg viewBox="0 0 240 180" fill="none" className={className}>
          <ellipse cx="120" cy="152" rx="85" ry="12" fill="#EFE7DA" />
          <rect x="68" y="32" width="84" height="108" rx="6" fill="#FFFEFB" stroke="#D8CBB8" strokeWidth="2" />
          <line x1="84" y1="54" x2="136" y2="54" stroke="#E5DEC9" strokeWidth="4" strokeLinecap="round" />
          <line x1="84" y1="70" x2="128" y2="70" stroke="#E5DEC9" strokeWidth="4" strokeLinecap="round" />
          <line x1="84" y1="86" x2="132" y2="86" stroke="#E5DEC9" strokeWidth="4" strokeLinecap="round" />
          <circle cx="116" cy="92" r="28" fill="#DCE9D9" fillOpacity="0.6" stroke="#17604D" strokeWidth="5" />
          <line x1="96" y1="112" x2="72" y2="136" stroke="#173F35" strokeWidth="7" strokeLinecap="round" />
          <path d="M168 142 C174 118, 186 98, 196 84" stroke="#2D5A47" strokeWidth="2.2" />
          <ellipse cx="184" cy="108" rx="9" ry="4.5" transform="rotate(-30 184 108)" fill="#568F66" />
        </svg>
      );
    case 'data':
      return (
        <svg viewBox="0 0 240 180" fill="none" className={className}>
          <ellipse cx="120" cy="152" rx="85" ry="12" fill="#EFE7DA" />
          <rect x="76" y="36" width="82" height="90" rx="4" fill="#FFFEFB" stroke="#D8CBB8" strokeWidth="1.8" />
          <path d="M58 64 L102 64 L112 74 L182 74 L174 144 L66 144 Z" fill="#F2B968" stroke="#D99B43" strokeWidth="2" />
          <path d="M66 84 L178 84 L174 144 L66 144 Z" fill="#F5C77E" />
          <ellipse cx="48" cy="126" rx="10" ry="5" transform="rotate(25 48 126)" fill="#568F66" />
          <ellipse cx="192" cy="126" rx="10" ry="5" transform="rotate(-25 192 126)" fill="#4E8763" />
        </svg>
      );
    case 'reports':
      return (
        <svg viewBox="0 0 240 180" fill="none" className={className}>
          <ellipse cx="120" cy="152" rx="85" ry="12" fill="#EFE7DA" />
          <rect x="52" y="34" width="136" height="106" rx="8" fill="#FFFEFB" stroke="#D8CBB8" strokeWidth="2" />
          <rect x="52" y="34" width="136" height="20" rx="8" fill="#F5F0E7" />
          <rect x="74" y="102" width="14" height="24" rx="2" fill="#E59A54" />
          <rect x="98" y="88" width="14" height="38" rx="2" fill="#D96843" />
          <rect x="122" y="74" width="14" height="52" rx="2" fill="#D96843" />
          <rect x="146" y="60" width="14" height="66" rx="2" fill="#B84A32" />
          <ellipse cx="42" cy="128" rx="10" ry="5" transform="rotate(25 42 128)" fill="#568F66" />
          <ellipse cx="198" cy="128" rx="10" ry="5" transform="rotate(-25 198 128)" fill="#4E8763" />
        </svg>
      );
    case 'training':
      return (
        <svg viewBox="0 0 240 180" fill="none" className={className}>
          <ellipse cx="120" cy="154" rx="90" ry="10" fill="#EFE7DA" />
          <rect x="44" y="28" width="76" height="52" rx="4" fill="#FFFEFB" stroke="#D8CBB8" strokeWidth="2" />
          <rect x="128" y="28" width="68" height="52" rx="4" fill="#88B984" stroke="#568F66" strokeWidth="2" />
          {/* Instructor */}
          <circle cx="66" cy="76" r="8" fill="#B86E45" />
          <path d="M56 88 L76 88 L78 136 L54 136 Z" fill="#D96843" />
          {/* Trainees */}
          <circle cx="112" cy="108" r="8" fill="#B86E45" />
          <path d="M100 120 L124 120 L126 146 L98 146 Z" fill="#F2B968" />
          <circle cx="144" cy="108" r="8" fill="#B86E45" />
          <path d="M132 120 L156 120 L158 146 L130 146 Z" fill="#2E6F57" />
          <circle cx="176" cy="108" r="8" fill="#B86E45" />
          <path d="M164 120 L188 120 L190 146 L162 146 Z" fill="#3A6B88" />
        </svg>
      );
    case 'map':
      return (
        <svg viewBox="0 0 240 180" fill="none" className={className}>
          <ellipse cx="120" cy="152" rx="85" ry="12" fill="#EFE7DA" />
          <path
            d="M115 28 L138 42 L152 68 L176 74 L158 106 L134 142 L114 112 L94 92 L106 58 Z"
            fill="#DCE9D9"
            stroke="#568F66"
            strokeWidth="2"
          />
          <circle cx="134" cy="78" r="5" fill="#D96843" />
          <circle cx="122" cy="104" r="5" fill="#D96843" />
          <circle cx="72" cy="84" r="9" fill="#B86E45" />
          <path d="M60 96 L84 96 L88 146 L56 146 Z" fill="#D96843" />
        </svg>
      );
    case 'construction':
      return (
        <svg viewBox="0 0 240 180" fill="none" className={className}>
          <ellipse cx="120" cy="152" rx="85" ry="12" fill="#EFE7DA" />
          <path d="M62 84 C62 68, 86 68, 86 84 Z" fill="#E5AF84" />
          <rect x="48" y="84" width="52" height="58" fill="#F0C8A4" />
          <line x1="148" y1="32" x2="148" y2="142" stroke="#D9822B" strokeWidth="4" />
          <line x1="108" y1="42" x2="192" y2="42" stroke="#F2A93B" strokeWidth="4" />
          <line x1="178" y1="42" x2="178" y2="76" stroke="#64716D" strokeWidth="2" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 240 180" fill="none" className={className}>
          <ellipse cx="120" cy="152" rx="85" ry="12" fill="#EFE7DA" />
          <rect x="88" y="36" width="104" height="76" rx="6" fill="#FFFEFB" stroke="#D8CBB8" strokeWidth="2" />
          <rect x="136" y="68" width="10" height="28" fill="#568F66" />
          <rect x="152" y="56" width="10" height="40" fill="#D96843" />
          <rect x="168" y="48" width="10" height="48" fill="#17604D" />
          <circle cx="68" cy="76" r="10" fill="#B86E45" />
          <path d="M52 92 L84 92 L88 144 L48 144 Z" fill="#2E6F57" />
        </svg>
      );
  }
};

/**
 * Custom Outline Icon Set matching Reference Image 2 (icon-*.png 48x48 outline icons)
 */
export const AssetOutlineIcon: React.FC<{
  name: string;
  active?: boolean;
  className?: string;
}> = ({ name, active = false, className = 'w-4 h-4' }) => {
  const strokeColor = active ? '#D96843' : 'currentColor';
  switch (name) {
    case 'dashboard':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={strokeColor} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5.5v-6h-5v6H4a1 1 0 0 1-1-1v-9.5z" />
        </svg>
      );
    case 'demand-supply':
    case 'demand':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={strokeColor} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <line x1="6" y1="20" x2="6" y2="12" />
          <line x1="12" y1="20" x2="12" y2="5" />
          <line x1="18" y1="20" x2="18" y2="9" />
        </svg>
      );
    case 'forecasting':
    case 'forecast':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={strokeColor} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      );
    case 'sectors':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={strokeColor} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="12" y1="12" x2="12" y2="12.01" />
        </svg>
      );
    case 'geographic':
    case 'map':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={strokeColor} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
          <line x1="9" y1="3" x2="9" y2="18" />
          <line x1="15" y1="6" x2="15" y2="21" />
        </svg>
      );
    case 'training':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={strokeColor} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 3 3.5 6 3.5s6-1.5 6-3.5v-5" />
        </svg>
      );
    case 'policy-sandbox':
    case 'sandbox':
    case 'simulator':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={strokeColor} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="21" x2="4" y2="14" />
          <line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" />
          <line x1="20" y1="12" x2="20" y2="3" />
          <line x1="1" y1="14" x2="7" y2="14" />
          <line x1="9" y1="8" x2="15" y2="8" />
          <line x1="17" y1="16" x2="23" y2="16" />
        </svg>
      );
    case 'alerts':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={strokeColor} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    case 'recommendations':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={strokeColor} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
        </svg>
      );
    case 'reports':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={strokeColor} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="13" y2="17" />
        </svg>
      );
    case 'data-explorer':
    case 'data':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={strokeColor} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      );
    case 'api-access':
    case 'api':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={strokeColor} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case 'settings':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={strokeColor} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case 'design-system':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={strokeColor} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    default:
      return null;
  }
};
