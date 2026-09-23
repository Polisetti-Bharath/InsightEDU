"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Plus, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchInput } from "@/components/shared/search-input";
import { DepartmentSelect } from "@/components/shared/department-select";
import { PaginationControl } from "@/components/shared/pagination-control";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StudentFormDialog } from "@/components/students/student-form-dialog";
import { deleteStudentAction } from "@/actions/students";
import type { PaginatedResult, StudentDTO } from "@/types";

interface StudentsClientProps {
  result: PaginatedResult<StudentDTO>;
  search: string;
  department: string;
  isAdmin: boolean;
}

export function StudentsClient({ result, search, department, isAdmin }: StudentsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentDTO | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<StudentDTO | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    if (!("page" in updates)) {
      params.delete("page");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleDelete() {
    if (!deletingStudent) return;
    startDeleteTransition(async () => {
      const res = await deleteStudentAction(deletingStudent.id);
      if (!res.success) {
        toast.error(res.error);
        return;
      }
      toast.success("Record Deleted Successfully");
      setDeletingStudent(null);
    });
  }

  const isEmpty = result.data.length === 0 && !search && department === "all";

  return (
    <div>
      <PageHeader
        title="Students"
        description="Manage student records across all departments."
        action={
          isAdmin ? (
            <Button
              onClick={() => {
                setEditingStudent(null);
                setFormOpen(true);
              }}
            >
              <Plus className="size-4" />
              Add Student
            </Button>
          ) : null
        }
      />

      {isEmpty ? (
        <EmptyState
          icon={Users}
          title="No Students Found"
          description="Get started by adding your first student."
          action={
            isAdmin ? (
              <Button
                onClick={() => {
                  setEditingStudent(null);
                  setFormOpen(true);
                }}
              >
                <Plus className="size-4" />
                Add Your First Student
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <SearchInput
              value={search}
              onChange={(value) => updateParams({ search: value })}
              placeholder="Search by name, ID, or email..."
              className="w-full sm:max-w-xs"
            />
            <DepartmentSelect
              value={department}
              onChange={(value) => updateParams({ department: value })}
              className="w-full sm:w-48"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Semester</TableHead>
                {isAdmin ? <TableHead className="text-right">Actions</TableHead> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 6 : 5} className="h-32 text-center text-muted-foreground">
                    No students match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                result.data.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.studentId}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell className="text-muted-foreground">{student.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{student.department}</Badge>
                    </TableCell>
                    <TableCell>{student.semester}</TableCell>
                    {isAdmin ? (
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onSelect={() => {
                                setEditingStudent(student);
                                setFormOpen(true);
                              }}
                            >
                              <Pencil className="size-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onSelect={() => setDeletingStudent(student)}
                            >
                              <Trash2 className="size-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <PaginationControl
            page={result.page}
            totalPages={result.totalPages}
            total={result.total}
            pageSize={result.pageSize}
            onPageChange={(page) => updateParams({ page: String(page) })}
          />
        </div>
      )}

      <StudentFormDialog open={formOpen} onOpenChange={setFormOpen} student={editingStudent} />

      <ConfirmDialog
        open={Boolean(deletingStudent)}
        onOpenChange={(open) => !open && setDeletingStudent(null)}
        title="Are you sure?"
        description="This action cannot be undone."
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
