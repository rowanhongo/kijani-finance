import { FileText } from "lucide-react";

const ribbonTabs = [
  { label: "My Cases", path: "/", count: 6 },
  { label: "Messages", path: "/messages", count: 3 },
  { label: "Reports", path: "/reports", count: 16 },
  { label: "Contacts", path: "/contacts", count: 5 },
  { label: "My Sources", path: "/sources", count: 4 },
];

interface HomeRibbonProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const formatBannerDate = () => {
  const d = new Date();
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export function HomeRibbon({ activeTab, onTabChange }: HomeRibbonProps) {
  const active = ribbonTabs.find((t) => t.path === activeTab) ?? ribbonTabs[0];
  const title = active.label;
  const count = active.count;

  return (
    <div className="flex flex-col">
      {/* Banner - layered wavy green, title + count, date */}
      <div className="relative mx-6 mt-0 mb-0 overflow-hidden rounded-b-2xl min-h-[100px] flex flex-col justify-end">
        {/* Layered gradient - pale mint to teal */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(165deg, #e8f6f4 0%, #d8efe9 25%, #b8e4dc 50%, #9ad4c9 75%, #82bfb6 100%)
            `,
          }}
        />
        {/* Soft wave layers for depth */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: `
              radial-gradient(ellipse 120% 80% at 50% -20%, rgba(255,255,255,0.4) 0%, transparent 50%),
              radial-gradient(ellipse 80% 60% at 80% 100%, rgba(130,191,182,0.3) 0%, transparent 50%)
            `,
          }}
        />
        <div className="relative px-5 py-4 flex flex-col justify-end">
          <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-gray-700 mb-0.5">
            <FileText className="w-3.5 h-3.5 shrink-0" aria-hidden />
            <span>Home / Overview</span>
            <span className="text-muted-foreground/80 dark:text-gray-600">·</span>
            <time dateTime={new Date().toISOString().slice(0, 10)}>
              {formatBannerDate()}
            </time>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-xl font-bold text-foreground dark:text-gray-900 tracking-tight">
              {title}
            </h2>
            <span className="text-lg font-normal text-muted-foreground dark:text-gray-700">
              {count}
            </span>
          </div>
        </div>
      </div>

      {/* Tab navigation - centered underlined links */}
      <div className="border-b border-border bg-background">
        <nav
          className="flex items-center justify-center gap-8 py-2.5"
          aria-label="Home tabs"
        >
          {ribbonTabs.map((tab) => (
            <button
              key={tab.path}
              type="button"
              onClick={() => onTabChange(tab.path)}
              className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
                activeTab === tab.path
                  ? "text-[#006F6F] dark:text-teal-400 border-[#006F6F] dark:border-teal-400"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
