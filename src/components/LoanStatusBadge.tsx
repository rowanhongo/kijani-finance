const styles: Record<string, string> = {
  active: "status-badge status-active",
  overdue: "status-badge status-pending",
  repaid: "status-badge status-closed",
};

export const LoanStatusBadge = ({ status }: { status: string }) => (
  <span className={styles[status] ?? "status-badge"}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
);
