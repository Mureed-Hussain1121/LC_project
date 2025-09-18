import { ArrowUpDown, Crown, Medal, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { StudentWithStats } from "@shared/schema";

interface LeaderboardTableProps {
  students: StudentWithStats[];
  isLoading: boolean;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
}

export function LeaderboardTable({ 
  students, 
  isLoading, 
  sortField, 
  sortDirection, 
  onSort 
}: LeaderboardTableProps) {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="text-primary h-5 w-5" />;
      case 1:
        return <Medal className="text-gray-400 h-5 w-5" />;
      case 2:
        return <Medal className="text-amber-600 h-5 w-5" />;
      default:
        return null;
    }
  };

  const getProgressPercentage = (totalSolved: number) => {
    const maxSolved = Math.max(...students.map(s => s.stats?.totalSolved || 0));
    return maxSolved > 0 ? (totalSolved / maxSolved) * 100 : 0;
  };

  const SortButton = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      onClick={() => onSort(field)}
      className="h-auto p-0 font-semibold text-sm hover:text-primary"
      data-testid={`button-sort-${field}`}
    >
      {children}
      <ArrowUpDown className="ml-1 h-3 w-3" />
    </Button>
  );

  if (isLoading) {
    return (
      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-sm">Rank</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">User</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Total Solved</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Difficulty Breakdown</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">LeetCode Rank</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Skills</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Academic Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="py-4 px-6"><Skeleton className="h-6 w-8" /></td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Skeleton className="h-6 w-12" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </td>
                  <td className="py-4 px-6"><Skeleton className="h-4 w-16" /></td>
                  <td className="py-4 px-6"><Skeleton className="h-4 w-20" /></td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }

  if (students.length === 0) {
    return (
      <Card className="bg-card border-border p-12 text-center">
        <div className="text-muted-foreground">
          <p className="text-lg font-semibold mb-2">No students found</p>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-sm">Rank</th>
              <th className="text-left py-4 px-6 font-semibold text-sm">
                <SortButton field="name">User</SortButton>
              </th>
              <th className="text-left py-4 px-6 font-semibold text-sm">
                <SortButton field="totalSolved">Total Solved</SortButton>
              </th>
              <th className="text-left py-4 px-6 font-semibold text-sm">Difficulty Breakdown</th>
              <th className="text-left py-4 px-6 font-semibold text-sm">
                <SortButton field="globalRanking">LeetCode Rank</SortButton>
              </th>
              <th className="text-left py-4 px-6 font-semibold text-sm">Skills</th>
              <th className="text-left py-4 px-6 font-semibold text-sm">Academic Info</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {students.map((student, index) => (
              <tr 
                key={student.id} 
                className="table-hover"
                data-testid={`row-student-${index}`}
              >
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    {getRankIcon(index)}
                    <span 
                      className={`font-bold ${index === 0 ? 'text-primary' : ''}`}
                      data-testid={`text-rank-${index}`}
                    >
                      {index + 1}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <img
                      src={student.avatarUrl || 'https://assets.leetcode.com/users/default_avatar.jpg'}
                      alt={student.name}
                      className="w-10 h-10 rounded-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://assets.leetcode.com/users/default_avatar.jpg';
                      }}
                      data-testid={`img-avatar-${index}`}
                    />
                    <div>
                      <div className="font-semibold" data-testid={`text-name-${index}`}>
                        {student.name}
                      </div>
                      <a
                        href={student.leetcodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-sm text-primary hover:text-primary/80 flex items-center space-x-1"
                        data-testid={`link-username-${index}`}
                      >
                        <span>@{student.username}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-xl font-bold" data-testid={`text-total-solved-${index}`}>
                    {student.stats?.totalSolved || 0}
                  </div>
                  <div className="progress-bar mt-1">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${getProgressPercentage(student.stats?.totalSolved || 0)}%` 
                      }}
                    />
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="difficulty-easy font-semibold">Easy:</span>
                      <span data-testid={`text-easy-${index}`}>
                        {student.stats?.easySolved || 0}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="difficulty-medium font-semibold">Medium:</span>
                      <span data-testid={`text-medium-${index}`}>
                        {student.stats?.mediumSolved || 0}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="difficulty-hard font-semibold">Hard:</span>
                      <span data-testid={`text-hard-${index}`}>
                        {student.stats?.hardSolved || 0}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span 
                    className="font-mono text-primary" 
                    data-testid={`text-global-rank-${index}`}
                  >
                    {student.stats?.globalRanking 
                      ? `#${student.stats.globalRanking.toLocaleString()}`
                      : 'N/A'
                    }
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-wrap max-w-32">
                    {student.skills?.map((skill, skillIndex) => (
                      <span 
                        key={skillIndex} 
                        className="skill-badge"
                        data-testid={`badge-skill-${index}-${skillIndex}`}
                      >
                        {skill}
                      </span>
                    )) || <span className="text-muted-foreground text-sm">None listed</span>}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm">
                    <div className="font-semibold" data-testid={`text-roll-${index}`}>
                      {student.rollNo}
                    </div>
                    <div className="text-muted-foreground" data-testid={`text-program-${index}`}>
                      {student.program}
                    </div>
                    <div className="text-muted-foreground" data-testid={`text-batch-${index}`}>
                      Batch {student.batch}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
