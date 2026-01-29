import { useState } from "react";
import { Search, User, Building2, Gavel, Plus, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Contact {
  id: string;
  name: string;
  type: string;
  org: string;
  email?: string;
  relationship?: string;
  phone?: string;
  otherNumber?: string;
}

const initialContacts: Contact[] = [
  { id: "1", name: "John Kamara", type: "client", org: "Individual", email: "john.kamara@email.com" },
  { id: "2", name: "TechCorp Ltd", type: "client", org: "Corporate", email: "legal@techcorp.ke" },
  { id: "3", name: "Wanjiku Mwangi", type: "client", org: "Individual", email: "w.mwangi@email.com" },
  { id: "4", name: "Adv. James Ndegwa", type: "counsel", org: "Ndegwa & Associates", email: "jndegwa@law.ke" },
  { id: "5", name: "High Court Registry", type: "court", org: "Judiciary", email: "registry@judiciary.go.ke" },
];

const emptyForm = {
  name: "",
  relationship: "",
  phone: "",
  email: "",
  otherNumber: "",
};

export function ContactsView() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [searchQuery, setSearchQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [form, setForm] = useState(emptyForm);

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const newContact: Contact = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      type: "client",
      org: form.relationship.trim() || "—",
      relationship: form.relationship.trim() || undefined,
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      otherNumber: form.otherNumber.trim() || undefined,
    };
    setContacts((prev) => [newContact, ...prev]);
    setForm(emptyForm);
    setAddOpen(false);
  };

  const openEdit = (contact: Contact) => {
    setEditContact(contact);
    setForm({
      name: contact.name,
      relationship: contact.relationship ?? contact.org ?? "",
      phone: contact.phone ?? "",
      email: contact.email ?? "",
      otherNumber: contact.otherNumber ?? "",
    });
  };

  const handleEditContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContact || !form.name.trim()) return;
    setContacts((prev) =>
      prev.map((c) =>
        c.id === editContact.id
          ? {
              ...c,
              name: form.name.trim(),
              org: form.relationship.trim() || c.org,
              relationship: form.relationship.trim() || undefined,
              email: form.email.trim() || undefined,
              phone: form.phone.trim() || undefined,
              otherNumber: form.otherNumber.trim() || undefined,
            }
          : c
      )
    );
    setEditContact(null);
    setForm(emptyForm);
  };

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Contacts</h2>
          <p className="text-muted-foreground text-sm">
            Clients, opposing counsel, courts, and external contacts
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground" aria-label="Add contact">
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md" aria-describedby="add-contact-description">
            <DialogHeader>
              <DialogTitle>Add Contact</DialogTitle>
            </DialogHeader>
            <p id="add-contact-description" className="sr-only">
              Fill in contact details. Name is required.
            </p>
            <form onSubmit={handleAddContact} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Name</Label>
                <Input
                  id="add-name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-relationship">Relationship</Label>
                <Input
                  id="add-relationship"
                  value={form.relationship}
                  onChange={(e) => setForm((f) => ({ ...f, relationship: e.target.value }))}
                  placeholder="e.g. Client, Opposing counsel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-phone">Phone number</Label>
                <Input
                  id="add-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="If available"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-email">Email</Label>
                <Input
                  id="add-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="If available"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-other">Other number</Label>
                <Input
                  id="add-other"
                  type="tel"
                  value={form.otherNumber}
                  onChange={(e) => setForm((f) => ({ ...f, otherNumber: e.target.value }))}
                  placeholder="If available"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground">
                  Add Contact
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search contacts..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-card border border-border rounded-lg divide-y divide-border">
        {filtered.map((contact) => (
          <div
            key={contact.id}
            className="p-4 flex items-center gap-4 hover:bg-muted/50 group"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                           ${contact.type === "client" ? "bg-primary/10 text-primary" : ""}
                           ${contact.type === "counsel" ? "bg-secondary text-secondary-foreground" : ""}
                           ${contact.type === "court" ? "bg-warning/10 text-warning" : ""}`}
            >
              {contact.type === "client" && <User className="w-5 h-5" />}
              {contact.type === "counsel" && <Building2 className="w-5 h-5" />}
              {contact.type === "court" && <Gavel className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0 cursor-pointer">
              <p className="font-medium">{contact.name}</p>
              <p className="text-sm text-muted-foreground">
                {contact.relationship ?? contact.org}
              </p>
              {(contact.phone ?? contact.email ?? contact.otherNumber) && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {[contact.phone, contact.email, contact.otherNumber].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 shrink-0 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 focus:opacity-100"
              onClick={() => openEdit(contact)}
              aria-label={`Edit ${contact.name}`}
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Edit contact dialog */}
      <Dialog open={!!editContact} onOpenChange={(open) => !open && setEditContact(null)}>
        <DialogContent className="sm:max-w-md" aria-describedby="edit-contact-description">
          <DialogHeader>
            <DialogTitle>Edit contact</DialogTitle>
          </DialogHeader>
          <p id="edit-contact-description" className="sr-only">
            Update contact details.
          </p>
          {editContact && (
            <form onSubmit={handleEditContact} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-relationship">Relationship</Label>
                <Input
                  id="edit-relationship"
                  value={form.relationship}
                  onChange={(e) => setForm((f) => ({ ...f, relationship: e.target.value }))}
                  placeholder="e.g. Client, Opposing counsel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone number</Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="If available"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="If available"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-other">Other number</Label>
                <Input
                  id="edit-other"
                  type="tel"
                  value={form.otherNumber}
                  onChange={(e) => setForm((f) => ({ ...f, otherNumber: e.target.value }))}
                  placeholder="If available"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setEditContact(null)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground">
                  Save changes
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
