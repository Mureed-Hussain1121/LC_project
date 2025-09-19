import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Code, Users, TrendingUp, Trophy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { StatisticsCards } from "@/components/statistics-cards";
import { Filters } from "@/components/filters";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { apiRequest } from "@/lib/queryClient";
import type { StudentWithStats } from "@shared/schema";

interface Statistics {
  totalStudents: number;
  activeThisWeek: number;
  totalProblems: number;
  avgRanking: number;
}

export default function Leaderboard() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [sortField, setSortField] = useState<string>("totalSolved");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [lastUpdated, setLastUpdated] = useState<string>("Never");

  const { data: students = [], isLoading: studentsLoading, refetch: refetchStudents } = useQuery<StudentWithStats[]>({
    queryKey: ["/api/students"],
  });

  const { data: statistics, isLoading: statisticsLoading, refetch: refetchStatistics } = useQuery<Statistics>({
    queryKey: ["/api/statistics"],
  });

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter(student => {
      const matchesSearch = search === "" || 
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.username.toLowerCase().includes(search.toLowerCase());
      
      const matchesBatch = batchFilter === "all" || student.batch === batchFilter;
      const matchesProgram = programFilter === "all" || student.program === programFilter;
      
      return matchesSearch && matchesBatch && matchesProgram;
    });

    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "totalSolved":
          aValue = a.stats?.totalSolved || 0;
          bValue = b.stats?.totalSolved || 0;
          break;
        case "globalRanking":
          aValue = a.stats?.globalRanking || Infinity;
          bValue = b.stats?.globalRanking || Infinity;
          break;
        default:
          aValue = a.stats?.totalSolved || 0;
          bValue = b.stats?.totalSolved || 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [students, search, batchFilter, programFilter, sortField, sortDirection]);

  const uniqueBatches = useMemo(() => 
    Array.from(new Set(students.map(s => s.batch))).sort(),
    [students]
  );

  const uniquePrograms = useMemo(() => 
    Array.from(new Set(students.map(s => s.program))).sort(),
    [students]
  );

  const handleRefresh = async () => {
    try {
      setLastUpdated("Refreshing...");
      
      toast({
        title: "Refreshing data...",
        description: "This may take a few minutes to complete.",
      });

      const response = await fetch("/api/full-refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Refresh result:", result);

        await refetchStudents();
        await refetchStatistics();
        setLastUpdated(new Date().toLocaleTimeString());

        toast({
          title: "Data refreshed successfully!",
          description: `Students: ${result.students?.created || 0} created, ${result.students?.updated || 0} updated. Stats: ${result.stats?.success || 0} updated.`,
        });
      } else {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error("Refresh error:", error);
      setLastUpdated("Error");
      toast({
        title: "Refresh failed",
        description: error instanceof Error ? error.message : "Unable to refresh data. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Code className="text-primary text-2xl" />
                <h1 className="text-2xl font-bold">NED LeetCode Leaderboard</h1>
              </div>
              <span className="text-sm text-muted-foreground">
                Computer & Information Systems Engineering
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleRefresh}
                className="flex items-center space-x-2"
                data-testid="button-refresh"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh Data</span>
              </Button>
              <div className="text-sm text-muted-foreground">
                Last updated: <span data-testid="text-last-updated">{lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <StatisticsCards 
          statistics={statistics} 
          isLoading={statisticsLoading} 
        />

        {/* Filters and Search */}
        <Filters
          search={search}
          setSearch={setSearch}
          batchFilter={batchFilter}
          setBatchFilter={setBatchFilter}
          programFilter={programFilter}
          setProgramFilter={setProgramFilter}
          uniqueBatches={uniqueBatches}
          uniquePrograms={uniquePrograms}
          resultCount={filteredAndSortedStudents.length}
        />

        {/* Leaderboard Table */}
        <LeaderboardTable
          students={filteredAndSortedStudents}
          isLoading={studentsLoading}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="https://cct.neduet.edu.pk/sites/default/files/CT_logo.jpeg" 
                alt="NED University Logo" 
                className="h-8" 
              />
              <div className="text-sm text-muted-foreground">
                © 2024 NED University of Engineering & Technology
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <a 
                href="https://cct.neduet.edu.pk/" 
                className="hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Department Website
              </a>
              <span>•</span>
              <a 
                href="https://cct.neduet.edu.pk/contact-us" 
                className="hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact
              </a>
              <span>•</span>
              <span>Data sourced from LeetCode API</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
