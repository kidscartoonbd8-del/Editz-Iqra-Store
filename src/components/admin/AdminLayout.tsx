import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Sliders,
  CreditCard,
  Tag,
  Shield,
  LogOut,
  Globe,
  Menu,
  X,
  GraduationCap
} from 'lucide-react';

interface AdminLayoutProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  adminEmail: string;
  onLogout: () => void;
  onViewPublicSite: () => void;
  pendingOrdersCount: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  onSelectTab,
  adminEmail,
  onLogout,
  onViewPublicSite,
  pendingOrdersCount,
  children
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'products', label: 'কোর্স ও প্রোডাক্ট', icon: Package },
    {
      id: 'orders',
      label: 'অর্ডার ও পেমেন্ট',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null
    },
    { id: 'hero', label: 'হিরো ব্যানার', icon: Sliders },
    { id: 'payments', label: 'পেমেন্ট গেটওয়ে', icon: CreditCard },
    { id: 'offers', label: 'বিশেষ অফার', icon: Tag },
    { id: 'security', label: 'এডমিন সিকিউরিটি', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-[#000000] via-[#040d24] to-[#000000] flex flex-col font-sans text-slate-100">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-linear-to-r from-black via-blue-950 to-black text-white border-b border-blue-900/60 shadow-xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white md:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/30 border border-blue-400/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base tracking-tight block leading-tight">
                  ProjuktiShikha BD{' '}
                  <span className="text-[10px] font-bold bg-blue-950 text-cyan-300 px-1.5 py-0.5 rounded border border-blue-800/40">
                    Admin
                  </span>
                </span>
                <span className="text-[10px] text-blue-300/80 font-mono hidden sm:block">
                  {adminEmail}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onViewPublicSite}
              className="px-3 py-1.5 bg-blue-950/60 hover:bg-blue-900/70 text-blue-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-800/40"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">ওয়েবসাইট দেখুন</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-1.5 bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-red-500/30"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>

        {/* Desktop Secondary Navigation Bar */}
        <div className="hidden md:block border-t border-blue-900/40 bg-black/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 py-1.5 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/30'
                      : 'text-slate-400 hover:text-white hover:bg-blue-950/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 bg-red-500 text-white text-[10px] font-black rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-linear-to-b from-[#020617] via-[#050f28] to-[#020617] border-b border-blue-900/60 px-4 py-3 space-y-1 shadow-2xl animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-blue-950/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-black rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
};
