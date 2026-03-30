import { useState, useMemo, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Filter, Search, FileText, Eye, Download, ChevronsUpDown, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMatters } from "@/contexts/MattersContext";
import type { MatterItem, ViewableBy } from "@/contexts/MattersContext";

const UNLINKED_VALUE = "__none__";

interface DocumentItem {
  id: string;
  name: string;
  matter: string;
  type: string;
  date: string;
  size: string;
  viewableBy: ViewableBy[];
}

const initialDocuments: DocumentItem[] = [
  { id: "1", name: "Witness Statement - Kamara.pdf", matter: "Kamara v. National Bank", type: "Statement", date: "Jan 28, 2024", size: "245 KB", viewableBy: ["all"] },
  { id: "2", name: "Settlement Agreement Draft.docx", matter: "TechCorp Employment", type: "Contract", date: "Jan 27, 2024", size: "128 KB", viewableBy: ["partners"] },
  { id: "3", name: "Court Filing - Probate.pdf", matter: "Estate of Mwangi", type: "Filing", date: "Jan 26, 2024", size: "1.2 MB", viewableBy: ["paralegals", "partners"] },
  { id: "4", name: "Land Survey Report.pdf", matter: "Okonkwo Land Dispute", type: "Expert Report", date: "Jan 25, 2024", size: "3.4 MB", viewableBy: ["associates", "counsel"] },
  { id: "5", name: "Trade Agreement Review.docx", matter: "Rwanda Trade Agreement", type: "Advisory", date: "Jan 24, 2024", size: "89 KB", viewableBy: ["all"] },
];

const viewableByLabel = (
  value: ViewableBy,
  options: { value: string; label: string }[]
): string => options.find((o) => o.value === value)?.label ?? value;

const ViewableByBadges = ({
  viewableBy,
  viewableByOptions,
}: {
  viewableBy: ViewableBy[];
  viewableByOptions: { value: string; label: string }[];
}) => {
  const showAll = viewableBy.includes("all");
  const list = showAll ? ["all"] : viewableBy;
  return (
    <span className="inline-flex flex-wrap gap-1">
      {list.map((v) => (
        <Badge key={v} variant="outline" className="text-[10px] px-1.5 py-0 font-normal">
          {viewableByLabel(v as ViewableBy, viewableByOptions)}
        </Badge>
      ))}
    </span>
  );
};

export default function Documents() {
  const { matters, addMatter, VIEWABLE_BY_OPTIONS } = useMatters();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchDocuments = async () => {
    if (!supabase) return [] as any[];
    const { data, error } = await supabase.from("documents").select("*");
    if (error) throw error;
    return data as any[];
  };

  const { data: documents = [], isLoading: docsLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: fetchDocuments,
  });
  const [uploadOpen, setUploadOpen] = useState(false);
  const [matterComboboxOpen, setMatterComboboxOpen] = useState(false);
  const [newMatterFromUploadOpen, setNewMatterFromUploadOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: "",
    matterId: "" as string,
    type: "Statement",
    viewableBy: ["all"] as ViewableBy[],
  });
  const [newMatterForm, setNewMatterForm] = useState({
    name: "",
    client: "",
    assignedTo: "",
    court: "",
    status: "active" as const,
    viewableBy: ["all"] as ViewableBy[],
  });

  const selectedMatter = useMemo(
    () => (uploadForm.matterId ? matters.find((m) => m.id === uploadForm.matterId) : null),
    [uploadForm.matterId, matters]
  );

  const toggleViewableBy = (value: ViewableBy) => {
    setUploadForm((f) => {
      if (value === "all") {
        return { ...f, viewableBy: ["all"] };
      }
      const next = f.viewableBy.includes(value)
        ? f.viewableBy.filter((v) => v !== value)
        : [...f.viewableBy.filter((v) => v !== "all"), value];
      return { ...f, viewableBy: next.length ? next : ["all"] };
    });
  };

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!supabase) throw new Error("Supabase not configured");
      const path = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from("documents").upload(path, file, { upsert: false });
      if (uploadError) throw uploadError;
      const { data: publicData } = supabase.storage.from("documents").getPublicUrl(path);
      const publicUrl = publicData?.publicUrl ?? null;
      // insert metadata
      const payload = {
        id: crypto.randomUUID(),
        name: file.name,
        matter_id: uploadForm.matterId || null,
        file_path: path,
        file_type: file.type,
        size: file.size,
        uploaded_at: new Date().toISOString(),
      };
      const { error } = await supabase.from("documents").insert([payload]);
      if (error) throw error;
      return { publicUrl, payload };
    },
    onSuccess: () => queryClient.invalidateQueries(["documents"]),
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.name.trim()) return;
    const file = fileInputRef.current?.files?.[0];
    if (!file) return alert("Please choose a file");
    try {
      await uploadMutation.mutateAsync(file);
      setUploadForm({ name: "", matterId: "", type: "Statement", viewableBy: ["all"] });
      setUploadOpen(false);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed: " + String(err));
    }
  };

  const toggleNewMatterViewableBy = (value: ViewableBy) => {
    setNewMatterForm((f) => {
      if (value === "all") return { ...f, viewableBy: ["all"] };
      const next = f.viewableBy.includes(value)
        ? f.viewableBy.filter((v) => v !== value)
        : [...f.viewableBy.filter((v) => v !== "all"), value];
      return { ...f, viewableBy: next.length ? next : ["all"] };
    });
  };

  const handleNewMatterFromUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatterForm.name.trim()) return;
    const newMatter: MatterItem = {
      id: crypto.randomUUID(),
      name: newMatterForm.name.trim(),
      client: newMatterForm.client.trim() || "—",
      assignedTo: newMatterForm.assignedTo.trim() || "—",
      court: newMatterForm.court.trim() || "—",
      status: newMatterForm.status,
      viewableBy: newMatterForm.viewableBy,
    };
    addMatter(newMatter);
    setUploadForm((f) => ({ ...f, matterId: newMatter.id }));
    setNewMatterForm({
      name: "",
      client: "",
      assignedTo: "",
      court: "",
      status: "active",
      viewableBy: ["all"],
    });
    setNewMatterFromUploadOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-4 min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold truncate">Documents</h1>
            <p className="text-muted-foreground text-sm">Firm document library</p>
          </div>
          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto min-h-11 touch-target bg-primary text-primary-foreground" aria-label="Upload document">
                <Upload className="w-4 h-4 mr-2" /> Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[calc(100vw-2rem)] max-w-md" aria-describedby="upload-doc-description">
              <DialogHeader>
                <DialogTitle>Upload document</DialogTitle>
              </DialogHeader>
              <p id="upload-doc-description" className="sr-only">
                Enter document details and choose who can view it.
              </p>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doc-name">Document name</Label>
                  <Input
                    id="doc-name"
                    value={uploadForm.name}
                    onChange={(e) => setUploadForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Brief - Smith.pdf"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc-matter">Matter (optional)</Label>
                  <p className="text-xs text-muted-foreground mb-1.5">
                    Search to link an existing matter or create a new one. Choose &quot;Link to none&quot; if not tied to a matter.
                  </p>
                  <Popover open={matterComboboxOpen} onOpenChange={setMatterComboboxOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        id="doc-matter"
                        variant="outline"
                        role="combobox"
                        aria-expanded={matterComboboxOpen}
                        aria-label="Select or create matter"
                        className="w-full justify-between font-normal"
                      >
                        <span className="truncate">
                          {selectedMatter ? selectedMatter.name : "Link to none"}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search matters..." />
                        <CommandList>
                          <CommandEmpty>No matter found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value={UNLINKED_VALUE}
                              onSelect={() => {
                                setUploadForm((f) => ({ ...f, matterId: "" }));
                                setMatterComboboxOpen(false);
                              }}
                            >
                              Link to none
                            </CommandItem>
                            {matters.map((m) => (
                              <CommandItem
                                key={m.id}
                                value={m.name}
                                onSelect={() => {
                                  setUploadForm((f) => ({ ...f, matterId: m.id }));
                                  setMatterComboboxOpen(false);
                                }}
                              >
                                {m.name}
                              </CommandItem>
                            ))}
                            <CommandItem
                              value="__create__"
                              onSelect={() => {
                                setMatterComboboxOpen(false);
                                setNewMatterFromUploadOpen(true);
                              }}
                              className="text-primary"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Create new matter…
                            </CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc-file">File</Label>
                  <input id="doc-file" ref={fileInputRef} type="file" className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc-type">Type</Label>
                  <Select
                    value={uploadForm.type}
                    onValueChange={(v) => setUploadForm((f) => ({ ...f, type: v }))}
                  >
                    <SelectTrigger id="doc-type" className="min-h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Statement">Statement</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Filing">Filing</SelectItem>
                      <SelectItem value="Expert Report">Expert Report</SelectItem>
                      <SelectItem value="Advisory">Advisory</SelectItem>
                      <SelectItem value="Pleading">Pleading</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Viewable by</Label>
                  <p className="text-xs text-muted-foreground mb-1.5">
                    Select one or more roles that can view this document.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2.5 rounded-md border border-border bg-muted/30 p-3">
                    {VIEWABLE_BY_OPTIONS.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center gap-2 cursor-pointer text-sm min-w-0"
                      >
                        <Checkbox
                          checked={
                            opt.value === "all"
                              ? uploadForm.viewableBy.includes("all")
                              : uploadForm.viewableBy.includes(opt.value)
                          }
                          onCheckedChange={() => toggleViewableBy(opt.value)}
                          aria-label={opt.label}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                  <Button type="button" variant="outline" className="min-h-11 touch-target w-full sm:w-auto" onClick={() => setUploadOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="min-h-11 touch-target w-full sm:w-auto bg-primary text-primary-foreground">
                    Upload
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={newMatterFromUploadOpen} onOpenChange={setNewMatterFromUploadOpen}>
            <DialogContent className="w-[calc(100vw-2rem)] max-w-md" aria-describedby="new-matter-from-upload-description">
              <DialogHeader>
                <DialogTitle>New matter</DialogTitle>
              </DialogHeader>
              <p id="new-matter-from-upload-description" className="sr-only">
                Create a matter and link it to this document.
              </p>
              <form onSubmit={handleNewMatterFromUpload} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-matter-name">Matter name</Label>
                  <Input
                    id="new-matter-name"
                    className="min-h-11"
                    value={newMatterForm.name}
                    onChange={(e) => setNewMatterForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Smith v. Acme Ltd"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-matter-client">Client</Label>
                  <Input
                    id="new-matter-client"
                    className="min-h-11"
                    value={newMatterForm.client}
                    onChange={(e) => setNewMatterForm((f) => ({ ...f, client: e.target.value }))}
                    placeholder="Client name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-matter-assigned">Assigned to</Label>
                  <Input
                    id="new-matter-assigned"
                    className="min-h-11"
                    value={newMatterForm.assignedTo}
                    onChange={(e) => setNewMatterForm((f) => ({ ...f, assignedTo: e.target.value }))}
                    placeholder="e.g. Rowan Hongo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-matter-court">Court</Label>
                  <Input
                    id="new-matter-court"
                    className="min-h-11"
                    value={newMatterForm.court}
                    onChange={(e) => setNewMatterForm((f) => ({ ...f, court: e.target.value }))}
                    placeholder="e.g. High Court"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-matter-status">Status</Label>
                  <Select
                    value={newMatterForm.status}
                    onValueChange={(v: "active" | "pending" | "closed") =>
                      setNewMatterForm((f) => ({ ...f, status: v }))
                    }
                  >
                    <SelectTrigger id="new-matter-status" className="min-h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Viewable by</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2.5 rounded-md border border-border bg-muted/30 p-3">
                    {VIEWABLE_BY_OPTIONS.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center gap-2 cursor-pointer text-sm min-w-0"
                      >
                        <Checkbox
                          checked={
                            opt.value === "all"
                              ? newMatterForm.viewableBy.includes("all")
                              : newMatterForm.viewableBy.includes(opt.value)
                          }
                          onCheckedChange={() => toggleNewMatterViewableBy(opt.value)}
                          aria-label={opt.label}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    className="min-h-11 touch-target w-full sm:w-auto"
                    onClick={() => setNewMatterFromUploadOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="min-h-11 touch-target w-full sm:w-auto bg-primary text-primary-foreground">
                    Create matter
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 w-full min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search documents..." className="pl-9 min-h-11 w-full" />
          </div>
          <Button variant="outline" size="sm" className="min-h-11 touch-target w-full sm:w-auto">
            <Filter className="w-4 h-4 mr-2" /> Filters
          </Button>
        </div>

        <div className="grid gap-3 grid-cols-1">
          {docsLoading ? (
            <div>Loading…</div>
          ) : (
            documents.map((doc: any) => (
              <div
                key={doc.id}
                className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3 
                           hover:border-primary/30 transition-colors cursor-pointer min-w-0"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0 order-first">
                  <h3 className="font-medium truncate">{doc.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{doc.matter_id ?? "—"}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  <Badge variant="secondary" className="text-xs shrink-0">{doc.file_type}</Badge>
                  <span className="text-sm text-muted-foreground">{Math.round((doc.size ?? 0) / 1024)} KB</span>
                  <span className="text-sm text-muted-foreground">{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8"
                    aria-label="Open"
                    onClick={() => {
                      if (!supabase) return;
                      const { data } = supabase.storage.from("documents").getPublicUrl(doc.file_path);
                      const url = data?.publicUrl;
                      if (url) window.open(url, "_blank");
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8"
                    aria-label="Download"
                    onClick={async () => {
                      if (!supabase) return;
                      const { data } = supabase.storage.from("documents").getPublicUrl(doc.file_path);
                      const url = data?.publicUrl;
                      if (url) window.open(url, "_blank");
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
