import React from 'react';
import { View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

/**
 * High-quality vector illustration for "Family Food Pack" / Food category.
 * Depicts a cardboard box filled with rice sack, canned goods, bottle, noodles, and green leaf garnish.
 */
export function FoodPackageIllustration({ width = '100%', height = 90 }) {
  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={120} height={height} viewBox="0 0 120 90" fill="none">
        <Defs>
          <LinearGradient id="foodBoxGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#E2BA7A" />
            <Stop offset="100%" stopColor="#C99B52" />
          </LinearGradient>
          <LinearGradient id="foodBoxSide" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#C99B52" />
            <Stop offset="100%" stopColor="#A87A34" />
          </LinearGradient>
          <LinearGradient id="riceGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#F8FAFC" />
            <Stop offset="100%" stopColor="#E2E8F0" />
          </LinearGradient>
          <LinearGradient id="canGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#EF4444" />
            <Stop offset="100%" stopColor="#B91C1C" />
          </LinearGradient>
          <LinearGradient id="canGradBlue" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#38BDF8" />
            <Stop offset="100%" stopColor="#0284C7" />
          </LinearGradient>
        </Defs>

        {/* Ambient shadow */}
        <Ellipse cx={60} cy={82} rx={48} ry={6} fill="#0F172A" opacity={0.08} />

        {/* Green leaf sprig behind */}
        <G transform="translate(18, 20) rotate(-15)">
          <Path d="M0 20 Q12 0 24 8 Q12 18 0 20 Z" fill="#22C55E" />
          <Path d="M4 18 Q16 6 24 8" stroke="#16A34A" strokeWidth={1} fill="none" />
        </G>
        <G transform="translate(86, 22) rotate(20)">
          <Path d="M0 16 Q8 0 18 6 Q10 14 0 16 Z" fill="#22C55E" />
        </G>

        {/* Rice Sack in center-left */}
        <Rect x={38} y={16} width={26} height={34} rx={5} fill="url(#riceGrad)" />
        <Path d="M38 21 Q51 26 64 21" stroke="#3B82F6" strokeWidth={2} fill="none" />
        <Path d="M42 30 H60" stroke="#94A3B8" strokeWidth={1.5} strokeDasharray="2,2" />
        <Path d="M45 35 H57" stroke="#94A3B8" strokeWidth={1.5} strokeDasharray="2,2" />
        {/* Rice sack ears */}
        <Path d="M38 18 Q35 12 42 16" fill="#E2E8F0" />
        <Path d="M64 18 Q67 12 60 16" fill="#E2E8F0" />

        {/* Red canned good (left) */}
        <Rect x={24} y={32} width={16} height={24} rx={3} fill="url(#canGrad)" />
        <Ellipse cx={32} cy={32} rx={8} ry={2.5} fill="#FCA5A5" />
        <Rect x={24} y={38} width={16} height={10} fill="#FFFFFF" opacity={0.85} />

        {/* Blue bottle (right) */}
        <Rect x={66} y={22} width={14} height={32} rx={3} fill="url(#canGradBlue)" />
        <Rect x={69} y={18} width={8} height={5} rx={1} fill="#FFFFFF" />
        <Rect x={66} y={32} width={14} height={12} fill="#FFFFFF" opacity={0.8} />

        {/* Front Box Body */}
        <Path
          d="M20 44 L100 44 L95 78 L25 78 Z"
          fill="url(#foodBoxGrad)"
        />
        {/* Box side fold shadow */}
        <Path d="M92 44 L100 44 L95 78 L87 78 Z" fill="url(#foodBoxSide)" />

        {/* Box Flap (hanging forward) */}
        <Path d="M22 44 L58 48 L58 58 L20 44 Z" fill="#F0CD91" />
        <Path d="M62 48 L98 44 L100 44 L62 58 Z" fill="#DEC085" />

        {/* Packing tape / seal */}
        <Rect x={56} y={44} width={8} height={34} fill="#60A5FA" opacity={0.85} />
        {/* Heart / Aid emblem */}
        <Circle cx={60} cy={64} r={6} fill="#FFFFFF" />
        <Path d="M57 64 L59.5 66.5 L63.5 62" stroke="#16A34A" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}

/**
 * High-quality vector illustration for "Hygiene Kit" / Hygiene category.
 * Depicts a clean blue caddy filled with shampoo, soap, toiletries, and bubbles.
 */
export function HygienePackageIllustration({ width = '100%', height = 90 }) {
  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={120} height={height} viewBox="0 0 120 90" fill="none">
        <Defs>
          <LinearGradient id="hygieneCaddy" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#38BDF8" />
            <Stop offset="100%" stopColor="#0284C7" />
          </LinearGradient>
          <LinearGradient id="shampooGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#60A5FA" />
            <Stop offset="100%" stopColor="#2563EB" />
          </LinearGradient>
          <LinearGradient id="lotionGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#F472B6" />
            <Stop offset="100%" stopColor="#DB2777" />
          </LinearGradient>
        </Defs>

        {/* Ambient shadow */}
        <Ellipse cx={60} cy={82} rx={46} ry={6} fill="#0F172A" opacity={0.08} />

        {/* Bubbles / sparkles in background */}
        <Circle cx={22} cy={26} r={5} fill="#BAE6FD" opacity={0.6} />
        <Circle cx={28} cy={16} r={3} fill="#BAE6FD" opacity={0.8} />
        <Circle cx={98} cy={22} r={6} fill="#BAE6FD" opacity={0.7} />
        <Circle cx={92} cy={34} r={3.5} fill="#BAE6FD" opacity={0.5} />

        {/* Green leaves behind */}
        <Path d="M16 46 Q10 24 22 30 Q20 40 16 46 Z" fill="#22C55E" />
        <Path d="M104 46 Q110 24 98 30 Q100 40 104 46 Z" fill="#22C55E" />

        {/* Tall Shampoo bottle (center) */}
        <Rect x={48} y={16} width={22} height={42} rx={6} fill="url(#shampooGrad)" />
        {/* Pump cap */}
        <Rect x={55} y={10} width={8} height={7} rx={1} fill="#F8FAFC" />
        <Path d="M53 10 H67" stroke="#F8FAFC" strokeWidth={2.5} strokeLinecap="round" />
        <Path d="M53 10 Q50 12 48 14" stroke="#F8FAFC" strokeWidth={2} strokeLinecap="round" />
        {/* Bottle label */}
        <Rect x={52} y={28} width={14} height={16} rx={2} fill="#FFFFFF" opacity={0.9} />
        <Path d="M55 33 H63" stroke="#3B82F6" strokeWidth={1.5} />
        <Path d="M55 37 H61" stroke="#94A3B8" strokeWidth={1.2} />

        {/* Pink lotion / soap bottle (left) */}
        <Rect x={28} y={24} width={18} height={34} rx={5} fill="url(#lotionGrad)" />
        <Rect x={33} y={18} width={8} height={7} rx={2} fill="#FFFFFF" />
        <Rect x={31} y={34} width={12} height={14} rx={2} fill="#FFFFFF" opacity={0.85} />

        {/* Toothbrush & paste (right) */}
        <G transform="translate(74, 18) rotate(10)">
          {/* Toothpaste tube */}
          <Path d="M2 14 L14 14 L12 36 L4 36 Z" fill="#FFFFFF" />
          <Rect x="4" y="8" width="8" height="6" fill="#38BDF8" rx="1" />
          <Rect x="2" y="20" width="12" height="8" fill="#10B981" />
          {/* Toothbrush */}
          <Rect x="16" y="2" width="4" height="38" rx="2" fill="#F59E0B" />
          <Rect x="15" y="0" width="6" height="8" rx="1" fill="#FFFFFF" />
        </G>

        {/* Blue caddy container (front) */}
        <Path
          d="M20 46 L100 46 L94 78 L26 78 Z"
          fill="url(#hygieneCaddy)"
        />
        {/* Caddy handle slot */}
        <Rect x={44} y={54} width={32} height={8} rx={4} fill="#0369A1" />
        {/* Clean sparkles */}
        <Path d="M34 62 L36 58 L38 62 L36 66 Z" fill="#FFFFFF" opacity={0.7} />
        <Path d="M86 64 L87.5 61 L89 64 L87.5 67 Z" fill="#FFFFFF" opacity={0.7} />
      </Svg>
    </View>
  );
}

/**
 * High-quality vector illustration for "Emergency Kit" / Emergency category.
 * Depicts a box with first-aid kit, flashlight, radio, emergency essentials.
 */
export function EmergencyPackageIllustration({ width = '100%', height = 90 }) {
  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={120} height={height} viewBox="0 0 120 90" fill="none">
        <Defs>
          <LinearGradient id="emergBoxGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#E2BA7A" />
            <Stop offset="100%" stopColor="#C99B52" />
          </LinearGradient>
          <LinearGradient id="redKitGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#EF4444" />
            <Stop offset="100%" stopColor="#DC2626" />
          </LinearGradient>
        </Defs>

        {/* Ambient shadow */}
        <Ellipse cx={60} cy={82} rx={48} ry={6} fill="#0F172A" opacity={0.08} />

        {/* Green leaves background */}
        <Path d="M18 40 Q10 20 22 24 Q24 34 18 40 Z" fill="#22C55E" />
        <Path d="M102 40 Q110 20 98 24 Q96 34 102 40 Z" fill="#22C55E" />

        {/* Red First Aid Kit box (center) */}
        <Rect x={42} y={16} width={36} height={32} rx={6} fill="url(#redKitGrad)" />
        <Rect x={54} y={10} width={12} height={7} rx={2} stroke="#DC2626" strokeWidth={2.5} fill="none" />
        {/* White Cross */}
        <Rect x={57} y={24} width={6} height={16} rx={1} fill="#FFFFFF" />
        <Rect x={52} y={29} width={16} height={6} rx={1} fill="#FFFFFF" />

        {/* Flashlight (left) */}
        <G transform="translate(24, 22) rotate(-15)">
          <Rect x={0} y={12} width={10} height={26} rx={2} fill="#F59E0B" />
          <Path d="M-2 8 L12 8 L10 14 L0 14 Z" fill="#1F2937" />
          <Ellipse cx={5} cy={8} rx={7} ry={2} fill="#FEF08A" />
        </G>

        {/* Radio / Battery (right) */}
        <G transform="translate(80, 20)">
          {/* Antenna */}
          <Path d="M4 14 L4 0" stroke="#64748B" strokeWidth={2} strokeLinecap="round" />
          <Circle cx={4} cy={0} r={2} fill="#EF4444" />
          <Rect x={0} y={14} width={18} height={26} rx={3} fill="#0284C7" />
          <Circle cx={9} cy={22} r={4} fill="#0369A1" />
          <Path d="M4 32 H14" stroke="#FFFFFF" strokeWidth={1.5} />
        </G>

        {/* Front Box Body */}
        <Path
          d="M20 44 L100 44 L95 78 L25 78 Z"
          fill="url(#emergBoxGrad)"
        />

        {/* Box Flap */}
        <Path d="M22 44 L58 48 L58 58 L20 44 Z" fill="#F0CD91" />
        <Path d="M62 48 L98 44 L100 44 L62 58 Z" fill="#DEC085" />

        {/* Green tape / seal with emergency badge */}
        <Rect x={56} y={44} width={8} height={34} fill="#10B981" />
        <Circle cx={60} cy={64} r={7} fill="#FFFFFF" />
        <Path d="M57 64 H63" stroke="#EF4444" strokeWidth={2} strokeLinecap="round" />
        <Path d="M60 61 V67" stroke="#EF4444" strokeWidth={2} strokeLinecap="round" />
      </Svg>
    </View>
  );
}

/**
 * High-quality vector illustration for "Relief Pack" / General category.
 * Depicts a box with blue backpack, water bottle, essentials.
 */
export function GeneralPackageIllustration({ width = '100%', height = 90 }) {
  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={120} height={height} viewBox="0 0 120 90" fill="none">
        <Defs>
          <LinearGradient id="generalBoxGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#E2BA7A" />
            <Stop offset="100%" stopColor="#C99B52" />
          </LinearGradient>
          <LinearGradient id="backpackGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#2563EB" />
            <Stop offset="100%" stopColor="#1D4ED8" />
          </LinearGradient>
        </Defs>

        {/* Ambient shadow */}
        <Ellipse cx={60} cy={82} rx={48} ry={6} fill="#0F172A" opacity={0.08} />

        {/* Green leaf foliage */}
        <Path d="M18 42 Q10 22 22 26 Q24 36 18 42 Z" fill="#22C55E" />
        <Path d="M102 42 Q110 22 98 26 Q96 36 102 42 Z" fill="#22C55E" />

        {/* Blue Backpack (right/center) */}
        <G transform="translate(62, 14)">
          {/* Top handle */}
          <Path d="M10 6 Q16 0 22 6" stroke="#1E40AF" strokeWidth={3} fill="none" />
          <Rect x={4} y={6} width={24} height={36} rx={8} fill="url(#backpackGrad)" />
          {/* Front pocket */}
          <Rect x={7} y={20} width={18} height={18} rx={4} fill="#3B82F6" />
          <Path d="M7 24 H25" stroke="#1D4ED8" strokeWidth={1.5} />
          {/* Side water pocket */}
          <Rect x={26} y={22} width={5} height={14} rx={2} fill="#1E40AF" />
        </G>

        {/* Water bottle & food packet (left) */}
        <G transform="translate(30, 20)">
          {/* Clear blue bottle */}
          <Rect x={0} y={8} width={12} height={24} rx={3} fill="#7DD3FC" />
          <Rect x={3} y={3} width={6} height={6} rx={1} fill="#0284C7" />
          {/* Canned good */}
          <Rect x={14} y={12} width={14} height={20} rx={3} fill="#F59E0B" />
          <Rect x={14} y={17} width={14} height={8} fill="#FFFFFF" opacity={0.9} />
        </G>

        {/* Front Box Body */}
        <Path
          d="M20 44 L100 44 L95 78 L25 78 Z"
          fill="url(#generalBoxGrad)"
        />

        {/* Box Flap */}
        <Path d="M22 44 L58 48 L58 58 L20 44 Z" fill="#F0CD91" />
        <Path d="M62 48 L98 44 L100 44 L62 58 Z" fill="#DEC085" />

        {/* Blue ribbon / seal */}
        <Rect x={56} y={44} width={8} height={34} fill="#2563EB" opacity={0.9} />
        <Circle cx={60} cy={64} r={6.5} fill="#FFFFFF" />
        <Path d="M57 64 L59.5 66.5 L63.5 62" stroke="#2563EB" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}

/**
 * High-quality vector illustration for "Medical" category.
 */
export function MedicalPackageIllustration({ width = '100%', height = 90 }) {
  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={120} height={height} viewBox="0 0 120 90" fill="none">
        <Ellipse cx={60} cy={82} rx={48} ry={6} fill="#0F172A" opacity={0.08} />
        {/* Medicine bottle */}
        <Rect x={32} y={20} width={18} height={28} rx={4} fill="#EA580C" />
        <Rect x={36} y={14} width={10} height={7} rx={2} fill="#FFFFFF" />
        <Rect x={32} y={27} width={18} height={12} fill="#FFFFFF" />
        <Path d="M38 33 H44" stroke="#DC2626" strokeWidth={1.5} />
        {/* Blister pack */}
        <Rect x={54} y={16} width={28} height={34} rx={4} fill="#E2E8F0" />
        <Circle cx={61} cy={24} r={3} fill="#3B82F6" />
        <Circle cx={75} cy={24} r={3} fill="#3B82F6" />
        <Circle cx={61} cy={34} r={3} fill="#3B82F6" />
        <Circle cx={75} cy={34} r={3} fill="#3B82F6" />
        <Circle cx={61} cy={44} r={3} fill="#3B82F6" />
        <Circle cx={75} cy={44} r={3} fill="#3B82F6" />
        {/* Front Box */}
        <Path d="M20 44 L100 44 L95 78 L25 78 Z" fill="#E2BA7A" />
        <Rect x={56} y={44} width={8} height={34} fill="#DC2626" />
        <Circle cx={60} cy={64} r={6.5} fill="#FFFFFF" />
        <Path d="M57 64 H63" stroke="#DC2626" strokeWidth={1.8} strokeLinecap="round" />
        <Path d="M60 61 V67" stroke="#DC2626" strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
    </View>
  );
}

/**
 * High-quality vector illustration for "Shelter" category.
 */
export function ShelterPackageIllustration({ width = '100%', height = 90 }) {
  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={120} height={height} viewBox="0 0 120 90" fill="none">
        <Ellipse cx={60} cy={82} rx={48} ry={6} fill="#0F172A" opacity={0.08} />
        {/* Folded blanket / tarp */}
        <Rect x={34} y={20} width={42} height={14} rx={4} fill="#0284C7" />
        <Rect x={38} y={30} width={42} height={14} rx={4} fill="#F97316" />
        {/* Rolled mat */}
        <Rect x={76} y={16} width={12} height={32} rx={6} fill="#10B981" />
        {/* Front Box */}
        <Path d="M20 44 L100 44 L95 78 L25 78 Z" fill="#E2BA7A" />
        <Rect x={56} y={44} width={8} height={34} fill="#0284C7" />
        <Circle cx={60} cy={64} r={6.5} fill="#FFFFFF" />
        <Path d="M57 64 L59.5 66.5 L63.5 62" stroke="#0284C7" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}

/**
 * High-quality vector illustration for "Water" category.
 */
export function WaterPackageIllustration({ width = '100%', height = 90 }) {
  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={120} height={height} viewBox="0 0 120 90" fill="none">
        <Ellipse cx={60} cy={82} rx={48} ry={6} fill="#0F172A" opacity={0.08} />
        {/* Large 5-gallon blue water jug */}
        <Rect x={44} y={14} width={32} height={36} rx={7} fill="#38BDF8" />
        <Rect x={54} y={8} width={12} height={7} rx={2} fill="#0284C7" />
        <Rect x={48} y={22} width={24} height={8} rx={3} fill="#0284C7" opacity={0.4} />
        {/* Water drops */}
        <Circle cx={32} cy={26} r={3} fill="#38BDF8" opacity={0.7} />
        <Circle cx={88} cy={24} r={3.5} fill="#38BDF8" opacity={0.7} />
        {/* Front Box */}
        <Path d="M20 44 L100 44 L95 78 L25 78 Z" fill="#E2BA7A" />
        <Rect x={56} y={44} width={8} height={34} fill="#0284C7" />
        <Circle cx={60} cy={64} r={6.5} fill="#FFFFFF" />
        <Path d="M60 60 C58 63 56 64.5 56 66 C56 68.2 57.8 70 60 70 C62.2 70 64 68.2 64 66 C64 64.5 62 63 60 60 Z" fill="#0284C7" />
      </Svg>
    </View>
  );
}

/**
 * Dispatches to the appropriate category illustration component based on package category or name.
 */
export default function PackageIllustration({ category = '', name = '', width = '100%', height = 90 }) {
  const normCategory = String(category || '').toLowerCase();
  const normName = String(name || '').toLowerCase();

  if (normCategory.includes('food') || normName.includes('food')) {
    return <FoodPackageIllustration width={width} height={height} />;
  }
  if (normCategory.includes('hygiene') || normName.includes('hygiene') || normName.includes('toilet')) {
    return <HygienePackageIllustration width={width} height={height} />;
  }
  if (normCategory.includes('emerg') || normName.includes('emerg') || normName.includes('disaster')) {
    return <EmergencyPackageIllustration width={width} height={height} />;
  }
  if (normCategory.includes('medic') || normName.includes('medic') || normName.includes('first aid')) {
    return <MedicalPackageIllustration width={width} height={height} />;
  }
  if (normCategory.includes('shelter') || normName.includes('shelter') || normName.includes('tent')) {
    return <ShelterPackageIllustration width={width} height={height} />;
  }
  if (normCategory.includes('water') || normName.includes('water')) {
    return <WaterPackageIllustration width={width} height={height} />;
  }

  // Default to General / Relief Pack
  return <GeneralPackageIllustration width={width} height={height} />;
}
