const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// AES-256-GCM encryption helper for seed
const MASTER_KEY_RAW = process.env.ENCRYPTION_MASTER_KEY || 'chinstore_master_cyber_key_2026_aes256_secret_key!';
function getMasterKey() {
  return crypto.createHash('sha256').update(MASTER_KEY_RAW).digest();
}

function encryptAccount(plainText) {
  const key = getMasterKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
    authTag,
  };
}

async function main() {
  console.log('--- Seeding ChinStore (EnchantAlts + Plati.market) ---');

  // Clean old data
  await prisma.paymentTransaction.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.stock.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Seed Admin User
  const adminPasswordHash = await bcrypt.hash('Admin@Chin2026!', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@chinstore.cyber',
      name: 'System Admin',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      discordUsername: 'ChinAdmin#0001',
    },
  });
  console.log('Created Admin User:', admin.email);

  // 2. Seed Categories (EnchantAlts + Plati.market)
  const catMinecraft = await prisma.category.create({
    data: {
      name: 'Minecraft Accounts & Alts',
      slug: 'minecraft-alts',
      icon: 'Gamepad2',
    },
  });

  const catGaming = await prisma.category.create({
    data: {
      name: 'Steam & Esports Gaming',
      slug: 'gaming-accounts',
      icon: 'Swords',
    },
  });

  const catAiTools = await prisma.category.create({
    data: {
      name: 'AI Intelligence & Developer',
      slug: 'ai-dev-tools',
      icon: 'Bot',
    },
  });

  const catStreaming = await prisma.category.create({
    data: {
      name: 'Streaming, VPN & Music',
      slug: 'streaming-vpn',
      icon: 'Film',
    },
  });

  // 3. Products with Serialized Stock
  const productsToCreate = [
    // Minecraft Category (EnchantAlts style)
    {
      name: 'Minecraft Java & Bedrock Full Access (FA) + Migrated',
      slug: 'minecraft-fa-migrated',
      description: 'Tài khoản Minecraft bản quyền Full Access (FA), đổi toàn bộ Email, Mật khẩu, Skin và Tên nhân vật tự do tại Minecraft.net. Truy cập mọi máy chủ không bị cấm (Hypixel Unbanned).',
      priceVND: 180000,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=1000&q=80',
      ]),
      warrantyPolicy: 'Bảo hành 1 đổi 1 trong 24 giờ kể từ khi mua nếu sai pass hoặc bị ban',
      categoryId: catMinecraft.id,
      stockItems: [
        'mc_acc_01@outlook.com:PassSecure#9928 | Nickname: CyberKnight | Hypixel: Clean',
        'mc_acc_02@proton.me:ViperCraft!2026 | Nickname: ShadowPixel | Hypixel: Clean',
        'mc_acc_03@hotmail.com:QuantumBlock$88 | Nickname: NeoCrafter | Hypixel: Clean',
        'mc_acc_04@gmail.com:AuraMiner%77 | Nickname: GlitchMaster | Hypixel: Clean',
      ],
    },
    {
      name: 'Hypixel MVP+ Ranked Account (Level 120+ / High Bedwars Stars)',
      slug: 'hypixel-mvp-plus-level120',
      description: 'Tài khoản Minecraft hạng VIP/MVP+ vĩnh viễn trên cụm máy chủ Hypixel Network lớn nhất thế giới. Đã mở khóa hiệu ứng gõ đòn neon, particle trails và quyền chọn bản đồ riêng.',
      priceVND: 490000,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80',
      ]),
      warrantyPolicy: 'Bảo hành rank MVP+ vĩnh viễn và hoàn trả nếu tài khoản bị khóa trong 48h',
      categoryId: catMinecraft.id,
      stockItems: [
        'mvp_plus_01@alts.net:HypixelGod_991! | Rank: MVP+ | Bedwars Stars: 245 | Coins: 1.2M',
        'mvp_plus_02@alts.net:SkyWarsAce_882# | Rank: MVP+ | Bedwars Stars: 180 | Coins: 850k',
      ],
    },
    {
      name: 'Minecraft OptiFine & Badlion Animated Cape Account',
      slug: 'minecraft-optifine-cape-account',
      description: 'Tài khoản có sẵn OptiFine Cape chính chủ có thể chuyển giao đổi màu sắc, kèm giao diện huy hiệu độc quyền hiển thị cho hàng triệu game thủ trên toàn thế giới.',
      priceVND: 220000,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
      ]),
      warrantyPolicy: 'Bảo hành OptiFine Cape 7 ngày đổi mới',
      categoryId: catMinecraft.id,
      stockItems: [
        'cape_master01@gmail.com:CapeFly_8819! | OF Cape Link: https://optifine.net/cape?id=9928',
        'cape_master02@gmail.com:DragonWings_22! | OF Cape Link: https://optifine.net/cape?id=9929',
      ],
    },

    // Gaming Category (Plati.market style)
    {
      name: 'Steam Account CS2 Prime Status + Level 20 + Clean Trust Factor',
      slug: 'steam-cs2-prime-clean',
      description: 'Tài khoản Steam kích hoạt CS2 Prime Status, điểm tín nhiệm Trust Factor màu xanh (Green Trust), chưa từng can thiệp phần mềm thứ ba, chơi ngay Premier Mode.',
      priceVND: 350000,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1612287232070-df8538747f3b?auto=format&fit=crop&w=1000&q=80',
      ]),
      warrantyPolicy: 'Bảo hành Prime trọn đời, hỗ trợ cấp mã Steam Guard phục vụ đăng nhập',
      categoryId: catGaming.id,
      stockItems: [
        'steam_login_cs2_01:SteamGuardPass!99 | Guard Code: R74829 | Mail: temp_steam01@chin.cyber',
        'steam_login_cs2_02:PrimeStrike#2026 | Guard Code: Q99182 | Mail: temp_steam02@chin.cyber',
        'steam_login_cs2_03:NeoGamer_883$ | Guard Code: K11829 | Mail: temp_steam03@chin.cyber',
      ],
    },
    {
      name: 'Valorant Unranked Account (Level 20 Ready / APAC Vietnam Server)',
      slug: 'valorant-unranked-level-20',
      description: 'Tài khoản Riot Games server APAC (Việt Nam), vừa đủ Level 20 để leo rank Competitive ngay. Đi kèm 15,000 Kingdom Credits và đã mở khóa Agent Omen, Reyna, Jett.',
      priceVND: 120000,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1000&q=80',
      ]),
      warrantyPolicy: 'Bảo hành 24 giờ đăng nhập và đổi mật khẩu thành công',
      categoryId: catGaming.id,
      stockItems: [
        'val_riot_apac01:RiotPassSecure!9 | Tag: CyberViper#APAC | Mail: val_apac01@chin.cyber',
        'val_riot_apac02:HeadshotKing#22 | Tag: PhantomAce#VN1 | Mail: val_apac02@chin.cyber',
      ],
    },

    // AI & Dev Tools Category
    {
      name: 'ChatGPT Plus & GPT-4o Shared Workspace Pro - 1 Month Access',
      slug: 'chatgpt-plus-workspace-1month',
      description: 'Tài khoản OpenAI có sẵn gói Plus và GPT-4o siêu tốc độ, tạo ảnh DALL-E 3 không giới hạn, phân tích dữ liệu nâng cao (Code Interpreter) và tùy biến Custom GPTs.',
      priceVND: 190000,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1000&q=80',
      ]),
      warrantyPolicy: 'Bảo hành trọn vẹn 30 ngày sử dụng, lỗi kích hoạt bù ngay tài khoản mới',
      categoryId: catAiTools.id,
      stockItems: [
        'ai_gpt_plus01@openai-team.pro:OpenAIPass_2026! | Workspace: ChinCyber AI | PIN: 9918',
        'ai_gpt_plus02@openai-team.pro:MatrixAI#8829 | Workspace: ChinCyber AI | PIN: 4421',
        'ai_gpt_plus03@openai-team.pro:NeuralVision$33 | Workspace: ChinCyber AI | PIN: 8812',
      ],
    },
    {
      name: 'Claude 3.5 Sonnet Pro & Claude Artifacts Unlimited - 30 Days',
      slug: 'claude-35-sonnet-pro-30days',
      description: 'Tài khoản Anthropic Pro kích hoạt sẵn mô hình Claude 3.5 Sonnet thông minh nhất thế giới lập trình. Tốc độ suy luận 2x, hạn mức token gấp 5 lần bản miễn phí.',
      priceVND: 240000,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
      ]),
      warrantyPolicy: 'Bảo hành 30 ngày đổi mới nếu phát sinh lỗi session',
      categoryId: catAiTools.id,
      stockItems: [
        'claude_pro01@anthropic-biz.net:Anthropic_Pro!881 | Session Token: cl_session_99f829a',
        'claude_pro02@anthropic-biz.net:SonnetPower#2026 | Session Token: cl_session_33c812d',
      ],
    },

    // Streaming, VPN & Media Category
    {
      name: 'Netflix Premium Ultra HD 4K (Private Profile with Personal PIN)',
      slug: 'netflix-premium-4k-private-profile',
      description: '1 Profile riêng biệt xem phim độ phân giải 4K HDR Atmos, cài đặt mã PIN cá nhân chống người lạ truy cập, không bị báo lỗi cùng hộ gia đình (Anti-Household).',
      priceVND: 85000,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1000&q=80',
      ]),
      warrantyPolicy: 'Bảo hành đúng thời hạn 30 ngày 1 đổi 1',
      categoryId: catStreaming.id,
      stockItems: [
        'netflix_vip01@stream.io:Net4KPass_9921! | Profile: Slot 2 (CHIN-VIP) | PIN: 2026',
        'netflix_vip02@stream.io:FlixStream#8812 | Profile: Slot 3 (CHIN-VIP) | PIN: 9988',
        'netflix_vip03@stream.io:Cinema4K$1192 | Profile: Slot 4 (CHIN-VIP) | PIN: 4455',
      ],
    },
    {
      name: 'Spotify Premium Individual - 1 Year Private Upgrade',
      slug: 'spotify-premium-1-year-upgrade',
      description: 'Nâng cấp tài khoản Spotify cá nhân lên gói Premium 1 năm. Nghe nhạc chất lượng cao 320kbps không quảng cáo, tải nhạc ngoại tuyến không giới hạn trên 5 thiết bị.',
      priceVND: 280000,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?auto=format&fit=crop&w=1000&q=80',
      ]),
      warrantyPolicy: 'Bảo hành đủ 12 tháng, giữ nguyên toàn bộ playlist và bài hát đã lưu',
      categoryId: catStreaming.id,
      stockItems: [
        'VOUCHER_CODE_SPOTIFY_1Y_CHIN_998829_PREMIUM_UPGRADE_TOKEN',
        'VOUCHER_CODE_SPOTIFY_1Y_CHIN_441192_PREMIUM_UPGRADE_TOKEN',
      ],
    },
  ];

  for (const item of productsToCreate) {
    const { stockItems, ...prodData } = item;
    const product = await prisma.product.create({
      data: prodData,
    });

    // Encrypt each stock item with AES-256-GCM and store
    for (const rawData of stockItems) {
      const { encryptedData, iv, authTag } = encryptAccount(rawData);
      await prisma.stock.create({
        data: {
          productId: product.id,
          encryptedData,
          iv,
          authTag,
          status: 'AVAILABLE',
        },
      });
    }

    console.log(`Created product: ${product.name} with ${stockItems.length} AES-256-GCM encrypted stocks.`);
  }

  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
