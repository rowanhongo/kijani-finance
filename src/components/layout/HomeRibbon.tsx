import { NavLink } from "react-router-dom";

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
    <div className="bg-ribbon border-b border-border px-4 py-2">
      <nav className="flex items-center gap-1">
        {ribbonTabs.map((tab) => (
          <button
            key={tab.path}
            onClick={() => onTabChange(tab.path)}
            className={`ribbon-tab ${activeTab === tab.path ? "ribbon-tab-active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}