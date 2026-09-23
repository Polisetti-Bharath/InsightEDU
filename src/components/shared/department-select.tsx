"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEPARTMENTS } from "@/types";

interface DepartmentSelectProps {
  value: string;
  onChange: (value: string) => void;
  includeAll?: boolean;
  className?: string;
}

export function DepartmentSelect({ value, onChange, includeAll = true, className }: DepartmentSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Department" />
      </SelectTrigger>
      <SelectContent>
        {includeAll ? <SelectItem value="all">All Departments</SelectItem> : null}
        {DEPARTMENTS.map((department) => (
          <SelectItem key={department} value={department}>
            {department}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
