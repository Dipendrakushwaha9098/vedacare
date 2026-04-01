import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
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
 
// ── Magnetic button: pulls toward cursor ────────────────────────────────────
function MagneticButton({
  children,
  className,
  onClick,
  strength = 0.3,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });
 
  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };
 
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
 
  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
}
 
// ── Spinning leaf logo with orbit ring ──────────────────────────────────────
function AnimatedLogo() {
  const [hovered, setHovered] = useState(false);
 
  return (
    <motion.div
      className="relative w-10 h-10 flex-shrink-0"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Orbit ring */}
      <motion.div
        className="absolute inset-0 rounded-xl border border-saffron/40"
        animate={{ rotate: hovered ? 360 : 0, scale: hovered ? 1.2 : 1, opacity: hovered ? 1 : 0 }}
        transition={{ rotate: { duration: 1.2, ease: "linear", repeat: hovered ? Infinity : 0 }, scale: { duration: 0.3 }, opacity: { duration: 0.2 } }}
      />
      {/* Pulsing glow */}
      <motion.div
        className="absolute inset-0 rounded-xl gradient-saffron blur-md"
        animate={{ opacity: hovered ? 0.5 : 0, scale: hovered ? 1.3 : 1 }}
        transition={{ duration: 0.3 }}
      />
      {/* Main icon bg */}
      <motion.div
        className="w-10 h-10 rounded-xl gradient-saffron flex items-center justify-center relative z-10"
        animate={{ rotate: hovered ? [0, -8, 8, -4, 4, 0] : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <motion.div
          animate={{ rotate: hovered ? 180 : 0, scale: hovered ? 1.15 : 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Leaf className="w-5 h-5 text-foreground" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
 
// ── Nav item with sliding highlight + icon pop ───────────────────────────────
function NavItem({
  item,
  index,
  isActive,
  onClose,
}: {
  item: (typeof navItems)[0];
  index: number;
  isActive: boolean;
  onClose?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
 
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 300, damping: 28 }}
    >
      <Link
        to={item.path}
        onClick={onClose}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`relative flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors duration-150 group overflow-hidden ${
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        }`}
      >
        {/* Sliding shimmer on hover */}
        <AnimatePresence>
          {hovered && !isActive && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>
 
        {/* Icon with spring bounce */}
        <motion.div
          animate={{
            scale: isActive ? 1.15 : hovered ? 1.1 : 1,
            rotate: hovered && !isActive ? [0, -12, 12, 0] : 0,
          }}
          transition={
            hovered && !isActive
              ? { rotate: { duration: 0.4 }, scale: { type: "spring", stiffness: 400, damping: 20 } }
              : { type: "spring", stiffness: 400, damping: 20 }
          }
        >
          <item.icon className="w-4 h-4" />
        </motion.div>
 
        <span className="truncate">{item.label}</span>
 
        {/* Active dot with ping animation */}
        {isActive && (
          <motion.div className="ml-auto relative" layoutId="nav-indicator">
            <div className="w-1.5 h-1.5 rounded-full bg-saffron" />
            <motion.div
              className="absolute inset-0 rounded-full bg-saffron"
              animate={{ scale: [1, 2.5, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </Link>
    </motion.div>
  );
}
 
// ── Sidebar content ──────────────────────────────────────────────────────────
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
      <motion.div
        className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <AnimatedLogo />
        <div className="flex-1 min-w-0">
          <motion.h1
            className="font-display text-xl font-bold tracking-tight"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            vedaCare
          </motion.h1>
          <motion.p
            className="text-xs opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.3 }}
          >
            Clinic Management
          </motion.p>
        </div>
        {onClose && (
          <motion.button
            onClick={onClose}
            className="ml-auto p-1 rounded-lg hover:bg-sidebar-accent/50 transition-colors"
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </motion.div>
 
      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item, i) => (
          <NavItem
            key={item.path}
            item={item}
            index={i}
            isActive={location.pathname === item.path}
            onClose={onClose}
          />
        ))}
      </nav>
 
      {/* Mobile theme toggle */}
      <div className="px-3 py-3 border-t border-sidebar-border space-y-1 lg:hidden">
        <ThemeToggleButton isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} fullWidth />
      </div>
 
      {/* Footer */}
      <motion.div
        className="px-3 py-4 border-t border-sidebar-border space-y-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[
          { icon: Settings, label: "Settings", to: "/settings" },
        ].map(({ icon: Icon, label, to }) => (
          <Link
            key={label}
            to={to}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 transition-colors group"
          >
            <motion.div whileHover={{ rotate: 90 }} transition={{ type: "spring", stiffness: 300 }}>
              <Icon className="w-4 h-4" />
            </motion.div>
            <span>{label}</span>
          </Link>
        ))}
        <motion.button
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 transition-colors w-full group"
          whileHover={{ x: 4 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <motion.div whileHover={{ rotate: -20 }} transition={{ type: "spring", stiffness: 300 }}>
            <LogOut className="w-4 h-4" />
          </motion.div>
          <span>Sign Out</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
 
// ── Sun/Moon theme toggle with flip animation ────────────────────────────────
function ThemeToggleButton({
  isDarkMode,
  setIsDarkMode,
  fullWidth = false,
}: {
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
  fullWidth?: boolean;
}) {
  return (
    <motion.button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className={`${fullWidth ? "w-full" : ""} flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 transition-colors`}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isDarkMode ? "sun" : "moon"}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.25, type: "spring", stiffness: 300 }}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </motion.div>
      </AnimatePresence>
      <span>Theme</span>
    </motion.button>
  );
}
 
// ── Jiggling bell notification button ───────────────────────────────────────
function BellButton({
  unreadNotifications,
  onClick,
}: {
  unreadNotifications: number;
  onClick: () => void;
}) {
  return (
    <MagneticButton
      onClick={onClick}
      className="relative p-2 rounded-lg hover:bg-muted transition-colors"
    >
      <motion.div
        animate={
          unreadNotifications > 0
            ? { rotate: [0, -18, 18, -12, 12, -6, 6, 0] }
            : {}
        }
        transition={{ duration: 0.7, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
      >
        <Bell className="w-5 h-5 text-muted-foreground" />
      </motion.div>
      <AnimatePresence>
        {unreadNotifications > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 30 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-white text-xs flex items-center justify-center font-semibold"
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            >
              {unreadNotifications}
            </motion.span>
          </motion.span>
        )}
      </AnimatePresence>
    </MagneticButton>
  );
}
 
// ── Notification dropdown item ───────────────────────────────────────────────
function NotificationItem({
  notif,
  index,
}: {
  notif: (typeof notificationsData)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16, filter: "blur(4px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ delay: index * 0.07, type: "spring", stiffness: 300, damping: 24 }}
      whileHover={{ x: 4, backgroundColor: "rgba(0,0,0,0.03)" }}
      className={`px-4 py-3 border-b border-border/50 last:border-0 cursor-pointer transition-colors ${
        notif.priority === "high" ? "bg-destructive/5" : ""
      }`}
    >
      <div className="flex items-start gap-2">
        <motion.div
          className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
            notif.priority === "high"
              ? "bg-destructive"
              : notif.priority === "medium"
              ? "bg-amber-500"
              : "bg-emerald-500"
          }`}
          animate={{ scale: notif.priority === "high" ? [1, 1.4, 1] : 1 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground">{notif.text}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{notif.time}</p>
        </div>
      </div>
    </motion.div>
  );
}
 
// ── Avatar with breathing ring ───────────────────────────────────────────────
function AvatarButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
 
  return (
    <MagneticButton
      onClick={onClick}
      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors group"
    >
      <div
        className="relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Breathing ring */}
        <motion.div
          className="absolute -inset-1 rounded-full border border-primary/30"
          animate={{
            scale: hovered ? [1, 1.15, 1] : [1, 1.08, 1],
            opacity: hovered ? [0.6, 1, 0.6] : [0.3, 0.6, 0.3],
          }}
          transition={{ duration: hovered ? 0.8 : 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="w-8 h-8 rounded-full gradient-sage flex items-center justify-center text-primary-foreground text-sm font-semibold relative z-10"
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          A
        </motion.div>
      </div>
      <motion.div
        animate={{ rotate: hovered ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="hidden sm:block"
      >
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </motion.div>
    </MagneticButton>
  );
}
 
// ── User menu dropdown item ──────────────────────────────────────────────────
function UserMenuItem({
  icon: Icon,
  label,
  onClick,
  danger,
  index,
}: {
  icon: React.ElementType;
  label: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  index: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 400, damping: 28 }}
      whileHover={{ x: 6 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
        danger
          ? "text-destructive hover:bg-destructive/10"
          : "text-foreground hover:bg-muted/50"
      }`}
    >
      <motion.div whileHover={{ rotate: danger ? -10 : 15, scale: 1.1 }}>
        <Icon className={`w-4 h-4 ${danger ? "" : "text-muted-foreground"}`} />
      </motion.div>
      {label}
    </motion.button>
  );
}
 
// ── Main Layout ──────────────────────────────────────────────────────────────
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
 
  const dropdownVariants = {
    hidden: { opacity: 0, y: -8, scale: 0.95, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, y: -8, scale: 0.95, filter: "blur(4px)" },
  };
 
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
 
      {/* ── DESKTOP SIDEBAR ── */}
      <motion.aside
        className="hidden lg:flex lg:flex-col w-64 flex-shrink-0 bg-sidebar text-sidebar-foreground h-full overflow-y-auto border-r border-sidebar-border"
        initial={{ x: -64, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 28, delay: 0.05 }}
      >
        <SidebarContent isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </motion.aside>
 
      {/* ── MOBILE SIDEBAR DRAWER ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
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
 
      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
 
        {/* Top bar */}
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 28, delay: 0.1 }}
          className="flex-shrink-0 h-16 glass-card rounded-none border-x-0 border-t-0 flex items-center px-3 sm:px-4 lg:px-6 gap-2 sm:gap-4 z-30"
        >
          {/* Mobile hamburger */}
          <MagneticButton
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <motion.div
              animate={{ rotate: sidebarOpen ? 90 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Menu className="w-5 h-5 text-foreground" />
            </motion.div>
          </MagneticButton>
 
          {/* Search — tablet+ */}
          <div className="hidden sm:flex flex-1 max-w-sm">
            <div className="flex-1 relative">
              <motion.div
                className="absolute left-3 top-1/2 -translate-y-1/2"
                animate={{ rotate: searchOpen ? 90 : 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Search className="w-4 h-4 text-muted-foreground" />
              </motion.div>
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
 
          {/* Mobile search */}
          <MagneticButton
            className="sm:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <motion.div
              animate={{ rotate: searchOpen ? 90 : 0, scale: searchOpen ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Search className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </MagneticButton>
 
          {/* Notifications */}
          <div className="relative">
            <BellButton
              unreadNotifications={unreadNotifications}
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setUserMenuOpen(false);
              }}
            />
 
            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 360, damping: 28 }}
                  className="absolute right-0 mt-2 w-72 bg-background rounded-xl border border-border shadow-lg z-40"
                >
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <motion.h3
                      className="font-semibold text-sm"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      Notifications
                    </motion.h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setUnreadNotifications(0)}
                      className="text-xs text-primary hover:text-primary/80"
                    >
                      Mark all read
                    </motion.button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notificationsData.map((notif, i) => (
                      <NotificationItem key={notif.id} notif={notif} index={i} />
                    ))}
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link
                      to="/notifications"
                      onClick={() => setNotificationsOpen(false)}
                      className="block p-3 text-center text-xs text-primary hover:text-primary/80 font-medium border-t border-border"
                    >
                      View All Notifications
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
 
          {/* User Menu */}
          <div className="relative">
            <AvatarButton
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setNotificationsOpen(false);
              }}
            />
 
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 360, damping: 28 }}
                  className="absolute right-0 mt-2 w-56 bg-background rounded-xl border border-border shadow-lg z-40"
                >
                  <motion.div
                    className="p-4 border-b border-border"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                  >
                    <p className="text-sm font-semibold text-foreground">Dr. Ananya Sharma</p>
                    <p className="text-xs text-muted-foreground mt-1">Clinic Administrator</p>
                  </motion.div>
                  <div className="p-2 space-y-1">
                    <UserMenuItem icon={User} label="Profile" index={0} />
                    <UserMenuItem icon={Shield} label="Account Security" index={1} />
                    <UserMenuItem
                      icon={isDarkMode ? Sun : Moon}
                      label={isDarkMode ? "Light Mode" : "Dark Mode"}
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      index={2}
                    />
                  </div>
                  <div className="p-2 border-t border-border">
                    <UserMenuItem icon={LogOut} label="Sign Out" danger index={3} />
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
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="sm:hidden bg-background border-b border-border px-4 py-3 flex-shrink-0 overflow-hidden"
            >
              <motion.div
                className="relative"
                initial={{ y: -8 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search patients, appointments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
 
        {/* ── PAGE CONTENT ── */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-3 sm:p-4 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20, scale: 0.98, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, scale: 0.99, filter: "blur(4px)" }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
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