// Ribbon tabs for Home context
const ribbonTabs = [
  { label: "My Cases", path: "/" },
  { label: "Messages", path: "/messages" },
  { label: "Reports", path: "/reports" },
  { label: "Contacts", path: "/contacts" },
  { label: "My Sources", path: "/sources" },
];

interface HomeRibbonProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function HomeRibbon({ activeTab, onTabChange }: HomeRibbonProps) {
  return (
    <div className="flex flex-col">
      {/* Gray banner area */}
      <div className="h-20 bg-muted/60" />
      
      {/* Tab navigation - centered underlined links */}
      <div className="border-b border-border bg-background">
        <nav className="flex items-center justify-center gap-8 py-2">
          {ribbonTabs.map((tab) => (
            <button
              key={tab.path}
              onClick={() => onTabChange(tab.path)}
              className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
                activeTab === tab.path 
                  ? "text-primary border-primary" 
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