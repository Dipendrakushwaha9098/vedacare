import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Leaf,
  FileText,
  Bell,
  Menu,
  X,
  LogOut,
  Settings,
  Search,
  ChevronDown,
  Plus,
  Moon,
  Sun,
  User,
  Shield,
} from "lucide-react";
 
const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Patients", path: "/patients" },
  { icon: CalendarDays, label: "Appointments", path: "/appointments" },
  { icon: Leaf, label: "Treatments", path: "/treatments" },
  { icon: FileText, label: "Prescriptions", path: "/prescriptions" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
];
 
const notificationsData = [
  { id: 1, text: "New appointment request", time: "5 min ago", priority: "high" },
  { id: 2, text: "Patient Priya Devi checked in", time: "15 min ago", priority: "medium" },
  { id: 3, text: "Prescription approved", time: "1 hr ago", priority: "low" },
];
 
// ─── Sidebar content (shared between desktop & mobile drawer) ─────────────────
function SidebarContent({
  onClose,
  isDarkMode,
  setIsDarkMode,
}: {
  onClose?: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
}) {
  const location = useLocation();
 
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-xl gradient-saffron flex items-center justify-center flex-shrink-0">
          <Leaf className="w-5 h-5 text-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-xl font-bold tracking-tight">vedaCare</h1>
          <p className="text-xs opacity-70">Clinic Management</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto p-1 rounded-lg hover:bg-sidebar-accent/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
 
      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item, i) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? "scale-110" : ""
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-saffron"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>
 
      {/* Mobile-only: theme toggle */}
      <div className="px-3 py-3 border-t border-sidebar-border space-y-1 lg:hidden">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 transition-colors"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span>Theme</span>
        </button>
      </div>
 
      {/* Footer */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Link>
        <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 transition-colors w-full">
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
 
// ─── Main Layout ──────────────────────────────────────────────────────────────
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
 
  return (
    /**
     * ROOT: full viewport, flex row, no overflow
     * This is the key fix — sidebar and main sit side-by-side as flex children.
     * The sidebar is NEVER `fixed` on desktop, so it stays in document flow
     * and the main content column naturally occupies the remaining width.
     */
    <div className="flex h-screen w-screen overflow-hidden bg-background">
 
      {/* ── DESKTOP SIDEBAR — always in document flow, never fixed ── */}
      <aside className="hidden lg:flex lg:flex-col w-64 flex-shrink-0 bg-sidebar text-sidebar-foreground h-full overflow-y-auto border-r border-sidebar-border">
        <SidebarContent isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </aside>
 
      {/* ── MOBILE SIDEBAR — overlay drawer, only shown when open ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Drawer panel */}
            <motion.div
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground lg:hidden border-r border-sidebar-border"
            >
              <SidebarContent
                onClose={() => setSidebarOpen(false)}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
 
      {/* ── MAIN CONTENT COLUMN ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
 
        {/* Top bar */}
        <motion.header
          initial={{ y: -64 }}
          animate={{ y: 0 }}
          className="flex-shrink-0 h-16 glass-card rounded-none border-x-0 border-t-0 flex items-center px-3 sm:px-4 lg:px-6 gap-2 sm:gap-4 z-30"
        >
          {/* Mobile hamburger */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5 text-foreground" />
          </motion.button>
 
          {/* Search — tablet+ */}
          <div className="hidden sm:flex flex-1 max-w-sm">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search patients, appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setSearchOpen(false)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>
 
          <div className="flex-1" />
 
          {/* Mobile search icon */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="sm:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="w-5 h-5 text-muted-foreground" />
          </motion.button>
 
          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setUserMenuOpen(false);
              }}
              className="relative p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              <AnimatePresence>
                {unreadNotifications > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-white text-xs flex items-center justify-center font-semibold"
                  >
                    {unreadNotifications}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
 
            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-72 bg-background rounded-xl border border-border shadow-lg z-40"
                >
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    <button
                      onClick={() => setUnreadNotifications(0)}
                      className="text-xs text-primary hover:text-primary/80"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notificationsData.map((notif, i) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`px-4 py-3 border-b border-border/50 last:border-0 cursor-pointer hover:bg-muted/50 transition-colors ${
                          notif.priority === "high" ? "bg-destructive/5" : ""
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                              notif.priority === "high"
                                ? "bg-destructive"
                                : notif.priority === "medium"
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground">{notif.text}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{notif.time}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <Link
                    to="/notifications"
                    onClick={() => setNotificationsOpen(false)}
                    className="block p-3 text-center text-xs text-primary hover:text-primary/80 font-medium border-t border-border"
                  >
                    View All Notifications
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
 
          {/* User Menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors group"
            >
              <div className="w-8 h-8 rounded-full gradient-sage flex items-center justify-center text-primary-foreground text-sm font-semibold">
                A
              </div>
              <motion.div
                animate={{ rotate: userMenuOpen ? 180 : 0 }}
                className="hidden sm:block"
              >
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            </motion.button>
 
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-background rounded-xl border border-border shadow-lg z-40"
                >
                  <div className="p-4 border-b border-border">
                    <p className="text-sm font-semibold text-foreground">Dr. Ananya Sharma</p>
                    <p className="text-xs text-muted-foreground mt-1">Clinic Administrator</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <User className="w-4 h-4 text-muted-foreground" />
                      Profile
                    </motion.button>
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      Account Security
                    </motion.button>
                    <motion.button
                      whileHover={{ x: 5 }}
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="hidden sm:flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted/50 transition-colors"
                    >
                      {isDarkMode ? (
                        <Sun className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Moon className="w-4 h-4 text-muted-foreground" />
                      )}
                      {isDarkMode ? "Light Mode" : "Dark Mode"}
                    </motion.button>
                  </div>
                  <div className="p-2 border-t border-border">
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.header>
 
        {/* Mobile search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="sm:hidden bg-background border-b border-border px-4 py-3 flex-shrink-0"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search patients, appointments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
 
        {/* ── PAGE CONTENT — scrolls independently ── */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-3 sm:p-4 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
 
      </div>
    </div>
  );
}