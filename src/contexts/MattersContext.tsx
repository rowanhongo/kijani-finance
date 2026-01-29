import { createContext, useCallback, useContext, useState } from "react";

const VIEWABLE_BY_OPTIONS = [
  { value: "all", label: "All" },
  { value: "paralegals", label: "Paralegals" },
  { value: "partners", label: "Partners" },
  { value: "associates", label: "Associates" },
  { value: "counsel", label: "Counsel" },
  { value: "legal-assistants", label: "Legal Assistants" },
  { value: "admin", label: "Admin" },
] as const;

export type ViewableBy = (typeof VIEWABLE_BY_OPTIONS)[number]["value"];

export interface MatterItem {
  id: string;
  name: string;
  client: string;
  assignedTo: string;
  status: string;
  court: string;
  viewableBy: ViewableBy[];
}

const initialMatters: MatterItem[] = [
  { id: "1", name: "Kamara v. National Bank", client: "John Kamara", assignedTo: "Rowan Hongo", status: "active", court: "High Court", viewableBy: ["all"] },
  { id: "2", name: "TechCorp Employment Dispute", client: "TechCorp Ltd", assignedTo: "Sarah Kimani", status: "active", court: "Industrial Court", viewableBy: ["partners"] },
  { id: "3", name: "Estate of Mwangi", client: "Wanjiku Mwangi", assignedTo: "Rowan Hongo", status: "pending", court: "High Court", viewableBy: ["paralegals", "partners"] },
  { id: "4", name: "Okonkwo Land Dispute", client: "Chidi Okonkwo", assignedTo: "David Ochieng", status: "active", court: "ELC", viewableBy: ["associates", "counsel"] },
  { id: "5", name: "Abebe Construction", client: "Abebe Construction", assignedTo: "Sarah Kimani", status: "closed", court: "Commercial", viewableBy: ["all"] },
];

interface MattersContextValue {
  matters: MatterItem[];
  addMatter: (matter: MatterItem) => void;
  VIEWABLE_BY_OPTIONS: typeof VIEWABLE_BY_OPTIONS;
}

const MattersContext = createContext<MattersContextValue | null>(null);

export const MattersProvider = ({ children }: { children: React.ReactNode }) => {
  const [matters, setMatters] = useState<MatterItem[]>(initialMatters);

  const addMatter = useCallback((matter: MatterItem) => {
    setMatters((prev) => [matter, ...prev]);
  }, []);

  return (
    <MattersContext.Provider value={{ matters, addMatter, VIEWABLE_BY_OPTIONS }}>
      {children}
    </MattersContext.Provider>
  );
};

export const useMatters = (): MattersContextValue => {
  const ctx = useContext(MattersContext);
  if (!ctx) throw new Error("useMatters must be used within MattersProvider");
  return ctx;
};
