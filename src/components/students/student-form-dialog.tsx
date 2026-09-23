"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DepartmentSelect } from "@/components/shared/department-select";
import { createStudentAction, updateStudentAction } from "@/actions/students";
import type { StudentDTO } from "@/types";

interface StudentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: StudentDTO | null;
}

const EMPTY_FORM = {
  studentId: "",
  name: "",
  email: "",
  department: "CSE",
  semester: "1",
};

export function StudentFormDialog({ open, onOpenChange, student }: StudentFormDialogProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isPending, startTransition] = useTransition();
  const isEditMode = Boolean(student);

  useEffect(() => {
    if (open) {
      setForm(
        student
          ? {
              studentId: student.studentId,
              name: student.name,
              email: student.email,
              department: student.department,
              semester: String(student.semester),
            }
          : EMPTY_FORM,
      );
      setFieldErrors({});
    }
  }, [open, student]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});

    const payload = {
      studentId: form.studentId,
      name: form.name,
      email: form.email,
      department: form.department,
      semester: form.semester,
    };

    startTransition(async () => {
      const result = isEditMode
        ? await updateStudentAction(student!.id, payload)
        : await createStudentAction(payload);

      if (!result.success) {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        toast.error(result.error);
        return;
      }

      toast.success(isEditMode ? "Student Updated Successfully" : "Student Created Successfully");
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Student" : "Add Student"}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update this student's information."
                : "Enter the details for the new student."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  value={form.studentId}
                  onChange={(event) => setForm((prev) => ({ ...prev, studentId: event.target.value }))}
                  placeholder="23CS101"
                  required
                />
                {fieldErrors.studentId ? (
                  <p className="text-xs text-destructive">{fieldErrors.studentId[0]}</p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="semester">Semester</Label>
                <Input
                  id="semester"
                  type="number"
                  min={1}
                  max={8}
                  value={form.semester}
                  onChange={(event) => setForm((prev) => ({ ...prev, semester: event.target.value }))}
                  required
                />
                {fieldErrors.semester ? (
                  <p className="text-xs text-destructive">{fieldErrors.semester[0]}</p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="John Doe"
                required
              />
              {fieldErrors.name ? <p className="text-xs text-destructive">{fieldErrors.name[0]}</p> : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="john@example.com"
                required
              />
              {fieldErrors.email ? <p className="text-xs text-destructive">{fieldErrors.email[0]}</p> : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Department</Label>
              <DepartmentSelect
                value={form.department}
                onChange={(value) => setForm((prev) => ({ ...prev, department: value }))}
                includeAll={false}
              />
              {fieldErrors.department ? (
                <p className="text-xs text-destructive">{fieldErrors.department[0]}</p>
              ) : null}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : isEditMode ? "Save Changes" : "Add Student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
