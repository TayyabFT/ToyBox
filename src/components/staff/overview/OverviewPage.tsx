import {
  ActionCamera,
  ActionCheckbox,
  ActionMessage,
  AlertTriangle,
  Car,
  ChartBars,
  ClockSmall,
  DeliveryTruck,
  FileReport,
  Message,
  ShieldCheck,
  StatSunburst,
  Thermometer,
  Umbrella,
  UsersGroup,
} from "@/components/common/Svgs";
import { ActionCard } from "./ActionCard";
import { AssignmentCard } from "./AssignmentCard";
import { OverviewGreeting } from "./OverviewGreeting";
import { PriorityTaskItem } from "./PriorityTaskItem";
import { ScheduleItem } from "./ScheduleItem";
import { SectionHeader } from "./SectionHeader";
import { ShiftStatRow } from "./ShiftStatRow";
import { StaffDutyItem } from "./StaffDutyItem";
import { StatCard } from "./StatCard";
import { SystemAlertItem } from "./SystemAlertItem";

export function OverviewPage() {
  return (
    <div className="space-y-8 p-8">
      <OverviewGreeting />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-4">
        <StatCard
          label="Members in Club"
          value="142"
          subtext="↑ 8 since yesterday"
          icon={<UsersGroup />}
        />
        <StatCard
          label="Vehicles Stored"
          value="287"
          subtext="3 pending intake"
          icon={<Car />}
        />
        <StatCard
          label="Open Requests"
          value="11"
          subtext="2 critical now"
          icon={<StatSunburst />}
        />
        <StatCard
          label="Storage Occupancy"
          value="94%"
          subtext="18 bays available"
          icon={<ChartBars />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ActionCard
          title="Inspections"
          subtitle="4 pending"
          icon={<ActionCheckbox />}
        />
        <ActionCard
          title="Photo Uploads"
          subtitle="6 pending upload"
          icon={<ActionCamera />}
        />
        <ActionCard
          title="Concierge"
          subtitle="2 unread chats"
          icon={<ActionMessage />}
        />
        <ActionCard
          title="Confirmations"
          subtitle="2 await signature"
          icon={<ActionCheckbox />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="col-span-2 rounded-2xl border border-[#D4A8471A] bg-surface p-5">
          <SectionHeader
            title="Priority Tasks · Today"
            badge={{ label: "3 urgent", tone: "red" }}
          />

          <div className="space-y-2">
            <PriorityTaskItem
              index="01"
              title="VIP Arrival — Rolls-Royce Cullinan"
              detail="A. Al-Rashidi · Prepare Bay 03-A · Priority Arrival"
              time="14:30"
              iconTone="pink"
              icon={<AlertTriangle color="var(--pink)" />}
            />
            <PriorityTaskItem
              index="02"
              title="Tyre Pressure Warning — Ferrari 488 GTB"
              detail="Bay 11-C · Front Right at 28 PSI — Inspection Required"
              status={{ label: "Now", tone: "green" }}
              iconTone="pink"
              icon={<ClockSmall color="var(--pink)" />}
            />
            <PriorityTaskItem
              index="03"
              title="Transport Request — Porsche 911 GT3"
              detail="M. Hassan · Delivery to DIFC Gate Village 3"
              time="16:00"
              iconTone="pink"
              icon={<DeliveryTruck color="var(--pink)" />}
            />
            <PriorityTaskItem
              index="04"
              title="Full Detail — Lamborghini Urus S"
              detail="Bay 07-B · Started 10:00 · Est. Completion 14:00"
              status={{ label: "In Progress", tone: "green" }}
              iconTone="gold"
              icon={<Umbrella color="var(--accent)" />}
            />
            <PriorityTaskItem
              index="05"
              title="Monthly Health Reports Due"
              detail="12 Vehicles Pending Report · Submit Before End of Shift"
              time="17:00"
              iconTone="blue"
              icon={<FileReport color="#7EB0D8" />}
            />
            <PriorityTaskItem
              index="06"
              title="Pre-Handover Inspection — Aston Martin DBS"
              detail="Bay 05-A · Vehicle Ready for Member Collection"
              time="08:30"
              iconTone="teal"
              icon={<ShieldCheck color="var(--teal)" />}
            />
          </div>
        </section> 

        <section className="rounded-2xl border border-[#D4A8471A] bg-surface p-5">
          <SectionHeader title="Today's Schedule" trailing="8 events" />

          <div className="space-y-3">
            <ScheduleItem
              time="07:00"
              title="Shift Start — Walkthrough"
              detail="Main floor · All bays"
            />
            <ScheduleItem
              time="09:30"
              title="VIP Vehicle Prep"
              detail="Bay 03-A · Rolls-Royce Cullinan"
            />
            <ScheduleItem
              time="11:00"
              title="New Vehicle Intake"
              detail="Porsche 911 GT3 · Bay 05"
            />
            <ScheduleItem
              time="13:00"
              title="Lunch Break"
              detail="Staff lounge"
            />
            <ScheduleItem
              time="14:30"
              title="Member Arrival"
              detail="A. Al-Rashidi · VIP lounge"
            />
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-[#D4A8471A] bg-surface p-5">
          <SectionHeader
            title="System Alerts"
            badge={{ label: "2 critical", tone: "red" }}
          />

          <div className="space-y-2.5">
            <SystemAlertItem
              message="Tyre pressure low — Ferrari 488 GTB"
              time="2m ago"
              icon={<AlertTriangle color="var(--pink)" />}
            />
            <SystemAlertItem
              message="Climate alert — Bay 12-C temperature rising"
              time="8m ago"
              icon={<Thermometer color="#D89999" />}
            />
            <SystemAlertItem
              message="Member request pending — Concierge chat"
              time="15m ago"
              icon={<Message active />}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-[#D4A8471A] bg-surface p-5">
          <SectionHeader
            title="Staff on Duty"
            badge={{ label: "5 active", tone: "green" }}
          />

          <div className="space-y-2.5">
            <StaffDutyItem
              initial="K"
              name="Kathrine M. (You)"
              role="Senior Operative"
              avatarClass="bg-gradient-to-b from-[#F0C566] to-[#8B6F2A] text-dark"
              statusTone="green"
              highlight
            />
            <StaffDutyItem
              initial="M"
              name="Marcus T."
              role="Floor Supervisor"
              avatarClass="bg-[#4A7C9E] text-foreground"
              statusTone="green"
            />
            <StaffDutyItem
              initial="S"
              name="Sofia R."
              role="Detailing Specialist"
              avatarClass="bg-[#9E6B8A] text-foreground"
              statusTone="green"
            />
            <StaffDutyItem
              initial="J"
              name="James L."
              role="Intake Officer"
              avatarClass="bg-[#6B5B9E] text-foreground"
              statusTone="gold"
            />
            <StaffDutyItem
              initial="A"
              name="Amir H."
              role="Concierge Lead"
              avatarClass="bg-[#5B8A72] text-foreground"
              statusTone="green"
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-[#D4A8471A] bg-surface p-5">
            <SectionHeader title="Shift Stats" trailing="Morning" />

            <div>
              <ShiftStatRow label="Tasks Completed" value="8 / 14" />
              <ShiftStatRow label="Vehicles Moved" value="6" />
              <ShiftStatRow label="Inspections Done" value="3 / 4" />
              <ShiftStatRow label="Photos Uploaded" value="12 / 18" />
              <ShiftStatRow label="Avg Response Time" value="4.2 min" />
            </div>
          </div>

          <AssignmentCard />
        </section>
      </div>
    </div>
  );
}
