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
import { createSubjectAction, updateSubjectAction } from "@/actions/subjects";
import type { SubjectDTO } from "@/types";

interface SubjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject?: SubjectDTO | null;
}

const EMPTY_FORM = { subjectCode: "", subjectName: "", credits: "3" };

export function SubjectFormDialog({ open, onOpenChange, subject }: SubjectFormDialogProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isPending, startTransition] = useTransition();
  const isEditMode = Boolean(subject);

  useEffect(() => {
    if (open) {
      setForm(
        subject
          ? {
              subjectCode: subject.subjectCode,
              subjectName: subject.subjectName,
              credits: String(subject.credits),
            }
          : EMPTY_FORM,
      );
      setFieldErrors({});
    }
  }, [open, subject]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});

    startTransition(async () => {
      const result = isEditMode
        ? await updateSubjectAction(subject!.id, form)
        : await createSubjectAction(form);

      if (!result.success) {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        toast.error(result.error);
        return;
      }

      toast.success(isEditMode ? "Subject Updated Successfully" : "Subject Created Successfully");
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Subject" : "Add Subject"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Update this subject's information." : "Enter the details for the new subject."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="subjectCode">Subject Code</Label>
              <Input
                id="subjectCode"
                value={form.subjectCode}
                onChange={(event) => setForm((prev) => ({ ...prev, subjectCode: event.target.value }))}
                placeholder="CS301"
                required
              />
              {fieldErrors.subjectCode ? (
                <p className="text-xs text-destructive">{fieldErrors.subjectCode[0]}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="subjectName">Subject Name</Label>
              <Input
                id="subjectName"
                value={form.subjectName}
                onChange={(event) => setForm((prev) => ({ ...prev, subjectName: event.target.value }))}
                placeholder="Database Systems"
                required
              />
              {fieldErrors.subjectName ? (
                <p className="text-xs text-destructive">{fieldErrors.subjectName[0]}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                type="number"
                min={1}
                max={6}
                value={form.credits}
                onChange={(event) => setForm((prev) => ({ ...prev, credits: event.target.value }))}
                required
              />
              {fieldErrors.credits ? (
                <p className="text-xs text-destructive">{fieldErrors.credits[0]}</p>
              ) : null}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : isEditMode ? "Save Changes" : "Add Subject"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
