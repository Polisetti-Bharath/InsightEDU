"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ClipboardList, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchInput } from "@/components/shared/search-input";
import { DepartmentSelect } from "@/components/shared/department-select";
import { PaginationControl } from "@/components/shared/pagination-control";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { MarksFormDialog } from "@/components/marks/marks-form-dialog";
import { deleteMarksAction } from "@/actions/marks";
import type { MarksDTO, PaginatedResult, StudentDTO, SubjectDTO } from "@/types";

interface MarksClientProps {
  result: PaginatedResult<MarksDTO>;
  search: string;
  department: string;
  subjectId: string;
  students: StudentDTO[];
  subjects: SubjectDTO[];
}

export function MarksClient({ result, search, department, subjectId, students, subjects }: MarksClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [formOpen, setFormOpen] = useState(false);
  const [editingMarks, setEditingMarks] = useState<MarksDTO | null>(null);
  const [deletingMarks, setDeletingMarks] = useState<MarksDTO | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all") {
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
    if (!deletingMarks) return;
    startDeleteTransition(async () => {
      const res = await deleteMarksAction(deletingMarks.id);
      if (!res.success) {
        toast.error(res.error);
        return;
      }
      toast.success("Record Deleted Successfully");
      setDeletingMarks(null);
    });
  }

  const isEmpty = result.data.length === 0 && !search && department === "all" && subjectId === "all";
  const canAddMarks = students.length > 0 && subjects.length > 0;

  return (
    <div>
      <PageHeader
        title="Marks"
        description="Record and manage internal, external, and total marks."
        action={
          <Button
            disabled={!canAddMarks}
            onClick={() => {
              setEditingMarks(null);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" />
            Add Marks
          </Button>
        }
      />

      {isEmpty ? (
        <EmptyState
          icon={ClipboardList}
          title="No Marks Found"
          description="Add marks to start analytics."
          action={
            canAddMarks ? (
              <Button
                onClick={() => {
                  setEditingMarks(null);
                  setFormOpen(true);
                }}
              >
                <Plus className="size-4" />
                Add Marks To Start Analytics
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
              placeholder="Search by student or subject..."
              className="w-full sm:max-w-xs"
            />
            <DepartmentSelect
              value={department}
              onChange={(value) => updateParams({ department: value })}
              className="w-full sm:w-44"
            />
            <Select value={subjectId} onValueChange={(value) => updateParams({ subjectId: value })}>
              <SelectTrigger className="w-full sm:w-52">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.subjectName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Internal</TableHead>
                <TableHead>External</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No marks match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                result.data.map((mark) => (
                  <TableRow key={mark.id}>
                    <TableCell className="font-medium">
                      {mark.studentName}
                      <span className="block text-xs text-muted-foreground">{mark.studentDisplayId}</span>
                    </TableCell>
                    <TableCell>
                      {mark.subjectName}
                      <span className="block text-xs text-muted-foreground">{mark.subjectCode}</span>
                    </TableCell>
                    <TableCell>{mark.internalMarks}</TableCell>
                    <TableCell>{mark.externalMarks}</TableCell>
                    <TableCell>
                      <Badge variant={mark.totalMarks >= 40 ? "success" : "destructive"}>
                        {mark.totalMarks}
                      </Badge>
                    </TableCell>
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
                              setEditingMarks(mark);
                              setFormOpen(true);
                            }}
                          >
                            <Pencil className="size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={() => setDeletingMarks(mark)}
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
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

      <MarksFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        marks={editingMarks}
        students={students}
        subjects={subjects}
      />

      <ConfirmDialog
        open={Boolean(deletingMarks)}
        onOpenChange={(open) => !open && setDeletingMarks(null)}
        title="Are you sure?"
        description="This action cannot be undone."
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
