import type { Task } from "@/lib/interfaces";

const defaultTimeFormatter = new Intl.DateTimeFormat("sk-SK", {
    hour: "2-digit",
    minute: "2-digit",
});

export const timeStringToISO = (value?: string | null): string | undefined => {
    if (!value) return undefined;
    const [hoursPart, minutesPart] = value.split(":");
    const hours = Number(hoursPart);
    const minutes = Number(minutesPart);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return undefined;
    const base = new Date();
    base.setHours(hours, minutes, 0, 0);
    return base.toISOString();
};

export const formatTaskWindow = (
    task: Pick<Task, "startTime" | "endTime">,
    formatter: Intl.DateTimeFormat = defaultTimeFormatter,
): string => {
    if (task.startTime && task.endTime) {
        return `${formatter.format(new Date(task.startTime))} – ${formatter.format(
            new Date(task.endTime),
        )}`;
    }
    return "Flexibilné";
};

export const filterTasksByQuery = (tasks: Task[], rawQuery: string): Task[] => {
    const query = rawQuery.trim().toLowerCase();
    if (!query) return tasks;
    return tasks.filter(
        (task) =>
            task.title.toLowerCase().includes(query) ||
            (task.description ?? "").toLowerCase().includes(query),
    );
};

