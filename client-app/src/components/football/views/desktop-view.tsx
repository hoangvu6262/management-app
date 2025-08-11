import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Users,
  Shield,
  Star,
  Trophy,
} from "lucide-react";
import {
  footballMatchService,
  FootballMatchResponse,
} from "@/services/footballMatchService";
import {
  DataTable,
  Column,
  AvatarCell,
  BadgeCell,
  ActionsCell,
} from "@/components/ui/data-table";

interface DesktopViewProps {
  matches: FootballMatchResponse[];
  selectedRows: string[];
  onEdit: (match: FootballMatchResponse) => void;
  onDelete: (id: string) => void;
  onRowSelect: (matchId: string) => void;
  onSelectAll: () => void;
  getStatusBadge: (status: string, matchId: string) => React.ReactNode;
}

// Custom components for specific cells
const DateCell = ({ date }: { date: string }) => (
  <div className="flex items-center space-x-2">
    <Calendar className="h-4 w-4 text-blue-500" />
    <span className="text-sm font-medium">
      {new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "2-digit",
      })}
    </span>
  </div>
);

const TimeCell = ({ time }: { time: string }) => (
  <div className="flex items-center space-x-2">
    <Clock className="h-4 w-4 text-gray-500" />
    <span className="text-sm">{time}</span>
  </div>
);

const StadiumCell = ({ stadium }: { stadium: string }) => (
  <div className="flex items-center space-x-2">
    <MapPin className="h-4 w-4 text-purple-500" />
    <span className="text-sm font-medium truncate max-w-[120px]">
      {stadium}
    </span>
  </div>
);

const TeamCell = ({ team }: { team: string }) => {
  return (
    <div className="flex items-center space-x-2">
      <Shield className={`h-4 w-4 text-blue-600`} />
      <span className="text-sm font-medium">{team}</span>
    </div>
  );
};

const MatchNumberCell = ({ number }: { number: number }) => (
  <div className="flex justify-center">
    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded-full">
      {number}
    </span>
  </div>
);

const TypeCell = ({ type }: { type: string }) => {
  return <BadgeCell text={type} variant="default" />;
};

const CurrencyCell = ({
  amount,
  type,
}: {
  amount: number;
  type: "revenue" | "cost" | "neutral";
}) => {
  const getColorClass = () => {
    switch (type) {
      case "revenue":
        return "text-emerald-600 dark:text-emerald-400";
      case "cost":
        return "text-red-500 dark:text-red-400";
      default:
        return "text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <span className={`text-sm font-semibold ${getColorClass()}`}>
      {footballMatchService.formatCurrency(amount)}
    </span>
  );
};

const ProfitCell = ({ profit }: { profit: number }) => {
  const isPositive = profit > 0;
  const isNegative = profit < 0;

  return (
    <div className="flex items-center justify-end space-x-1">
      {isPositive && <TrendingUp className="h-3 w-3 text-green-500" />}
      {isNegative && <TrendingDown className="h-3 w-3 text-red-500" />}
      <span
        className={`font-bold text-sm ${footballMatchService.getProfitColor(
          profit
        )}`}
      >
        {footballMatchService.formatCurrency(profit)}
      </span>
    </div>
  );
};

const CheckboxCell = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={onChange}
    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    onClick={(e) => e.stopPropagation()}
  />
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
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string, direction: "asc" | "desc") => {
    setSortKey(key);
    setSortDirection(direction);
    // TODO: Implement actual sorting logic here
  };

  const columns: Column<FootballMatchResponse>[] = [
    {
      key: "date",
      label: "Date",
      width: "140px",
      // sortable: true,
      render: (value) => <DateCell date={value} />,
    },
    {
      key: "time",
      label: "Time",
      width: "100px",
      render: (value) => <TimeCell time={value} />,
    },
    {
      key: "stadium",
      label: "Stadium",
      width: "180px",
      render: (value) => <StadiumCell stadium={value} />,
    },
    {
      key: "team",
      label: "Team",
      width: "140px",
      render: (value) => <TeamCell team={value} />,
    },
    {
      key: "matchNumber",
      label: "Matches",
      width: "80px",
      render: (value) => <MatchNumberCell number={value} />,
    },
    {
      key: "type",
      label: "Type",
      width: "100px",
      render: (value) => <TypeCell type={value} />,
    },
    {
      key: "totalRevenue",
      label: "Revenue",
      width: "120px",
      // sortable: true,
      render: (value) => <CurrencyCell amount={value} type="revenue" />,
    },
    {
      key: "totalCost",
      label: "Cost",
      width: "120px",
      // sortable: true,
      render: (value) => <CurrencyCell amount={value} type="cost" />,
    },
    {
      key: "recordingMoneyForPhotographer",
      label: "Photographer",
      width: "120px",
      render: (value) => <CurrencyCell amount={value} type="neutral" />,
    },
    {
      key: "moneyForCameraman",
      label: "Cameraman",
      width: "120px",
      render: (value) => <CurrencyCell amount={value} type="neutral" />,
    },
    {
      key: "discount",
      label: "Discount",
      width: "100px",
      render: (value) => <CurrencyCell amount={value} type="neutral" />,
    },
    {
      key: "profit",
      label: "Profit",
      width: "150px",
      // sortable: true,
      render: (value) => <ProfitCell profit={value || 0} />,
    },
    {
      key: "status",
      label: "Status",
      width: "140px",
      render: (_, row) => getStatusBadge(row.status, row.id),
    },
    {
      key: "note",
      label: "Notes",
      width: "120px",
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400 italic truncate">
          {value || "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="hidden lg:block">
      <DataTable
        columns={columns}
        data={matches}
        onSort={handleSort}
        sortKey={sortKey}
        sortDirection={sortDirection}
        height="calc(100vh - 470px)"
        onRowClick={(row) => {
          // Optional: Handle row click
          console.log("Row clicked:", row);
        }}
        actions={(row) => (
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-amber-100 dark:hover:bg-amber-900/30"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row);
              }}
            >
              <Edit className="h-4 w-4 text-amber-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(row.id);
              }}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )}
        emptyMessage="No football matches found"
        className="shadow-lg"
      />
    </div>
  );
}
