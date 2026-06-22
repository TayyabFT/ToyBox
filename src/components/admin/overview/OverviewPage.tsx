"use client";

import { useRef } from "react";
import {
  ActivityAI,
  ActivityChat,
  ActivityCheck,
  ActivityKey,
  ActivityUser,
  AlertTriangle,
  Dollar,
  StatCarIcon,
  StatDollarIcon,
  StatMembersIcon,
  StatMessageIcon,
} from "@/components/common/Svgs";
import { ActivityHighlight, RecentActivityItem } from "./RecentActivityItem";
import { CriticalAlertItem, criticalAlertsPanelClass } from "./CriticalAlertItem";
import { DashboardGreeting } from "./DashboardGreeting";
import { OpenRequestsTable } from "./OpenRequestsTable";
import { OverviewOutsideHeader, OverviewSectionHeader } from "./OverviewSectionHeader";
import { PriorityScheduleItem } from "./PriorityScheduleItem";
import { ScheduleTimeline, ScheduleTimelineItem } from "./ScheduleTimelineItem";
import { StaffOnShiftList } from "./StaffOnShiftItem";
import { StatCard } from "./StatCard";
import { UrgentAlertBar } from "./UrgentAlertBar";
import { overviewPanelClass } from "./panelStyles";

const openRequests = [
  {
    initial: "M",
    memberName: "MR. AL MANSOORI",
    memberMeta: "No. 0001074 · Founding",
    request: "Suite 02 preparation · arrival 14:30",
    priority: "urgent" as const,
    waiting: "12m",
    assignedName: "James",
    assignedTone: "human" as const,
  },
  {
    initial: "R",
    memberName: "RASHID AL-MAZROUI",
    memberMeta: "No. 0000912 · Platinum",
    request: "Mission kit for 2+ cars · Dubai track day",
    priority: "high" as const,
    waiting: "11m",
    assignedName: "Ben",
    assignedTone: "human" as const,
  },
  {
    initial: "K",
    memberName: "KHALID AL-FARSI",
    memberMeta: "No. 0001024 · Founding",
    request: "911 stabilisation · Cairo storage chat",
    priority: "urgent" as const,
    waiting: "9m",
    assignedName: "Steve",
    assignedSuffix: " · auto",
    assignedTone: "ai" as const,
  },
  {
    initial: "A",
    memberName: "ALEX MITCHELL",
    memberMeta: "No. 0000841 · Platinum",
    request: "Ghost summon · valet bay 02",
    priority: "high" as const,
    waiting: "8m",
    assignedName: "James",
    assignedTone: "human" as const,
  },
  {
    initial: "S",
    memberName: "SOPHIA AL-RASHIDI",
    memberMeta: "No. 0000763 · Founding",
    request: "McLaren Artura · bay 07 assignment",
    priority: "high" as const,
    waiting: "6m",
    assignedName: "Sarah",
    assignedTone: "human" as const,
  },
];

const staffOnShift = [
  {
    initial: "J",
    name: "James",
    role: "Lead Concierge",
    status: "online" as const,
    meta: "06:00",
  },
  {
    initial: "M",
    name: "Marco Bianchi",
    role: "Workshop",
    status: "active" as const,
    meta: "06:00",
  },
  {
    initial: "S",
    name: "Sarah Crane",
    role: "Membership",
    status: "online" as const,
    meta: "07:00",
  },
  {
    initial: "S",
    name: "Steve",
    role: "AI · Always on",
    status: "active" as const,
    meta: "14 sessions",
    avatarTone: "purple" as const,
  },
  {
    initial: "A",
    name: "Amanda K.",
    role: "Finance",
    status: "meeting" as const,
    meta: "08:00",
  },
];

export function AdminOverviewPage() {
  const criticalAlertsRef = useRef<HTMLElement>(null);

  function scrollToCriticalAlerts() {
    criticalAlertsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="space-y-7 p-8">
      <DashboardGreeting greeting="Good morning" name="Farah." />

      <UrgentAlertBar
        count={3}
        items={[
          { highlight: "Ferrari 296", detail: "overdue 12 days" },
          { highlight: "Mr. Al Mansoori", detail: "arriving 14:30 · suite pending" },
          { highlight: "Auction Day", detail: "headcount by 12:00" },
        ]}
        actionLabel="Review all"
        onReviewAll={scrollToCriticalAlerts}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-4">
        <StatCard
          label="Active Members"
          value="4"
          footnote="Founding"
          trend="+3"
          icon={<StatMembersIcon />}
        />
        <StatCard
          label="In Storage"
          value="287"
          footnote="Vehicles"
          trend="+4"
          icon={<StatCarIcon />}
        />
        <StatCard
          label="Open Requests"
          value="14"
          footnote="3 urgent"
          footnoteTone="pink"
          trend="+2"
          icon={<StatMessageIcon />}
        />
        <StatCard
          label="Today's Revenue"
          value="AED 47.2K"
          footnote="Vs avg"
          trend="+18%"
          icon={<StatDollarIcon />}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div>
          <OverviewOutsideHeader
            titleSplit={{ before: "Today's", after: "Priorities" }}
            title=""
            subtitle="4 items · sorted by time"
          />
          <section className={overviewPanelClass}>
            <PriorityScheduleItem
              time="14:30"
              countdown="In 4h 48m"
              tag={{ label: "VIP Arrival", tone: "gold" }}
              titleParts={{
                before: "Mr. Al Mansoori",
                after: "Private Suite Reservation",
              }}
              title=""
              detail="Suite 02 not yet prepared · James notified · champagne on order"
              action="Prep now"
              actionTone="pink"
            />
            <PriorityScheduleItem
              time="16:00"
              countdown="In 6h 18m"
              tag={{ label: "Onboarding", tone: "pink" }}
              titleParts={{
                before: "2 New Founding Members",
                after: "Welcome Ceremony",
              }}
              title=""
              detail="Terrace · Media team on standby"
              action="Brief"
            />
            <PriorityScheduleItem
              time="19:00"
              countdown="In 9h 18m"
              tag={{ label: "Off-site Event", tone: "purple" }}
              titleParts={{
                before: "Auction Day",
                after: "Yas Marina Circuit",
              }}
              title=""
              detail="Headcount lock 12:00 · 8 vehicles confirmed"
              action="Manage"
            />
            <PriorityScheduleItem
              time="18:00"
              countdown="In 8h 18m"
              tag={{ label: "Workshop", tone: "teal" }}
              titleParts={{
                before: "Workshop Closes",
                after: "3 Vehicles to Return",
              }}
              title=""
              detail="Bay 04 · Parts arriving today"
              action="Status"
            />
          </section>
        </div>

        <section
          ref={criticalAlertsRef}
          id="critical-alerts"
          className={`${criticalAlertsPanelClass} scroll-mt-6`}
        >
          <OverviewSectionHeader
            titleSplit={{ before: "Critical", after: "Alerts" }}
            title=""
            divider
          />
          <div>
            <CriticalAlertItem
              tone="critical"
              typeLabel="Critical"
              status="12d overdue"
              title="Ferrari 296 — major service"
              description="Major service window missed. Member Mitchell awaiting return."
              icon={<AlertTriangle color="#E57373" className="size-4" />}
            />
            <CriticalAlertItem
              tone="payment"
              typeLabel="Payment"
              status="2x failed"
              title="No. 0003847 — auto-renewal failed"
              description="Second failure on quarterly fee. Membership office contacting."
              icon={<Dollar color="#F0A0A0" className="size-4" />}
            />
            <CriticalAlertItem
              tone="warning"
              typeLabel="Warning"
              status="2h ago"
              title="Bay 04A · climate fault"
              description="Temperature out of range. Maintenance dispatched."
              icon={
                <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden>
                  <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.25" />
                  <path
                    d="M8 4.75v4"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                  />
                  <circle cx="8" cy="11" r="0.75" fill="currentColor" />
                </svg>
              }
            />
            <CriticalAlertItem
              tone="purple"
              typeLabel="Steve"
              status="15m"
              title="Anomaly · Mitchell pattern"
              description="4x summon frequency this week vs avg 1.2x. Wellbeing check."
              icon={
                <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden>
                  <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.25" />
                </svg>
              }
            />
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div>
          <OverviewOutsideHeader
            titleSplit={{ before: "Concierge", after: "Queue" }}
            title=""
            subtitle="14 open · 3 urgent · avg 4m 12s"
          />
          <section className={overviewPanelClass}>
            <OpenRequestsTable rows={openRequests} />
          </section>
        </div>

        <section className={overviewPanelClass}>
          <OverviewSectionHeader
            titleSplit={{ before: "Staff on", after: "Shift" }}
            title=""
            trailing="12 / 14"
          />
          <StaffOnShiftList rows={staffOnShift} />
        </section>

        <div>
          <OverviewOutsideHeader
            titleSplit={{ before: "Recent", after: "Activity" }}
            title=""
            subtitle="Last 60 minutes · 23 events"
          />
          <section className={overviewPanelClass}>
            <div>
            <RecentActivityItem
              time="09:42"
              icon={<ActivityChat className="size-3.5" />}
              iconTone="gold"
              category="Concierge"
            >
              <ActivityHighlight>JAMES</ActivityHighlight> confirmed Ghost summon for{" "}
              <ActivityHighlight>Alex Mitchell</ActivityHighlight>
            </RecentActivityItem>
            <RecentActivityItem
              time="09:38"
              icon={<ActivityAI className="size-3.5" />}
              iconTone="purple"
              category="AI · Auto"
            >
              <ActivityHighlight>STEVE</ActivityHighlight> auto-classified 3 new requests
            </RecentActivityItem>
            <RecentActivityItem
              time="09:35"
              icon={<ActivityCheck className="size-3.5" />}
              iconTone="teal"
              category="Workshop"
            >
              <ActivityHighlight>MARCO</ActivityHighlight> confirmed delivery for international
              wheels
            </RecentActivityItem>
            <RecentActivityItem
              time="09:31"
              icon={<ActivityUser className="size-3.5" />}
              iconTone="gold"
              category="Member · VIP"
            >
              <ActivityHighlight>Al-Farsi</ActivityHighlight> onboarding started · 6 steps remaining
            </RecentActivityItem>
            <RecentActivityItem
              time="09:28"
              icon={<ActivityKey className="size-3.5" />}
              iconTone="gold"
              category="Vehicles"
            >
              Bay 07 assigned to McLaren Artura · <ActivityHighlight>Sophia</ActivityHighlight>
            </RecentActivityItem>
            <RecentActivityItem
              time="08:32"
              icon={<AlertTriangle color="#E57373" className="size-3.5" />}
              iconTone="pink"
              category="Auto · Critical"
              categoryTone="critical"
            >
              System flagged <ActivityHighlight>Ferrari 296</ActivityHighlight> overdue 12 days ·
              auto-escalated
            </RecentActivityItem>
            </div>
          </section>
        </div>

        <section className={`${overviewPanelClass} bg-[#12110f]`}>
          <OverviewSectionHeader
            titleSplit={{ before: "Today's", after: "Schedule" }}
            title=""
            trailing="Sat 9 May"
          />
          <ScheduleTimeline>
              <ScheduleTimelineItem
                time="06:00"
                title="Workshop opens · pre-flight"
                detail="Marco · 6 vehicles"
                state="completed"
              />
              <ScheduleTimelineItem
                time="08:00"
                title="Clubhouse breakfast"
                detail="4 reservations"
                state="completed"
              />
              <ScheduleTimelineItem
                time="09:42"
                title="Active · queue review"
                statusLabel="In progress"
                state="active"
              />
              <ScheduleTimelineItem
                time="12:00"
                title="Auction headcount lock"
                detail="Events team"
              />
              <ScheduleTimelineItem
                time="14:30"
                title="VIP · Al Mansoori"
                detail="Suite 02 · driver"
              />
              <ScheduleTimelineItem
                time="16:00"
                title="New member onboarding"
                detail="2 founding"
              />
              <ScheduleTimelineItem
                time="19:00"
                title="Auction Day · off-site"
                detail="Yas Marina · 18 mem"
              />
            </ScheduleTimeline>
        </section>
      </div>
    </div>
  );
}
