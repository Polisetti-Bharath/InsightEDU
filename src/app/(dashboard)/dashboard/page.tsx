import { Users, BookOpen, ClipboardList, TrendingUp, Trophy, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubjectAverageBarChart } from "@/charts/subject-average-bar-chart";
import { GradeDistributionPieChart } from "@/charts/grade-distribution-pie-chart";
import { DepartmentPerformanceBarChart } from "@/charts/department-performance-bar-chart";
import { PassFailDonutChart } from "@/charts/pass-fail-donut-chart";
import {
  getDashboardMetrics,
  getDepartmentPerformance,
  getGradeDistribution,
  getPassFailRatio,
  getSubjectPerformance,
} from "@/services/analyticsService";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [metrics, subjectPerformance, gradeDistribution, departmentPerformance, passFailRatio] =
    await Promise.all([
      getDashboardMetrics(),
      getSubjectPerformance(),
      getGradeDistribution(),
      getDepartmentPerformance(),
      getPassFailRatio(),
    ]);

  const hasData = metrics.totalMarksEntries > 0;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="A real-time overview of student performance, powered by MongoDB Aggregation Pipelines."
      />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Total Students" value={metrics.totalStudents} icon={Users} accent="primary" />
        <KpiCard label="Total Subjects" value={metrics.totalSubjects} icon={BookOpen} accent="primary" />
        <KpiCard
          label="Total Marks Entries"
          value={metrics.totalMarksEntries}
          icon={ClipboardList}
          accent="primary"
        />
        <KpiCard label="Class Average" value={metrics.classAverage} icon={TrendingUp} accent="success" />
        <KpiCard label="Highest Score" value={metrics.highestScore} icon={Trophy} accent="warning" />
        <KpiCard
          label="Pass Percentage"
          value={`${metrics.passPercentage}%`}
          icon={CheckCircle2}
          accent={metrics.passPercentage >= 50 ? "success" : "destructive"}
        />
      </div>

      {!hasData ? (
        <div className="mt-6">
          <EmptyState
            icon={ClipboardList}
            title="Add Data To Generate Insights"
            description="Add subjects, students, and marks to unlock dashboard analytics."
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Subject Average Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <SubjectAverageBarChart data={subjectPerformance} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Grade Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <GradeDistributionPieChart data={gradeDistribution} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Department Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <DepartmentPerformanceBarChart data={departmentPerformance} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pass vs Fail Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <PassFailDonutChart data={passFailRatio} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
