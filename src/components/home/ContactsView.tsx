import { Search, User, Building2, Gavel } from "lucide-react";
import { Input } from "@/components/ui/input";

const mockContacts = [
  { id: "1", name: "John Kamara", type: "client", org: "Individual", email: "john.kamara@email.com" },
  { id: "2", name: "TechCorp Ltd", type: "client", org: "Corporate", email: "legal@techcorp.ke" },
  { id: "3", name: "Wanjiku Mwangi", type: "client", org: "Individual", email: "w.mwangi@email.com" },
  { id: "4", name: "Adv. James Ndegwa", type: "counsel", org: "Ndegwa & Associates", email: "jndegwa@law.ke" },
  { id: "5", name: "High Court Registry", type: "court", org: "Judiciary", email: "registry@judiciary.go.ke" },
];

export function ContactsView() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Contacts</h2>
          <p className="text-muted-foreground text-sm">
            Clients, opposing counsel, courts, and external contacts
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search contacts..." className="pl-9" />
      </div>

      {/* Contacts list */}
      <div className="bg-card border border-border rounded-lg divide-y divide-border">
        {mockContacts.map((contact) => (
          <div key={contact.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 cursor-pointer">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center
                           ${contact.type === "client" ? "bg-primary/10 text-primary" : ""}
                           ${contact.type === "counsel" ? "bg-secondary text-secondary-foreground" : ""}
                           ${contact.type === "court" ? "bg-warning/10 text-warning" : ""}`}>
              {contact.type === "client" && <User className="w-5 h-5" />}
              {contact.type === "counsel" && <Building2 className="w-5 h-5" />}
              {contact.type === "court" && <Gavel className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <p className="font-medium">{contact.name}</p>
              <p className="text-sm text-muted-foreground">{contact.org}</p>
            </div>
            <p className="text-sm text-muted-foreground">{contact.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}