'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from '@/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  User,
  Shield,
  KeyRound,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [unlinking, setUnlinking] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await fetch('/api/user/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Đã sao chép vào bộ nhớ tạm!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadTxt = (orderCode: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `CHINSTORE_${orderCode}_CREDENTIALS.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Đã tải xuống file thông tin tài khoản!');
  };

  const handleUnlinkDiscord = async () => {
    try {
      setUnlinking(true);
      const res = await fetch('/api/auth/discord/unlink', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        window.location.reload();
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error('Lỗi khi hủy liên kết');
    } finally {
      setUnlinking(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05070f] text-cyan-400 font-mono">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const user = session?.user as any;

  return (
    <div className="min-h-screen flex flex-col bg-[#05070f] text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-black font-display tracking-tight text-white">
              Hồ Sơ Cá Nhân & Tủ Đồ Số
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Quản lý tài khoản, liên kết Discord và xem lại các tài nguyên đã mua
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="self-start px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-rose-500/20 text-xs font-semibold text-rose-300 border border-white/10 hover:border-rose-500/40 flex items-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng Xuất</span>
          </button>
        </div>

        {/* User Info & Discord Link Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Card */}
          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xl">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  {user?.name || 'Khách hàng'}
                </h3>
                <div className="text-xs text-slate-400">{user?.email}</div>
                <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                  <Shield className="w-3 h-3" />
                  <span>Vai trò: {user?.role || 'USER'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Discord Integration Card */}
          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#5865F2]">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-display">
                    Tài Khoản Discord
                  </h4>
                  <div className="text-xs text-slate-400">
                    {user?.discordUsername ? (
                      <span className="text-emerald-400 font-mono">
                        Đã liên kết: {user.discordUsername}
                      </span>
                    ) : (
                      'Chưa liên kết tài khoản Discord'
                    )}
                  </div>
                </div>
              </div>

              {user?.discordUsername ? (
                <button
                  onClick={handleUnlinkDiscord}
                  disabled={unlinking}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-rose-500/20 text-[11px] font-semibold text-rose-300 border border-white/10 hover:border-rose-500/40 transition-all"
                >
                  {unlinking ? 'Đang hủy...' : 'Hủy liên kết'}
                </button>
              ) : (
                <button
                  onClick={() => signIn('discord')}
                  className="px-3 py-1.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white text-[11px] font-bold shadow-md transition-all"
                >
                  Liên kết ngay
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Liên kết Discord giúp bạn đăng nhập 1-click tức thì và nhận thông báo hỗ trợ từ bot của ChinStore.
            </p>
          </div>
        </div>

        {/* Order History & Digital Cabinet */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-cyan-400" />
              <span>Kho Hàng Số Đã Mua ({orders.length})</span>
            </h2>
            <button
              onClick={fetchOrders}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin' : ''}`} />
              <span>Làm mới</span>
            </button>
          </div>

          {loadingOrders ? (
            <div className="p-12 text-center text-slate-500 font-mono text-xs">
              Đang tải lịch sử đơn hàng...
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center rounded-3xl glass-card border border-white/5 space-y-2">
              <p className="text-sm text-slate-400">Bạn chưa mua sản phẩm nào.</p>
              <a href="/#catalog" className="text-xs text-cyan-400 hover:underline">
                Khám phá cửa hàng ngay
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-6 rounded-3xl glass-card border border-white/10 space-y-4"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono font-bold text-cyan-400">
                        #{ord.orderCode}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(ord.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {ord.status === 'PAID' && (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          ĐÃ THANH TOÁN
                        </span>
                      )}
                      {ord.status === 'PAYMENT_PENDING' && (
                        <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 text-xs font-bold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          CHỜ THANH TOÁN
                        </span>
                      )}
                      {ord.status === 'MANUAL_REVIEW' && (
                        <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          CHỜ DUYỆT THỦ CÔNG
                        </span>
                      )}
                      {ord.status === 'UNDERPAID' && (
                        <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 text-xs font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          CHUYỂN THIẾU TIỀN
                        </span>
                      )}
                      {ord.status === 'EXPIRED' && (
                        <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5" />
                          ĐƠN HẾT HẠN
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div className="space-y-2">
                    {ord.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="text-white font-medium">{item.productName}</span>
                        <span className="text-slate-400 font-mono">
                          {formatPrice(item.priceVND, 'VND')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Manual Review Alert */}
                  {ord.status === 'MANUAL_REVIEW' && (
                    <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-300 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-purple-400" />
                        <span>Đơn hàng chuyển vào hàng đợi xử lý thủ công (Late Payment)</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Lý do: {ord.reviewReason || 'Nhận thanh toán sau khi đơn đã hết hạn'}. Số tiền của bạn đã được ghi nhận an toàn. Vui lòng liên hệ Admin/Telegram để nhận tài khoản mới hoặc hoàn tiền 100%.
                      </p>
                    </div>
                  )}

                  {/* Decrypted Payload Box if PAID */}
                  {ord.status === 'PAID' && ord.decryptedData && (
                    <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-cyan-400 font-bold uppercase flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5" />
                          Dữ liệu tài khoản / License Key (Đã giải mã AES-256-GCM)
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(ord.decryptedData, ord.id)}
                            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-mono flex items-center gap-1 transition-all"
                          >
                            {copiedId === ord.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>Copy tất cả</span>
                          </button>
                          <button
                            onClick={() => handleDownloadTxt(ord.orderCode, ord.decryptedData)}
                            className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[11px] font-mono flex items-center gap-1 transition-all"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Tải .txt</span>
                          </button>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#070b16] border border-white/10 font-mono text-xs text-emerald-300 select-all break-all whitespace-pre-wrap">
                        {ord.decryptedData}
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Chính sách: {ord.items[0]?.warrantyPolicy || 'Bảo hành 24h'}</span>
                        <span className="text-emerald-400">Giao hàng tự động tức thì</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
