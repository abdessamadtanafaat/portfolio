import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import { ToastProvider } from "@/components/ui/Toast";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar />
        <main className="lg:ml-64 min-h-screen">
          <div className="mx-auto max-w-5xl px-5 py-8 lg:px-8 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
