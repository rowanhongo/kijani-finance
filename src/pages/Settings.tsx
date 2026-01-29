import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Users, Building2, Shield, FileText, Globe } from "lucide-react";

const settingsSections = [
  { id: "users", name: "Users & Roles", description: "Manage team members and permissions", icon: Users },
  { id: "firm", name: "Firm Profile", description: "Update firm details and branding", icon: Building2 },
  { id: "permissions", name: "Permissions", description: "Configure role-based access", icon: Shield },
  { id: "templates", name: "Invoice Templates", description: "Customize billing documents", icon: FileText },
  { id: "jurisdiction", name: "Jurisdiction Settings", description: "Court and jurisdiction preferences", icon: Globe },
];

export default function Settings() {
  return (
    <AppLayout>
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-muted-foreground text-sm">Firm configuration and preferences</p>
        </div>

        {/* Settings Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {settingsSections.map((section) => (
            <div
              key={section.id}
              className="bg-card border border-border rounded-lg p-5 hover:border-primary/30 
                         transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{section.name}</h3>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}