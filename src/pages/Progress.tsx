import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  CalendarDays,
  BookOpen,
  ChartBar,
  Flame,
  Heart,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useRecoveryScore } from "@/hooks/useRecoveryScore";
import { useBehaviorState } from "@/hooks/useBehaviorState";
import { daysAgoISO } from "@/utils/date";
import { HABITS } from "@/constants/habits";

const cardMotion = (index: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay: index * 0.05 },
});

function useWeeklyProgress() {
  const checkIns = useLocalStorage("dailyCheckins");
  const byDate = new Map(checkIns.map((c) => [c.date, c]));

  return Array.from({ length: 7 }, (_, i) => {
    const date = daysAgoISO(6 - i);
    const checkIn = byDate.get(date);
    return {
      date,
      dayLabel: new Date(date).toLocaleDateString(undefined, {
        weekday: "narrow",
      }),
      status: checkIn ? (checkIn.stayedClean ? "clean" : "slipped") : "missed",
    } as const;
  });
}

function useMonthlyProgress() {
  const checkIns = useLocalStorage("dailyCheckins");
  const byDate = new Map(checkIns.map((c) => [c.date, c]));

  // Last 30 days
  return Array.from({ length: 30 }, (_, i) => {
    const date = daysAgoISO(29 - i);
    const checkIn = byDate.get(date);
    return {
      date,
      dayLabel: new Date(date).toLocaleDateString(undefined, {
        day: "numeric",
      }),
      status: checkIn ? (checkIn.stayedClean ? "clean" : "slipped") : "missed",
    } as const;
  });
}

export default function Progress() {
  const profile = useLocalStorage("profile");
  const recoveryScore = useRecoveryScore();
  const behavior = useBehaviorState();
  const week = useWeeklyProgress();
  const month = useMonthlyProgress();

  const habitLabel =
    profile &&
    (profile.habit === "custom" && profile.customHabitLabel
      ? profile.customHabitLabel
      : HABITS[profile.habit].label);

  // Calculate monthly stats
  const cleanDays = month.filter((d) => d.status === "clean").length;
  const slippedDays = month.filter((d) => d.status === "slipped").length;
  const missedDays = month.filter((d) => d.status === "missed").length;
  const totalDays = month.length;
  const successRate = Math.round((cleanDays / totalDays) * 100);

  // Calculate longest streak from history
  const calculateLongestStreak = (checkIns: any[]) => {
    if (checkIns.length === 0) return 0;

    const sortedByDate = [...checkIns].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    let maxStreak = 0;
    let currentStreak = 0;

    for (const checkIn of sortedByDate) {
      if (checkIn.stayedClean) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return maxStreak;
  };

  const checkIns = useLocalStorage("dailyCheckins");
  const longestStreakEver = calculateLongestStreak(checkIns);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-semibold sm:text-3xl">
          Your Progress
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          View your recovery journey and statistics for {habitLabel}
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <motion.div {...cardMotion(0)}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Streak
              </CardTitle>
              <Flame className="size-4 text-warning" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-semibold">
                {behavior.streak}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                day{behavior.streak === 1 ? "" : "s"} clean
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...cardMotion(1)}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Best Streak
              </CardTitle>
              <Heart className="size-4 text-success" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-semibold">
                {longestStreakEver}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                day{longestStreakEver === 1 ? "" : "s"} clean
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...cardMotion(2)}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Success Rate
              </CardTitle>
              <ChartBar className="size-4 text-primary" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-semibold">
                {successRate}%
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                clean days this month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...cardMotion(3)}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Recovery Score
              </CardTitle>
              <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-semibold">
                {recoveryScore}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">out of 100</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <motion.div {...cardMotion(0)}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Recent Check-ins
              </CardTitle>
              <CalendarCheck
                className="size-4 text-success"
                aria-hidden="true"
              />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div
                  className="flex justify-between"
                  role="img"
                  aria-label="Check-in history for the last 7 days"
                >
                  {week.map((day) => (
                    <div
                      key={day.date}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <span
                        className={
                          day.status === "clean"
                            ? "size-6 rounded-full bg-success"
                            : day.status === "slipped"
                              ? "size-6 rounded-full bg-danger/70"
                              : "size-6 rounded-full border-2 border-dashed border-border"
                        }
                        title={`${day.date}: ${day.status}`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {day.dayLabel}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground text-center">
                  {week.filter((d) => d.status === "clean").length} clean day
                  {week.filter((d) => d.status === "clean").length === 1
                    ? ""
                    : "s"}{" "}
                  this week
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Monthly Trends */}
      <div className="mb-8">
        <motion.div {...cardMotion(0)}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Overview
              </CardTitle>
              <CalendarDays
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 text-center text-sm">
                  <div>
                    <p className="font-medium">Clean Days</p>
                    <p className="text-primary">{cleanDays}/30</p>
                  </div>
                  <div>
                    <p className="font-medium">Slipped</p>
                    <p className="text-warning">{slippedDays}</p>
                  </div>
                  <div>
                    <p className="font-medium">Missed</p>
                    <p className="text-destructive">{missedDays}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    {cleanDays} clean days this month ({successRate}% success
                    rate)
                  </p>
                  {slippedDays > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {slippedDays} days with slips - each one teaches you
                      something valuable
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Long-term Progress */}
      <div className="mb-8">
        <motion.div {...cardMotion(0)}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Long-term Trends
              </CardTitle>
              <TrendingUp className="size-4 text-success" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="font-medium">Longest Streak Ever</p>
                  <p className="text-2xl font-heading font-semibold">
                    {longestStreakEver} days
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Current Streak</p>
                  <p className="text-2xl font-heading font-semibold">
                    {behavior.streak} days
                  </p>
                </div>

                {profile && (
                  <div className="space-y-2">
                    <p className="font-medium">Days Since Start</p>
                    <p className="text-2xl font-heading font-semibold">
                      {Math.floor(
                        (new Date().getTime() -
                          new Date(profile.createdAt).getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}{" "}
                      days
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row sm:gap-4">
          <Button asChild size="lg" className="flex-1 gap-2">
            <Link to="/check-in">
              <CalendarCheck className="size-4" aria-hidden="true" />
              Daily Check-in
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="flex-1 gap-2">
            <Link to="/journal">
              <BookOpen className="size-4" aria-hidden="true" />
              View Journal
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
