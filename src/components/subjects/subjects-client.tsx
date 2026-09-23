"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { BookOpen, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
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
import { PaginationControl } from "@/components/shared/pagination-control";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { SubjectFormDialog } from "@/components/subjects/subject-form-dialog";
import { deleteSubjectAction } from "@/actions/subjects";
import type { PaginatedResult, SubjectDTO } from "@/types";

interface SubjectsClientProps {
  result: PaginatedResult<SubjectDTO>;
  search: string;
  isAdmin: boolean;
}

export function SubjectsClient({ result, search, isAdmin }: SubjectsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [formOpen, setFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectDTO | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<SubjectDTO | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
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
    if (!deletingSubject) return;
    startDeleteTransition(async () => {
      const res = await deleteSubjectAction(deletingSubject.id);
      if (!res.success) {
        toast.error(res.error);
        return;
      }
      toast.success("Record Deleted Successfully");
      setDeletingSubject(null);
    });
  }

  const isEmpty = result.data.length === 0 && !search;

  return (
    <div>
      <PageHeader
        title="Subjects"
        description="Manage the subjects offered across departments."
        action={
          isAdmin ? (
            <Button
              onClick={() => {
                setEditingSubject(null);
                setFormOpen(true);
              }}
            >
              <Plus className="size-4" />
              Add Subject
            </Button>
          ) : null
        }
      />

      {isEmpty ? (
        <EmptyState
          icon={BookOpen}
          title="No Subjects Found"
          description="Get started by adding your first subject."
          action={
            isAdmin ? (
              <Button
                onClick={() => {
                  setEditingSubject(null);
                  setFormOpen(true);
                }}
              >
                <Plus className="size-4" />
                Add Your First Subject
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
              placeholder="Search by name or code..."
              className="w-full sm:max-w-xs"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject Code</TableHead>
                <TableHead>Subject Name</TableHead>
                <TableHead>Credits</TableHead>
                {isAdmin ? <TableHead className="text-right">Actions</TableHead> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 4 : 3} className="h-32 text-center text-muted-foreground">
                    No subjects match your search.
                  </TableCell>
                </TableRow>
              ) : (
                result.data.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">{subject.subjectCode}</TableCell>
                    <TableCell>{subject.subjectName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{subject.credits} credits</Badge>
                    </TableCell>
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
                                setEditingSubject(subject);
                                setFormOpen(true);
                              }}
                            >
                              <Pencil className="size-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onSelect={() => setDeletingSubject(subject)}
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

      <SubjectFormDialog open={formOpen} onOpenChange={setFormOpen} subject={editingSubject} />

      <ConfirmDialog
        open={Boolean(deletingSubject)}
        onOpenChange={(open) => !open && setDeletingSubject(null)}
        title="Are you sure?"
        description="This action cannot be undone."
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
