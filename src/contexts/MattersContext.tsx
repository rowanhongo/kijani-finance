import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

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

interface MattersContextValue {
  matters: MatterItem[];
  addMatter: (matter: MatterItem) => void;
  VIEWABLE_BY_OPTIONS: typeof VIEWABLE_BY_OPTIONS;
}

const MattersContext = createContext<MattersContextValue | null>(null);

export const MattersProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const fetchMatters = async () => {
    if (!supabase) return [] as MatterItem[];
    const { data, error } = await supabase.from("matters").select("*");
    if (error) throw error;
    return (data as any[])?.map((r) => ({
      id: r.id,
      name: r.name,
      client: r.client,
      assignedTo: r.assigned_to ?? r.assignedTo ?? "—",
      status: r.status,
      court: r.court,
      viewableBy: r.viewable_by ?? r.viewableBy ?? ["all"],
    }));
  };

  const mattersQuery = useQuery<MatterItem[]>({
    queryKey: ["matters"],
    queryFn: fetchMatters,
    staleTime: 1000 * 60,
  });

  const addMatterMutation = useMutation({
    mutationFn: async (matter: MatterItem) => {
      if (!supabase) throw new Error("Supabase not configured");
      const payload = {
        id: matter.id,
        name: matter.name,
        client: matter.client,
        assigned_to: matter.assignedTo,
        status: matter.status,
        court: matter.court,
        viewable_by: matter.viewableBy,
      };
      const { error } = await supabase.from("matters").insert([payload]);
      if (error) throw error;
      return matter;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["matters"]);
    },
  });

  const matters = mattersQuery.data ?? [];

  const addMatter = (m: MatterItem) => addMatterMutation.mutate(m);

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
