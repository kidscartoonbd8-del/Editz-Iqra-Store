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
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white md:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base tracking-tight block leading-tight">
                  ProjuktiShikha BD <span className="text-xs font-bold text-emerald-400">Admin</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:block">
                  {adminEmail}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onViewPublicSite}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">ওয়েবসাইট দেখুন</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-red-500/30"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>

        {/* Desktop Secondary Navigation Bar */}
        <div className="hidden md:block bg-slate-950 border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950 border-t border-slate-800 p-3 space-y-1">
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
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between text-left cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
};
