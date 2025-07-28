import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calendar, Clock, MapPin, Edit, Trash2 } from "lucide-react";
import {
  footballMatchService,
  FootballMatchResponse,
} from "@/services/footballMatchService";
import { TypeBadge } from "../components/type-badge";
import { TeamBadge } from "../components/team-badge";

interface DesktopViewProps {
  matches: FootballMatchResponse[];
  selectedRows: string[];
  onEdit: (match: FootballMatchResponse) => void;
  onDelete: (id: string) => void;
  onRowSelect: (matchId: string) => void;
  onSelectAll: () => void;
  getStatusBadge: (status: string, matchId: string) => React.ReactNode;
}

const StadiumBadge = ({ stadium }: { stadium: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="min-w-[140px] max-w-[200px]">
        <div className="w-full inline-flex items-center px-3 py-1.5 text-xs font-medium bg-purple-900/20 text-purple-700 border border-purple-200 rounded-full hover:bg-purple-100 transition-colors cursor-pointer dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700 dark:hover:bg-purple-900/30">
          <MapPin className="h-3 w-3 mr-1.5 flex-shrink-0" />
          <span className="truncate">{stadium}</span>
        </div>
      </div>
    </TooltipTrigger>
    <TooltipContent>
      <p>{stadium}</p>
    </TooltipContent>
  </Tooltip>
);

export function DesktopView({
  matches,
  selectedRows,
  onEdit,
  onDelete,
  onRowSelect,
  onSelectAll,
  getStatusBadge,
}: DesktopViewProps) {
  return (
    <div className="hidden lg:block">
      <div className="border rounded-lg bg-background overflow-hidden">
        <div className="overflow-auto max-h-[calc(100vh-400px)] hide-scrollbar">
          <Table>
            <TableHeader className="sticky top-0 z-30 bg-white dark:bg-gray-900 shadow-sm border-b">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12 bg-white dark:bg-gray-900">
                  <input
                    type="checkbox"
                    onChange={onSelectAll}
                    className="rounded"
                  />
                </TableHead>
                <TableHead className="min-w-[120px] bg-white dark:bg-gray-900">
                  Date
                </TableHead>
                <TableHead className="min-w-[80px] bg-white dark:bg-gray-900">
                  Time
                </TableHead>
                <TableHead className="min-w-[160px] bg-white dark:bg-gray-900">
                  Stadium
                </TableHead>
                <TableHead className="min-w-[120px] bg-white dark:bg-gray-900">
                  Team
                </TableHead>
                <TableHead className="min-w-[80px] bg-white dark:bg-gray-900">
                  Matches
                </TableHead>
                <TableHead className="min-w-[80px] bg-white dark:bg-gray-900">
                  Type
                </TableHead>
                <TableHead className="min-w-[100px] text-right bg-white dark:bg-gray-900">
                  Revenue
                </TableHead>
                <TableHead className="min-w-[100px] text-right bg-white dark:bg-gray-900">
                  Cost
                </TableHead>
                <TableHead className="min-w-[100px] text-right bg-white dark:bg-gray-900">
                  Photographer
                </TableHead>
                <TableHead className="min-w-[100px] text-right bg-white dark:bg-gray-900">
                  Cameraman
                </TableHead>
                <TableHead className="min-w-[100px] text-center bg-white dark:bg-gray-900">
                  Discount
                </TableHead>
                <TableHead className="min-w-[100px] text-right bg-white dark:bg-gray-900">
                  Profit
                </TableHead>
                <TableHead className="min-w-[120px] bg-white dark:bg-gray-900">
                  Status
                </TableHead>
                <TableHead className="min-w-[100px] bg-white dark:bg-gray-900">
                  Notes
                </TableHead>
                <TableHead className="w-16 bg-white dark:bg-gray-900"></TableHead>
                <TableHead className="w-16 bg-white dark:bg-gray-900"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.map((match) => {
                const isSelected = selectedRows.includes(match.id);

                return (
                  <TableRow
                    key={match.id}
                    className={isSelected ? "bg-blue-50 dark:bg-blue-950" : ""}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onRowSelect(match.id)}
                        className="rounded"
                      />
                    </TableCell>

                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span className="whitespace-nowrap">
                          {new Date(match.date).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="whitespace-nowrap">{match.time}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <StadiumBadge stadium={match.stadium} />
                    </TableCell>

                    <TableCell>
                      <TeamBadge team={match.team} />
                    </TableCell>

                    <TableCell className="text-center">
                      {match.matchNumber}
                    </TableCell>

                    <TableCell>
                      <TypeBadge type={match.type} />
                    </TableCell>

                    <TableCell className="font-medium text-right text-green-600 whitespace-nowrap">
                      {footballMatchService.formatCurrency(match.totalRevenue)}
                    </TableCell>
                    <TableCell className="text-right text-red-600 whitespace-nowrap">
                      {footballMatchService.formatCurrency(match.totalCost)}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {footballMatchService.formatCurrency(
                        match.recordingMoneyForPhotographer
                      )}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {footballMatchService.formatCurrency(
                        match.moneyForCameraman
                      )}
                    </TableCell>
                    <TableCell className="text-center whitespace-nowrap">
                      {footballMatchService.formatCurrency(match.discount)}
                    </TableCell>

                    <TableCell
                      className={`font-medium text-right whitespace-nowrap ${footballMatchService.getProfitColor(
                        match.profit || 0
                      )}`}
                    >
                      {footballMatchService.formatCurrency(match.profit || 0)}
                    </TableCell>

                    <TableCell>
                      {getStatusBadge(match.status, match.id)}
                    </TableCell>
                    <TableCell className="max-w-[100px]">
                      <span className="truncate block">
                        {match.note || "-"}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
                        onClick={() => onEdit(match)}
                      >
                        <Edit className="h-4 w-4 text-yellow-600" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-red-100 dark:hover:bg-red-900/20"
                        onClick={() => onDelete(match.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
