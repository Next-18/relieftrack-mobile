import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

/**
 * Cardboard box illustration with status badge for distribution cards.
 * Matches the box icon on each card in the "My Relief" mockup.
 */
export default function PackageBoxIcon({ status = 'Released', size = 46 }) {
  const normStatus = String(status || '').toLowerCase();
  const isPending = normStatus === 'pending' || normStatus === 'assigned';
  const isVoided = normStatus === 'voided' || normStatus === 'cancelled' || normStatus === 'canceled';

  let badgeBg = '#16A34A'; // default green
  if (isPending) {
    badgeBg = '#D97706'; // amber
  } else if (isVoided) {
    badgeBg = '#DC2626'; // red
  }

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 46 46" fill="none">
        <Defs>
          <LinearGradient id="boxTop" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#F5D096" />
            <Stop offset="100%" stopColor="#E2BA7A" />
          </LinearGradient>
          <LinearGradient id="boxLeft" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#DEAC68" />
            <Stop offset="100%" stopColor="#C99854" />
          </LinearGradient>
          <LinearGradient id="boxRight" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#C4914B" />
            <Stop offset="100%" stopColor="#A87532" />
          </LinearGradient>
        </Defs>

        {/* Ambient shadow */}
        <Path d="M4 36 L23 44 L42 36 L23 30 Z" fill="#0F172A" opacity={0.08} />

        {/* Isometric Cardboard Box */}
        {/* Top Face */}
        <Path d="M23 6 L40 14 L23 22 L6 14 Z" fill="url(#boxTop)" stroke="#B48240" strokeWidth={0.8} />

        {/* Tape seam on top */}
        <Path d="M14.5 10 L31.5 18" stroke="#DEAC68" strokeWidth={2.2} />

        {/* Left Face */}
        <Path d="M6 14 L23 22 L23 37 L6 29 Z" fill="url(#boxLeft)" stroke="#9F6F2D" strokeWidth={0.8} />

        {/* Right Face */}
        <Path d="M23 22 L40 14 L40 29 L23 37 Z" fill="url(#boxRight)" stroke="#8C5E20" strokeWidth={0.8} />

        {/* Packing tape down side */}
        <Path d="M21.5 22.5 L21.5 37" stroke="#C99854" strokeWidth={2.2} />

        {/* Circular Status Badge at bottom right */}
        <Circle cx={34} cy={34} r={9} fill={badgeBg} stroke="#FFFFFF" strokeWidth={2} />

        {isVoided ? (
          /* Red cross */
          <Path d="M31 31 L37 37 M37 31 L31 37" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" />
        ) : isPending ? (
          /* Amber clock / pending icon */
          <>
            <Path d="M34 29.5 V34.5 H37" stroke="#FFFFFF" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : (
          /* Green checkmark */
          <Path d="M30.5 34 L33 36.5 L37.5 31.5" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        )}
      </Svg>
    </View>
  );
}
