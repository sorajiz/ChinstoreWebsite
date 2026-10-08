'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import {
  X,
  ShieldCheck,
  Scale,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Gamepad2,
  Sparkles,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  FileText,
  BadgeAlert,
  Flame,
} from 'lucide-react';

type LegalTab = 'general' | 'mfa' | 'nitro' | 'mmo' | 'refund';

export default function LegalTermsModal() {
  const { isLegalModalOpen, setLegalModalOpen, legalInitialTab } = useStore();
  const [activeTab, setActiveTab] = useState<LegalTab>('general');

  useEffect(() => {
    if (legalInitialTab && ['general', 'mfa', 'nitro', 'mmo', 'refund'].includes(legalInitialTab)) {
      setActiveTab(legalInitialTab as LegalTab);
    }
  }, [legalInitialTab, isLegalModalOpen]);

  // Lock scroll when open
  useEffect(() => {
    if (isLegalModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLegalModalOpen]);

  if (!isLegalModalOpen) return null;

  const tabs = [
    { id: 'general' as LegalTab, label: 'Luật Lệ Chung', icon: Scale },
    { id: 'refund' as LegalTab, label: 'Hoàn Tiền & Bảo Hành', icon: ShieldCheck },
    { id: 'mfa' as LegalTab, label: 'TOS Minecraft MFA', icon: Gamepad2, badge: 'Quan trọng' },
    { id: 'nitro' as LegalTab, label: 'TOS Discord Nitro', icon: Sparkles },
    { id: 'mmo' as LegalTab, label: 'MMO & Dịch Vụ Khác', icon: Flame },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        onClick={() => setLegalModalOpen(false)}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-t-[28px] sm:rounded-3xl shadow-2xl z-10 max-h-[92dvh] sm:max-h-[88vh] flex flex-col overflow-hidden text-zinc-900 dark:text-white transition-all animate-in slide-in-from-bottom duration-300">
        
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between shrink-0 bg-zinc-50/50 dark:bg-[#16161a]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center shrink-0 shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-zinc-950 dark:text-white font-sans tracking-tight">
                  Pháp Lý & Cam Kết ChinStore
                </h2>
                <span className="hidden xs:inline-block px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20">
                  Hiệu lực ngay
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans">
                Vui lòng đọc kỹ các điều khoản và quy định trước khi thực hiện giao dịch
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setLegalModalOpen(false)}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer shrink-0"
            title="Đóng"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab Selection Navigation (Hỗ trợ vuốt ngang trên Mobile) */}
        <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/50 dark:bg-[#151518] overflow-x-auto scrollbar-none shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold font-sans whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono uppercase ${
                    isActive ? 'bg-amber-400 text-zinc-950' : 'bg-amber-500/20 text-amber-500'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Body - Cuộn mượt mà trên cả Mobile & PC */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 pb-10 space-y-6 touch-pan-y scrollbar-thin text-xs sm:text-sm font-sans"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* TAB 1: LUẬT LỆ CHUNG */}
          {activeTab === 'general' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#18181D] border border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center gap-2 text-zinc-950 dark:text-white font-bold text-sm">
                  <Scale className="w-4 h-4 text-emerald-500" />
                  <span>Quy Định & Luật Lệ Chung Tại ChinStore</span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">
                  Tất cả khách hàng tham gia mua sắm và sử dụng dịch vụ tại ChinStore vui lòng tuân thủ các quy tắc ứng xử và điều khoản cốt lõi dưới đây:
                </p>
                <ul className="space-y-2.5 pt-1 text-zinc-700 dark:text-zinc-300">
                  <li className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span><strong>Thời gian xử lý:</strong> Các đơn hàng sẽ hoàn thành tối đa trong vòng <strong>48 giờ</strong> kể từ khi ghi nhận thanh toán thành công.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                    <span><strong>Chứng từ xác minh:</strong> Khi yêu cầu Hoàn tiền / Bảo hành, khách hàng bắt buộc phải cung cấp đầy đủ <strong>(Lịch sử giao dịch - DMs bot xác nhận - Lịch sử ticket)</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <BadgeAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span><strong>Ứng xử trong Ticket:</strong> Hạn chế spam ping và hối thúc nhân viên hỗ trợ, vì ngay khi đơn hàng hoàn tất kỹ thuật viên sẽ ping thông báo ngay lập tức.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Chấp thuận TOS:</strong> Mua hàng đồng nghĩa với việc bạn <strong>bắt buộc phải đọc và chấp nhận TOS</strong> trước khi mua.</span>
                  </li>
                </ul>
              </div>

              {/* Callout Notice */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs space-y-1.5 font-mono">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>CHÚNG TÔI CÓ QUYỀN THAY ĐỔI TOS BẤT KỲ LÚC NÀO</span>
                </div>
                <p className="font-sans text-[11px] leading-relaxed">
                  ChinStore có quyền thay đổi TOS mà không cần thông báo trước. Khi TOS mới ban hành sẽ được áp dụng ngay lập tức cho toàn bộ các giao dịch phát sinh.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: HOÀN TIỀN & BẢO HÀNH */}
          {activeTab === 'refund' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Chính sách hoàn tiền */}
              <div className="space-y-4">
                <h3 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Chính Sách Hoàn Tiền (Refund Policy)</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Không hoàn tiền */}
                  <div className="p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 space-y-2.5">
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wide">
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span>Không hoàn tiền trong các tình huống</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300 pl-1">
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>Khách hàng vi phạm hoặc làm sai quy định bảo hành.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>Nền tảng bên thứ ba (Microsoft, Discord, Netflix...) đơn phương thay đổi chính sách máy chủ.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>Lỗi phát sinh do bên người mua (tự ý đổi thông tin sai cách, share account, dính virus,...).</span>
                      </li>
                    </ul>
                  </div>

                  {/* Hoàn tiền 100% & 40% */}
                  <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-2.5">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wide">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Các trường hợp được hoàn tiền</span>
                    </div>
                    <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300 pl-1">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span><strong>Hoàn tiền 100%:</strong> Bạn không muốn chờ đợi hoặc đổi ý mua mặt hàng khác trước khi giao hàng.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span><strong>Hoàn tiền 100%:</strong> Hàng bị lỗi kỹ thuật hoặc shop giao sai sản phẩm mà không có hàng thay thế.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span><strong>Hoàn tiền 100%:</strong> Đơn hàng quá 48 giờ chưa hoàn thành mà không có thỏa thuận trước.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span><strong>Hoàn tiền 40%:</strong> Yêu cầu hủy đơn khi mới chỉ trôi qua 24 giờ kể từ lúc đặt hàng.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Chính sách bảo hành chung */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#18181D] border border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center gap-2 text-zinc-950 dark:text-white font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-cyan-500" />
                  <span>Quy Định Bảo Hành & Cam Kết Vouch/Legit</span>
                </div>
                <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Bảo hành theo đúng thời gian và cam kết của từng mặt hàng có chính sách bảo hành.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <BadgeAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span><strong>Bắt buộc Legit / Vouch:</strong> Không bảo hành nếu khách chưa để lại Legit (đánh giá uy tín) sau khi nhận hàng.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span><strong>Không bảo hành khi:</strong> Khách hàng tự ý <strong>Out Server Discord Và Join Vào Lại Server</strong> trong thời gian bảo hành.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>Sau khi hoàn tất đơn hàng, shop sẽ nhắc để lại Legit tối đa 5 lần. Nếu khách cố tình không phối hợp, shop sẽ đóng ticket và <strong>từ chối bảo hành vĩnh viễn</strong> cho mặt hàng đã mua.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: TOS MINECRAFT MFA */}
          {activeTab === 'mfa' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300">
                  <Flame className="w-4 h-4 shrink-0 text-amber-500" />
                  <span>ĐIỀU KHOẢN ĐẶC BIỆT DÀNH RIÊNG CHO TÀI KHOẢN MINECRAFT (MFA / ALTS)</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-500 text-zinc-950 text-[10px] font-mono font-bold shrink-0">
                  TOS 1 GIỜ
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    num: '1',
                    title: '1 Tiếng Kiểm Tra Hàng',
                    content: 'Bạn có đúng 1 tiếng để kiểm tra hàng. Trong trường hợp bạn đã đổi thông tin account mà một thời gian sau bị back, chúng tôi không chịu trách nhiệm.',
                    type: 'warn',
                  },
                  {
                    num: '2',
                    title: 'Đọc TOS Trước Khi Mua',
                    content: 'ChinStore tuyệt đối không chịu trách nhiệm nếu khách hàng không đọc TOS trước khi bấm mua hàng.',
                    type: 'neutral',
                  },
                  {
                    num: '3',
                    title: 'Đổi Thông Tin Liền Khi Giao Account',
                    content: 'Hãy đổi thông tin ngay khi shop gửi account. Nếu quá 1 tiếng chưa log dẫn đến mất tài khoản thì khách tự chịu trách nhiệm, shop không quan tâm và từ chối bảo hành.',
                    type: 'warn',
                  },
                  {
                    num: '4',
                    title: 'Bắt Buộc Vouch Khi Log Thành Công',
                    content: 'Nếu đã log hoàn toàn vào được tài khoản thì bắt buộc phải Vouch. Nếu không vouch trong vòng 1 tiếng kế tiếp = Mất quyền hỗ trợ và mất bảo hành tài khoản.',
                    type: 'warn',
                  },
                  {
                    num: '5',
                    title: 'Account Dính Family Hoặc GamePass',
                    content: 'Khi nhận được account mà trúng account Family hay GamePass,... Hãy quay video / chụp hình ảnh / gửi lại thông tin account để Store tiến hành hỗ trợ và refund lại tiền ngay nhé.',
                    type: 'success',
                  },
                  {
                    num: '6',
                    title: 'Xử Lý Khi Bị Lock Account',
                    content: 'Nếu account vừa giao mà bị lock ngay lúc đang đổi thông tin thì hãy gửi ngay cho Store để phối hợp giải quyết. Còn về việc bạn đã nhận account đầy đủ mà nếu trong một thời gian bị lock là do Microsoft quét hàng loạt khi phát hiện hành vi bất thường: Chúng tôi CHỈ BẢO HÀNH 1 GIỜ.',
                    type: 'warn',
                  },
                  {
                    num: '7',
                    title: 'Hỗ Trợ Server Ban DonutSMP & Hypixel',
                    content: 'Chúng tôi hỗ trợ đối với các tài khoản bị server ban trên DonutSMP và Hypixel (kiểm tra hướng dẫn unban hoặc đổi tài khoản theo quy định).',
                    type: 'success',
                  },
                  {
                    num: '8',
                    title: 'Kiểm Tra All Game & Thời Hạn 3 Giờ Báo Cáo',
                    content: 'Chỉ hỗ trợ account mới giao: Hãy check kĩ toàn bộ thông tin account, check All Game, Family, các Cosmic Game,... Khi trục trặc hay có lỗi hãy mở Ticket để đổi và bảo hành. CHỈ CÓ 3 GIỜ để báo cáo về vụ việc này, quá thời gian sẽ không hỗ trợ và không bảo hành. Riêng trường hợp bị dính GamePass sẽ được hỗ trợ 7 ngày.',
                    type: 'warn',
                  },
                  {
                    num: '9',
                    title: 'Code Redeem Áo Choàng (Cape)',
                    content: 'Nếu đã nhận được code Redeem Cape mà để đó không redeem vào account trong vòng 10 PHÚT, nếu code bị lỗi hay hết hạn thì shop KHÔNG HỖ TRỢ CHỊU TRÁCH NHIỆM. Chỉ hỗ trợ bảo hành 1 giờ khi redeem thành công và có vouch.',
                    type: 'warn',
                  },
                ].map((item) => (
                  <div
                    key={item.num}
                    className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-[#18181D] border border-zinc-200/90 dark:border-zinc-800 flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {item.num}
                    </div>
                    <div className="space-y-1">
                      <div className="font-bold text-xs sm:text-sm text-zinc-950 dark:text-white">
                        {item.title}
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chốt điều khoản */}
              <div className="p-3.5 rounded-2xl bg-zinc-950 text-white dark:bg-[#09090b] border border-zinc-800 text-center font-mono text-xs space-y-1">
                <div className="text-amber-400 font-bold">NẾU BẠN ĐÃ MUA HÀNG THÌ BẠN ĐÃ MẶC ĐỊNH CHẤP NHẬN TOS NÀY</div>
                <div className="text-zinc-400 text-[11px]">Cam kết an toàn - Minh bạch - Uy tín hàng đầu thị trường</div>
              </div>
            </div>
          )}

          {/* TAB 4: TOS DISCORD NITRO & DECAO */}
          {activeTab === 'nitro' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#18181D] border border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center gap-2 text-zinc-950 dark:text-white font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>Quy Định Kích Hoạt & Bảo Hành Discord Nitro, Decao</span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">
                  Để quá trình nâng cấp Nitro và Decao diễn ra trơn tru nhất, quý khách vui lòng kiểm tra kĩ các điều kiện tài khoản:
                </p>
                <div className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-900 dark:text-indigo-300 space-y-1">
                    <div className="font-bold">Điều Kiện Tài Khoản Nhận Nitro Khuyến Mãi (Promo Link):</div>
                    <ul className="list-disc list-inside space-y-1 text-xs opacity-90 pl-1">
                      <li>Tài khoản Discord phải được <strong>tạo trên 1 tháng</strong>.</li>
                      <li>Tài khoản <strong>chưa từng sử dụng Nitro</strong> hoặc đã hết hạn Nitro trên 1 năm.</li>
                      <li>Khách hàng nên tự dán link check thử trước khi nhận gói theo hướng dẫn tại mục Tutorial FAQ.</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-1">
                    <div className="font-bold text-zinc-950 dark:text-white">Bảo Hành Gói Nitro & Decao:</div>
                    <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                      <li>• Bảo hành trọn đời gói đăng ký đối với lỗi bị thu hồi hoặc lỗi thẻ thanh toán từ bên Store.</li>
                      <li>• Bắt buộc để lại Vouch / Legit sau khi kích hoạt thành công để kích hoạt chế độ bảo hành.</li>
                      <li>• Nghiêm cấm hành vi rời máy chủ ChinStore (Out server và Re-join): Sẽ bị huỷ bảo hành tức thì.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MMO & DỊCH VỤ KHÁC */}
          {activeTab === 'mmo' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#18181D] border border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center gap-2 text-zinc-950 dark:text-white font-bold text-sm">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>Quy Định Cho Dịch Vụ MMO, Netflix, Spotify & CS2 Prime</span>
                </div>
                <div className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                  <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-1">
                    <div className="font-bold text-zinc-950 dark:text-white">Tài khoản Netflix 4K & Spotify Premium:</div>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Đối với gói xem chung / profile cá nhân: Nghiêm cấm đổi mật khẩu, tên hồ sơ hoặc mã PIN của các profile khác trong gia đình. Vi phạm sẽ bị thu hồi tài khoản không hoàn tiền.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-1">
                    <div className="font-bold text-zinc-950 dark:text-white">Steam CS2 Prime & Key Game Bản Quyền:</div>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Tất cả key và tài khoản CS2 Prime được cam kết sạch 100%, không dính VAC Ban hoặc can thiệp phần mềm thứ 3 tại thời điểm bàn giao. Khách hàng vui lòng kích hoạt và liên kết số điện thoại bảo mật ngay khi nhận đơn.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-[#151518] flex items-center justify-between gap-3 shrink-0">
          <a
            href="https://discord.gg/mSG6dR4JMv"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            <span>Cần hỗ trợ? Mở Ticket Discord</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={() => setLegalModalOpen(false)}
            className="py-2.5 px-5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            Tôi Đã Hiểu & Đồng Ý
          </button>
        </div>

      </div>
    </div>
  );
}
