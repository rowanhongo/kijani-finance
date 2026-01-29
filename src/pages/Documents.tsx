import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Filter, Search, FileText, Eye, Download } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock documents
const mockDocuments = [
  { id: "1", name: "Witness Statement - Kamara.pdf", matter: "Kamara v. National Bank", type: "Statement", date: "Jan 28, 2024", size: "245 KB" },
  { id: "2", name: "Settlement Agreement Draft.docx", matter: "TechCorp Employment", type: "Contract", date: "Jan 27, 2024", size: "128 KB" },
  { id: "3", name: "Court Filing - Probate.pdf", matter: "Estate of Mwangi", type: "Filing", date: "Jan 26, 2024", size: "1.2 MB" },
  { id: "4", name: "Land Survey Report.pdf", matter: "Okonkwo Land Dispute", type: "Expert Report", date: "Jan 25, 2024", size: "3.4 MB" },
  { id: "5", name: "Trade Agreement Review.docx", matter: "Rwanda Trade Agreement", type: "Advisory", date: "Jan 24, 2024", size: "89 KB" },
];

export default function Documents() {
  return (
    <AppLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Documents</h1>
            <p className="text-muted-foreground text-sm">Firm document library</p>
          </div>
          <Button className="bg-primary text-primary-foreground">
            <Upload className="w-4 h-4 mr-2" /> Upload
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search documents..." className="pl-9" />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" /> Filters
          </Button>
        </div>

        {/* Documents Grid */}
        <div className="grid gap-3">
          {mockDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-card border border-border rounded-lg p-4 flex items-center gap-4 
                         hover:border-primary/30 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{doc.name}</h3>
                <p className="text-sm text-muted-foreground">{doc.matter}</p>
              </div>
              <Badge variant="secondary" className="text-xs">{doc.type}</Badge>
              <span className="text-sm text-muted-foreground">{doc.size}</span>
              <span className="text-sm text-muted-foreground">{doc.date}</span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}