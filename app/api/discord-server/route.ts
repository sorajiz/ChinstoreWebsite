import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface DiscordServerStats {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  banner: string | null;
  approximate_member_count: number;
  approximate_presence_count: number;
  instant_invite: string;
  foundedDate: string;
  premium_tier: number;
  premium_subscription_count: number;
}

// Fallback data matching real server stats in case Discord API is temporarily rate-limited
const FALLBACK_STATS: DiscordServerStats = {
  id: '1434004045940391948',
  name: 'Chin Sì Cem | Scammers',
  description: 'Trùm Scammers VN',
  icon: 'https://cdn.discordapp.com/icons/1434004045940391948/207e41f3283f785578928a930450b97e.png',
  banner: '/discord-banner.gif',
  approximate_member_count: 1197,
  approximate_presence_count: 251,
  instant_invite: 'https://discord.gg/mSG6dR4JMv',
  foundedDate: 'Thành lập từ thg 11 2025',
  premium_tier: 3,
  premium_subscription_count: 34,
};

export async function GET() {
  try {
    // 1. Primary: Fetch via Discord Invite API with counts
    const inviteRes = await fetch(
      'https://discord.com/api/v10/invites/mSG6dR4JMv?with_counts=true',
      {
        next: { revalidate: 15 },
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'ChinStoreWeb/1.0',
        },
      }
    );

    if (inviteRes.ok) {
      const data = await inviteRes.json();
      const guild = data.guild || {};
      const profile = data.profile || {};

      const iconUrl = guild.icon
        ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
        : FALLBACK_STATS.icon;

      const bannerUrl = guild.banner
        ? (guild.banner.startsWith('a_')
          ? `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.gif?size=600`
          : `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.png?size=600`)
        : '/discord-banner.gif';

      return NextResponse.json({
        id: guild.id || FALLBACK_STATS.id,
        name: guild.name || FALLBACK_STATS.name,
        description: guild.description || profile.description || FALLBACK_STATS.description,
        icon: iconUrl,
        banner: bannerUrl,
        approximate_member_count:
          data.approximate_member_count ?? profile.member_count ?? FALLBACK_STATS.approximate_member_count,
        approximate_presence_count:
          data.approximate_presence_count ?? profile.online_count ?? FALLBACK_STATS.approximate_presence_count,
        instant_invite: 'https://discord.gg/mSG6dR4JMv',
        foundedDate: 'Thành lập từ thg 11 2025',
        premium_tier: guild.premium_tier ?? 3,
        premium_subscription_count: guild.premium_subscription_count ?? 34,
      });
    }

    // 2. Secondary: Fetch via Guild Widget API
    const widgetRes = await fetch(
      'https://discord.com/api/guilds/1434004045940391948/widget.json',
      {
        next: { revalidate: 15 },
        headers: { 'Accept': 'application/json' },
      }
    );

    if (widgetRes.ok) {
      const wData = await widgetRes.json();
      return NextResponse.json({
        ...FALLBACK_STATS,
        name: wData.name || FALLBACK_STATS.name,
        approximate_presence_count: wData.presence_count ?? FALLBACK_STATS.approximate_presence_count,
        instant_invite: wData.instant_invite || FALLBACK_STATS.instant_invite,
      });
    }

    return NextResponse.json(FALLBACK_STATS);
  } catch (error) {
    // Zero-downtime safety: return exact fallback values without ever breaking UI
    return NextResponse.json(FALLBACK_STATS);
  }
}
