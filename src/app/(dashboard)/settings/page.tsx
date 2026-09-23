import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { auth } from "@/auth";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const ROLE_PERMISSIONS: Record<"admin" | "faculty", string[]> = {
  admin: [
    "Manage students (create, edit, delete)",
    "Manage subjects (create, edit, delete)",
    "Manage marks (create, edit, delete)",
    "View analytics dashboards and reports",
  ],
  faculty: [
    "Enter and update marks",
    "View students and subjects",
    "View analytics dashboards and reports",
    "Analyze performance trends",
  ],
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { user } = session;
  const permissions = ROLE_PERMISSIONS[user.role];

  return (
    <div>
      <PageHeader title="Settings" description="Manage your account and view your role permissions." />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
            <CardDescription>Your account information.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                {getInitials(user.name ?? "User")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-base font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge variant="secondary" className="mt-2 capitalize">
                {user.role}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Role Permissions</CardTitle>
            <CardDescription className="capitalize">{user.role} access</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {permissions.map((permission) => (
                <li key={permission} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="size-4 text-success mt-0.5 shrink-0" />
                  {permission}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">About InsightEDU</CardTitle>
          <CardDescription>Turn Student Data Into Actionable Insights</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          InsightEDU is an academic analytics platform where MongoDB&apos;s Aggregation Framework powers every
          dashboard, ranking, and report — not client-side calculations.
        </CardContent>
      </Card>
    </div>
  );
}
