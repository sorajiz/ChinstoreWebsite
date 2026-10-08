export interface MfaBadge {
  label: string;
  color: string; // 'amber' | 'emerald' | 'indigo' | 'rose' | 'cyan' | 'purple'
}

export type MfaStatus = 'AVAILABLE' | 'RESERVED' | 'IN_COMING' | 'SOLD';
export type MfaAccountType = 'NORMAL' | 'GAMEPASS' | 'FAMILY';
export type MfaPriceTier = '1-7' | '8-30' | '30-60' | '60-120';

export interface MfaAccount {
  id: string;
  slug: string;
  maskedName: string;
  priceUSD: number;
  priceVND: number;
  status: MfaStatus;
  accountType: MfaAccountType;
  tier: MfaPriceTier;
  rank: 'NON' | 'VIP' | 'VIP+' | 'MVP' | 'MVP+' | 'MVP++';
  server: string;
  capeType?: string;
  badges: MfaBadge[];
  skinImage: string;
  timeAgo: string;
  seller: string;
  rating: number;
  description: string[];
}

export const MFA_ACCOUNTS_DATA: MfaAccount[] = [
  // ==========================================
  // 1-7$ TIER
  // ==========================================
  {
    id: 'mfa-01',
    slug: 'sa-clean-alt-01',
    maskedName: 'SA*******9',
    priceUSD: 4.50,
    priceVND: 112500,
    status: 'AVAILABLE',
    accountType: 'NORMAL',
    tier: '1-7',
    rank: 'NON',
    server: 'Clean',
    badges: [
      { label: 'Pan', color: 'amber' },
      { label: 'Common', color: 'emerald' },
    ],
    skinImage: '/images/minecraft/skin-suit.jpg',
    timeAgo: '5m ago',
    seller: 'Seller #499',
    rating: 4.9,
    description: [
      'Not a family or locked account — Has Minecraft Account (Java + Bedrock)',
      'Full access — change email, password, and security settings',
      'Instant delivery after payment confirms',
    ],
  },
  {
    id: 'mfa-02',
    slug: 'no-vanilla-02',
    maskedName: 'NO******K',
    priceUSD: 6.20,
    priceVND: 155000,
    status: 'AVAILABLE',
    accountType: 'NORMAL',
    tier: '1-7',
    rank: 'NON',
    server: 'Hypixel',
    badges: [
      { label: 'Vanilla', color: 'emerald' },
      { label: 'Clean Ban', color: 'cyan' },
    ],
    skinImage: '/images/minecraft/skin-suit.jpg',
    timeAgo: '12m ago',
    seller: 'Seller #218',
    rating: 5.0,
    description: [
      'Clean Hypixel history with zero bans or mute records',
      'Full access — change email, password, and recovery secret',
      'Instant delivery via AES-256 encrypted vault',
    ],
  },
  {
    id: 'mfa-03',
    slug: 'gp-gamepass-starter-03',
    maskedName: 'GP******1',
    priceUSD: 3.90,
    priceVND: 97500,
    status: 'AVAILABLE',
    accountType: 'GAMEPASS',
    tier: '1-7',
    rank: 'NON',
    server: 'Clean',
    badges: [
      { label: 'GamePass', color: 'indigo' },
      { label: 'Starter', color: 'purple' },
    ],
    skinImage: '/images/minecraft/skin-suit.jpg',
    timeAgo: '20m ago',
    seller: 'Seller #102',
    rating: 4.8,
    description: [
      'Xbox GamePass PC Account active subscription',
      'Includes Minecraft Java & Bedrock editions',
      'Supported with 7-day replacement warranty',
    ],
  },
  {
    id: 'mfa-04',
    slug: 'so-sold-starter-04',
    maskedName: 'SO******X',
    priceUSD: 3.50,
    priceVND: 87500,
    status: 'SOLD',
    accountType: 'NORMAL',
    tier: '1-7',
    rank: 'NON',
    server: 'Clean',
    badges: [
      { label: 'Sold', color: 'rose' },
    ],
    skinImage: '/images/minecraft/skin-suit.jpg',
    timeAgo: '2h ago',
    seller: 'Seller #499',
    rating: 4.9,
    description: [
      'Account already purchased and delivered to customer',
    ],
  },

  // ==========================================
  // 8-30$ TIER
  // ==========================================
  {
    id: 'mfa-05',
    slug: 'mc-cape-866',
    maskedName: 'MC******CAPE',
    priceUSD: 8.66,
    priceVND: 216500,
    status: 'AVAILABLE',
    accountType: 'NORMAL',
    tier: '8-30',
    rank: 'NON',
    server: 'Donut',
    capeType: 'CAPE',
    badges: [
      { label: 'Pan', color: 'amber' },
      { label: 'Common', color: 'emerald' },
    ],
    skinImage: '/images/minecraft/optifine-cape.jpg',
    timeAgo: '15m ago',
    seller: 'Seller #499',
    rating: 4.9,
    description: [
      'Not a family or locked account — Has Minecraft Account (Java + Bedrock)',
      'Full access — change email, password, and security settings',
      'Instant delivery after payment confirms',
    ],
  },
  {
    id: 'mfa-06',
    slug: 'lu-hypixel-vip-06',
    maskedName: 'LU******S',
    priceUSD: 18.50,
    priceVND: 462500,
    status: 'AVAILABLE',
    accountType: 'NORMAL',
    tier: '8-30',
    rank: 'MVP+',
    server: 'Hypixel',
    badges: [
      { label: 'MVP+', color: 'cyan' },
      { label: 'Migrated', color: 'emerald' },
    ],
    skinImage: '/images/minecraft/hypixel-mvp.jpg',
    timeAgo: '25m ago',
    seller: 'Seller #882',
    rating: 5.0,
    description: [
      'Hypixel Network lifetime MVP+ permanent rank',
      'Bedwars Stars 140+ with unlocked cosmetic victory dances',
      'Full access email & password change with 2FA secret key',
    ],
  },
  {
    id: 'mfa-07',
    slug: 'fa-family-account-07',
    maskedName: 'FA******8',
    priceUSD: 12.00,
    priceVND: 300000,
    status: 'AVAILABLE',
    accountType: 'FAMILY',
    tier: '8-30',
    rank: 'VIP',
    server: 'Clean',
    badges: [
      { label: 'Family Account', color: 'amber' },
      { label: 'Java+Bedrock', color: 'emerald' },
    ],
    skinImage: '/images/minecraft/skin-suit.jpg',
    timeAgo: '1h ago',
    seller: 'Seller #331',
    rating: 4.7,
    description: [
      'Microsoft Family Group connected account with full parental freedom',
      'Includes full email access and password update guarantee',
      'Supported with ChinStore 1-hour MFA warranty protocol',
    ],
  },
  {
    id: 'mfa-08',
    slug: 'rs-reserved-ranked-08',
    maskedName: 'RS******3',
    priceUSD: 24.00,
    priceVND: 600000,
    status: 'RESERVED',
    accountType: 'NORMAL',
    tier: '8-30',
    rank: 'VIP+',
    server: 'Hypixel',
    badges: [
      { label: 'Reserved', color: 'purple' },
      { label: 'Skyblock Rich', color: 'amber' },
    ],
    skinImage: '/images/minecraft/hypixel-mvp.jpg',
    timeAgo: '2h ago',
    seller: 'Seller #499',
    rating: 4.9,
    description: [
      'Currently on 30-minute reservation hold by customer checkout',
      'High Networth Skyblock profile with 150M+ bank coins',
    ],
  },
  {
    id: 'mfa-09',
    slug: 'ic-incoming-alt-09',
    maskedName: 'IC******5',
    priceUSD: 15.00,
    priceVND: 375000,
    status: 'IN_COMING',
    accountType: 'NORMAL',
    tier: '8-30',
    rank: 'NON',
    server: 'Clean',
    badges: [
      { label: 'In Coming', color: 'indigo' },
      { label: 'Restock Soon', color: 'cyan' },
    ],
    skinImage: '/images/minecraft/skin-suit.jpg',
    timeAgo: '3h ago',
    seller: 'Seller #102',
    rating: 4.9,
    description: [
      'Batch arriving within 24h — security audit underway',
      'Pre-orders eligible for instant allocation',
    ],
  },
  {
    id: 'mfa-10',
    slug: 'so-sold-optifine-10',
    maskedName: 'SO******2',
    priceUSD: 9.50,
    priceVND: 237500,
    status: 'SOLD',
    accountType: 'NORMAL',
    tier: '8-30',
    rank: 'NON',
    server: 'Hypixel',
    badges: [
      { label: 'Sold', color: 'rose' },
    ],
    skinImage: '/images/minecraft/optifine-cape.jpg',
    timeAgo: '4h ago',
    seller: 'Seller #499',
    rating: 4.9,
    description: [
      'Account sold and completed successfully',
    ],
  },

  // ==========================================
  // 30-60$ TIER
  // ==========================================
  {
    id: 'mfa-11',
    slug: 'be-optifine-animated-11',
    maskedName: 'BE*******5',
    priceUSD: 38.00,
    priceVND: 950000,
    status: 'AVAILABLE',
    accountType: 'NORMAL',
    tier: '30-60',
    rank: 'VIP',
    server: 'Donut',
    capeType: 'OptiFine',
    badges: [
      { label: 'OptiFine Cape', color: 'amber' },
      { label: 'DonutSMP Linked', color: 'emerald' },
    ],
    skinImage: '/images/minecraft/optifine-cape.jpg',
    timeAgo: '40m ago',
    seller: 'Seller #499',
    rating: 5.0,
    description: [
      'Authentic movable OptiFine Cape with full color customizer access',
      'DonutSMP link verified and ready to play on link.donutsmp.net',
      'Full email access + Minecraft Java & Bedrock licensed',
    ],
  },
  {
    id: 'mfa-12',
    slug: 'xj-hypixel-bedwars-12',
    maskedName: 'XJ****R',
    priceUSD: 52.00,
    priceVND: 130000,
    status: 'AVAILABLE',
    accountType: 'NORMAL',
    tier: '30-60',
    rank: 'MVP+',
    server: 'Hypixel',
    badges: [
      { label: 'Hypixel Lv150', color: 'cyan' },
      { label: 'Bedwars 400★', color: 'purple' },
    ],
    skinImage: '/images/minecraft/hypixel-mvp.jpg',
    timeAgo: '2h ago',
    seller: 'Seller #882',
    rating: 4.9,
    description: [
      'High-tier competitive account: Level 152 Hypixel, 412 Bedwars Stars',
      'Diamond Prestige badge, glorious kill effects and projectile trails',
      'Full access credentials with automated delivery',
    ],
  },
  {
    id: 'mfa-13',
    slug: 'gp-gamepass-ultimate-13',
    maskedName: 'GP******9',
    priceUSD: 35.00,
    priceVND: 875000,
    status: 'AVAILABLE',
    accountType: 'GAMEPASS',
    tier: '30-60',
    rank: 'NON',
    server: 'Clean',
    badges: [
      { label: 'GamePass 1 Year', color: 'indigo' },
      { label: 'Ultimate PC', color: 'purple' },
    ],
    skinImage: '/images/minecraft/skin-suit.jpg',
    timeAgo: '1d ago',
    seller: 'Seller #218',
    rating: 4.9,
    description: [
      'Xbox GamePass Ultimate 1-year duration private account',
      'Play Minecraft Java, Bedrock, and 100+ top Xbox PC titles',
      'Backed by ChinStore 7-day GamePass policy',
    ],
  },
  {
    id: 'mfa-14',
    slug: 'fa-family-bundle-14',
    maskedName: 'FA******2',
    priceUSD: 42.00,
    priceVND: 1050000,
    status: 'AVAILABLE',
    accountType: 'FAMILY',
    tier: '30-60',
    rank: 'VIP+',
    server: 'Clean',
    badges: [
      { label: 'Family Account', color: 'amber' },
      { label: '2x Ranks', color: 'emerald' },
    ],
    skinImage: '/images/minecraft/skin-suit.jpg',
    timeAgo: '1d ago',
    seller: 'Seller #331',
    rating: 4.8,
    description: [
      'Microsoft Family linked account with legacy playtime history',
      'Safe migration completed with full 2FA instructions included',
    ],
  },

  // ==========================================
  // 60-120$ TIER
  // ==========================================
  {
    id: 'mfa-15',
    slug: 'og-minecon-2015-15',
    maskedName: 'OG******X',
    priceUSD: 85.00,
    priceVND: 2125000,
    status: 'AVAILABLE',
    accountType: 'NORMAL',
    tier: '60-120',
    rank: 'MVP++',
    server: 'Hypixel',
    capeType: 'Minecon 2015',
    badges: [
      { label: 'Minecon 2015', color: 'amber' },
      { label: 'Ultra Rare', color: 'rose' },
      { label: 'MVP++', color: 'purple' },
    ],
    skinImage: '/images/minecraft/optifine-cape.jpg',
    timeAgo: '3h ago',
    seller: 'Seller #499',
    rating: 5.0,
    description: [
      'Official Mojang Minecon 2015 Iron Golem Cape permanently equipped',
      'MVP++ active rank with custom nick permissions on Hypixel',
      'Ultra rare collector piece — guaranteed lifetime security history',
    ],
  },
  {
    id: 'mfa-16',
    slug: 'le-minecon-2013-16',
    maskedName: 'LE******7',
    priceUSD: 115.00,
    priceVND: 2875000,
    status: 'AVAILABLE',
    accountType: 'NORMAL',
    tier: '60-120',
    rank: 'MVP++',
    server: 'Hypixel',
    capeType: 'Minecon 2013',
    badges: [
      { label: 'Minecon 2013', color: 'amber' },
      { label: 'OG 3-Letter', color: 'rose' },
    ],
    skinImage: '/images/minecraft/hypixel-mvp.jpg',
    timeAgo: '5h ago',
    seller: 'Seller #882',
    rating: 5.0,
    description: [
      'Historic 2013 Piston Minecon Cape + clean 3-character original nickname',
      'All Hypixel games legacy achievements unlocked with pristine reputation',
      'Full recovery code and original ownership certificate transferred',
    ],
  },
  {
    id: 'mfa-17',
    slug: 'so-sold-high-end-17',
    maskedName: 'SO******9',
    priceUSD: 75.00,
    priceVND: 1875000,
    status: 'SOLD',
    accountType: 'NORMAL',
    tier: '60-120',
    rank: 'MVP+',
    server: 'Hypixel',
    badges: [
      { label: 'Sold', color: 'rose' },
    ],
    skinImage: '/images/minecraft/optifine-cape.jpg',
    timeAgo: '1d ago',
    seller: 'Seller #499',
    rating: 5.0,
    description: [
      'High-tier collector account sold successfully',
    ],
  },
];

export function getMfaAccountBySlug(slug: string): MfaAccount | undefined {
  return MFA_ACCOUNTS_DATA.find((acc) => acc.slug === slug || acc.id === slug);
}
