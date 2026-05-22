import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useIssueStore } from '@/stores/issueStore';
import { useDebounce } from '@/hooks/useDebounce';

export function IssueFilters() {
  const filters = useIssueStore((s) => s.filters);
  const setFilter = useIssueStore((s) => s.setFilter);

  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilter('search', debouncedSearch);
    }
  }, [debouncedSearch]);

  const hasActiveFilters =
    filters.search || filters.status || filters.priority || filters.severity;

  const clearFilters = () => {
    setSearchInput('');
    setFilter('search', '');
    setFilter('status', '');
    setFilter('priority', '');
    setFilter('severity', '');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search issues…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-8"
        />
      </div>

      <Select
        value={filters.status || 'all'}
        onValueChange={(v) => setFilter('status', v === 'all' ? '' : v)}
      >
        <SelectTrigger className="w-full sm:w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.priority || 'all'}
        onValueChange={(v) => setFilter('priority', v === 'all' ? '' : v)}
      >
        <SelectTrigger className="w-full sm:w-[140px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="critical">Critical</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.severity || 'all'}
        onValueChange={(v) => setFilter('severity', v === 'all' ? '' : v)}
      >
        <SelectTrigger className="w-full sm:w-[140px]">
          <SelectValue placeholder="Severity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All severities</SelectItem>
          <SelectItem value="minor">Minor</SelectItem>
          <SelectItem value="major">Major</SelectItem>
          <SelectItem value="critical">Critical</SelectItem>
          <SelectItem value="blocker">Blocker</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear filters">
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
