import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Edit, Trash2 } from "lucide-react";
import {
  footballMatchService,
  FootballMatchResponse,
} from "@/services/footballMatchService";
import { TypeBadge } from "../components/type-badge";
import { TeamBadge } from "../components/team-badge";

interface MobileViewProps {
  matches: FootballMatchResponse[];
  onEdit: (match: FootballMatchResponse) => void;
  onDelete: (id: string) => void;
  getStatusBadge: (status: string, matchId: string) => React.ReactNode;
}

export function MobileView({
  matches,
  onEdit,
  onDelete,
  getStatusBadge,
}: MobileViewProps) {
  return (
    <div className="block sm:hidden">
      <div className="max-h-[calc(100vh-350px)] overflow-auto space-y-4">
        {matches.map((match) => (
          <Card key={match.id} className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-y-2">
                  <div>
                    <p className="flex items-center space-x-1 font-medium text-sm">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>{new Date(match.date).toLocaleDateString()}</span>
                    </p>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{match.time}</span>
                    </div>
                  </div>
                </div>
                {getStatusBadge(match.status, match.id)}
              </div>

              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-4 w-4 text-purple-500" />
                <p className="text-sm font-medium">{match.stadium}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Team:</p>
                  <TeamBadge team={match.team} />
                </div>

                <div>
                  <p className="text-muted-foreground">Match #</p>
                  <p className="font-medium">{match.matchNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <TypeBadge type={match.type} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Revenue</p>
                  <p className="font-medium text-green-600">
                    {footballMatchService.formatCurrency(match.totalRevenue)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cost</p>
                  <p className="font-medium text-red-600">
                    {footballMatchService.formatCurrency(match.totalCost)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Profit</p>
                  <p
                    className={`font-medium ${footballMatchService.getProfitColor(
                      match.profit || 0
                    )}`}
                  >
                    {footballMatchService.formatCurrency(match.profit || 0)}
                  </p>
                </div>
              </div>

              {/* Additional financial details */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Recording</p>
                  <p className="font-medium text-orange-600">
                    {footballMatchService.formatCurrency(
                      match.recordingMoneyForPhotographer
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cameraman</p>
                  <p className="font-medium text-orange-600">
                    {footballMatchService.formatCurrency(
                      match.moneyForCameraman
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Discount</p>
                  <p className="font-medium text-blue-600">
                    {footballMatchService.formatCurrency(match.discount)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-sm text-muted-foreground">
                  {match.note || "No notes"}
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-yellow-100"
                    onClick={() => onEdit(match)}
                  >
                    <Edit className="h-4 w-4 text-yellow-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-red-100"
                    onClick={() => onDelete(match.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
