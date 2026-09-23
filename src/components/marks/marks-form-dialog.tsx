"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
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
import { Combobox, type ComboboxOption } from "@/components/shared/combobox";
import { createMarksAction, updateMarksAction } from "@/actions/marks";
import type { MarksDTO, StudentDTO, SubjectDTO } from "@/types";

interface MarksFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  marks?: MarksDTO | null;
  students: StudentDTO[];
  subjects: SubjectDTO[];
}

const EMPTY_FORM = { studentId: "", subjectId: "", internalMarks: "", externalMarks: "" };

export function MarksFormDialog({ open, onOpenChange, marks, students, subjects }: MarksFormDialogProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isPending, startTransition] = useTransition();
  const isEditMode = Boolean(marks);

  useEffect(() => {
    if (open) {
      setForm(
        marks
          ? {
              studentId: marks.studentId,
              subjectId: marks.subjectId,
              internalMarks: String(marks.internalMarks),
              externalMarks: String(marks.externalMarks),
            }
          : EMPTY_FORM,
      );
      setFieldErrors({});
    }
  }, [open, marks]);

  const studentOptions: ComboboxOption[] = useMemo(
    () =>
      students.map((student) => ({
        value: student.id,
        label: `${student.name} (${student.studentId})`,
        keywords: `${student.studentId} ${student.email}`,
      })),
    [students],
  );

  const subjectOptions: ComboboxOption[] = useMemo(
    () =>
      subjects.map((subject) => ({
        value: subject.id,
        label: `${subject.subjectName} (${subject.subjectCode})`,
        keywords: subject.subjectCode,
      })),
    [subjects],
  );

  const computedTotal =
    (Number(form.internalMarks) || 0) + (Number(form.externalMarks) || 0);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});

    startTransition(async () => {
      const result = isEditMode
        ? await updateMarksAction(marks!.id, form)
        : await createMarksAction(form);

      if (!result.success) {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        toast.error(result.error);
        return;
      }

      toast.success(isEditMode ? "Marks Updated Successfully" : "Marks Added Successfully");
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Marks" : "Add Marks"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Update this marks record." : "Enter internal and external marks for a student."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label>Student</Label>
              <Combobox
                options={studentOptions}
                value={form.studentId}
                onChange={(value) => setForm((prev) => ({ ...prev, studentId: value }))}
                placeholder="Select a student"
                searchPlaceholder="Search students..."
                disabled={isEditMode}
              />
              {fieldErrors.studentId ? (
                <p className="text-xs text-destructive">{fieldErrors.studentId[0]}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Subject</Label>
              <Combobox
                options={subjectOptions}
                value={form.subjectId}
                onChange={(value) => setForm((prev) => ({ ...prev, subjectId: value }))}
                placeholder="Select a subject"
                searchPlaceholder="Search subjects..."
                disabled={isEditMode}
              />
              {fieldErrors.subjectId ? (
                <p className="text-xs text-destructive">{fieldErrors.subjectId[0]}</p>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="internalMarks">Internal Marks (0-40)</Label>
                <Input
                  id="internalMarks"
                  type="number"
                  min={0}
                  max={40}
                  value={form.internalMarks}
                  onChange={(event) => setForm((prev) => ({ ...prev, internalMarks: event.target.value }))}
                  required
                />
                {fieldErrors.internalMarks ? (
                  <p className="text-xs text-destructive">{fieldErrors.internalMarks[0]}</p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="externalMarks">External Marks (0-60)</Label>
                <Input
                  id="externalMarks"
                  type="number"
                  min={0}
                  max={60}
                  value={form.externalMarks}
                  onChange={(event) => setForm((prev) => ({ ...prev, externalMarks: event.target.value }))}
                  required
                />
                {fieldErrors.externalMarks ? (
                  <p className="text-xs text-destructive">{fieldErrors.externalMarks[0]}</p>
                ) : null}
              </div>
            </div>

            <div className="rounded-md bg-muted px-3 py-2 text-sm">
              Total Marks: <span className="font-semibold">{computedTotal}</span> / 100
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : isEditMode ? "Save Changes" : "Add Marks"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
