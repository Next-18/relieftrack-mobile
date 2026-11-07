import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import colors from '../styles/colors';

export function PersonIcon({ size = 22, color = '#607B9E' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="7" r="4.25" fill={color} />
      <Path
        d="M4.5 19.5c0-3.3 3.36-6 7.5-6s7.5 2.7 7.5 6c0 .55-.45 1-1 1h-13c-.55 0-1-.45-1-1z"
        fill={color}
      />
    </Svg>
  );
}

export function LockIcon({ size = 22, color = '#607B9E' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7.5 10V7a4.5 4.5 0 0 1 9 0v3"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <Rect x="4.5" y="10" width="15" height="11" rx="3" fill={color} />
    </Svg>
  );
}

export function EyeIcon({ size = 22, color = '#607B9E', visible = false }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <Circle cx="12" cy="12" r="3" />
      {!visible && <Path d="M2 2l20 20" />}
    </Svg>
  );
}

export function ArrowRightIcon({ size = 20, color = '#FFFFFF' }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M4 12h16" />
      <Path d="M13 5l7 7-7 7" />
    </Svg>
  );
}

export function QRCodeIcon({ size = 24, color = colors.blue }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 3h6v6H3z" />
      <Path d="M15 3h6v6h-6z" />
      <Path d="M3 15h6v6H3z" />
      <Path d="M15 15h6v6h-6z" />
      <Path d="M15 15v2" />
      <Path d="M21 15v2" />
      <Path d="M15 21h2" />
      <Path d="M21 21h-2" />
    </Svg>
  );
}
