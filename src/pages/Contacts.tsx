import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export default function Contacts() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", role: "" });
  const queryClient = useQueryClient();

  const fetchContacts = async () => {
    if (!supabase) return [];
    const { data, error } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  };

  const { data: contacts = [], isLoading } = useQuery({ queryKey: ["contacts"], queryFn: fetchContacts });

  const createContact = useMutation({
    mutationFn: async (payload: any) => {
      if (!supabase) throw new Error("Supabase not configured");
      const { error } = await supabase.from("contacts").insert([payload]);
      if (error) throw error;
      return payload;
    },
    onSuccess: () => queryClient.invalidateQueries(["contacts"]),
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const payload = { id: crypto.randomUUID(), name: form.name.trim(), email: form.email.trim() || null, phone: form.phone.trim() || null, company: form.company.trim() || null, role: form.role.trim() || null };
    try {
      await createContact.mutateAsync(payload);
      setForm({ name: "", email: "", phone: "", company: "", role: "" });
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Could not create contact: " + String(err));
    }
  };

  return (
    <AppLayout>
      <div className="space-y-4 min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">Contacts</h1>
            <p className="text-muted-foreground text-sm">Client and firm contacts</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="min-h-11 touch-target bg-primary text-primary-foreground">New Contact</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>New contact</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <Label>Company</Label>
                  <Input value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} />
                </div>
                <div>
                  <Label>Role</Label>
                  <Input value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-primary text-primary-foreground">Create</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5}>Loading…</TableCell></TableRow>
              ) : (
                (contacts || []).map((c: any) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.company}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.phone}</TableCell>
                    <TableCell>{c.role}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
