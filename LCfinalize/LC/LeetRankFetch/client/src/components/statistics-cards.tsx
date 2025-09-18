import { Users, TrendingUp, Trophy, Medal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Statistics {
  totalStudents: number;
  activeThisWeek: number;
  totalProblems: number;
  avgRanking: number;
}

interface StatisticsCardsProps {
  statistics?: Statistics;
  isLoading: boolean;
}

export function StatisticsCards({ statistics, isLoading }: StatisticsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Total Students",
      value: statistics?.totalStudents || 0,
      icon: Users,
      testId: "stats-total-students",
    },
    {
      title: "Active This Week",
      value: statistics?.activeThisWeek || 0,
      icon: TrendingUp,
      testId: "stats-active-week",
    },
    {
      title: "Total Problems Solved",
      value: statistics?.totalProblems || 0,
      icon: Trophy,
      testId: "stats-total-problems",
    },
    {
      title: "Average Ranking",
      value: statistics?.avgRanking ? statistics.avgRanking.toLocaleString() : "N/A",
      icon: Medal,
      testId: "stats-avg-ranking",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p 
                  className="text-3xl font-bold" 
                  data-testid={stat.testId}
                >
                  {stat.value}
                </p>
              </div>
              <stat.icon className="text-primary text-2xl h-8 w-8" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
