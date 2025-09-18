import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FiltersProps {
  search: string;
  setSearch: (value: string) => void;
  batchFilter: string;
  setBatchFilter: (value: string) => void;
  programFilter: string;
  setProgramFilter: (value: string) => void;
  uniqueBatches: string[];
  uniquePrograms: string[];
  resultCount: number;
}

export function Filters({
  search,
  setSearch,
  batchFilter,
  setBatchFilter,
  programFilter,
  setProgramFilter,
  uniqueBatches,
  uniquePrograms,
  resultCount,
}: FiltersProps) {
  return (
    <Card className="bg-card border-border mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name or username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-80 bg-input border-border text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                data-testid="input-search"
              />
            </div>

            <Select value={batchFilter} onValueChange={setBatchFilter}>
              <SelectTrigger className="w-40 bg-input border-border" data-testid="select-batch">
                <SelectValue placeholder="All Batches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {uniqueBatches.map((batch) => (
                  <SelectItem key={batch} value={batch}>
                    {batch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={programFilter} onValueChange={setProgramFilter}>
              <SelectTrigger className="w-48 bg-input border-border" data-testid="select-program">
                <SelectValue placeholder="All Programs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                {uniquePrograms.map((program) => (
                  <SelectItem key={program} value={program}>
                    {program}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span data-testid="text-result-count">Showing {resultCount} students</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
