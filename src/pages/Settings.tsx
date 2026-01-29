import { AppLayout } from "@/components/layout/AppLayout";
import { Label } from "@/components/ui/label";
import { Sun, Moon, Monitor, Bell, LayoutGrid } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type ThemeValue = "light" | "dark" | "system";

const themeOptions: { value: ThemeValue; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const currentTheme = (theme ?? "system") as ThemeValue;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Your personal preferences. Firm-wide settings are in the Admin Dashboard (coming later).
          </p>
        </div>

        {/* Theme - like VSCode */}
        <section className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sun className="w-5 h-5 text-primary" aria-hidden />
            <h2 className="font-semibold">Theme</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Choose how SHERIA looks. Light, Dark, or match your system.
          </p>
          {mounted && (
            <div className="flex flex-wrap gap-2">
              {themeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTheme(opt.value)}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors",
                    currentTheme === opt.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:bg-muted/50 hover:border-muted-foreground/30"
                  )}
                  aria-pressed={currentTheme === opt.value}
                  aria-label={`Theme: ${opt.label}`}
                >
                  <opt.icon className="w-4 h-4 shrink-0" />
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Notifications */}
        <section className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-primary" aria-hidden />
            <h2 className="font-semibold">Notifications</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Control how you receive alerts and reminders.
          </p>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-border" />
              <span className="text-sm">Email notifications for new messages</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-border" />
              <span className="text-sm">Remind me about upcoming deadlines</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="rounded border-border" />
              <span className="text-sm">Desktop notifications</span>
            </label>
          </div>
        </section>

        {/* Display / density */}
        <section className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <LayoutGrid className="w-5 h-5 text-primary" aria-hidden />
            <h2 className="font-semibold">Display</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Adjust list density and layout to your preference.
          </p>
          <div className="space-y-2">
            <Label className="text-sm">List density</Label>
            <select
              defaultValue="comfortable"
              className="w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              aria-label="List density"
            >
              <option value="compact">Compact</option>
              <option value="comfortable">Comfortable</option>
              <option value="spacious">Spacious</option>
            </select>
          </div>
        </section>

        <p className="text-xs text-muted-foreground pt-2">
          Firm-wide settings (users, roles, firm profile, billing, jurisdiction) will be available in the Admin Dashboard.
        </p>
      </div>
    </AppLayout>
  );
}
