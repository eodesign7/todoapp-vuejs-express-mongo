import { reactive } from "vue";
import type { useWorkspaceStore } from "@/stores/projects";
import type { ProjectFormShape, TaskFormShape } from "@/types/todoForms";
import { timeStringToISO } from "@/utils/todoHelpers";

type WorkspaceStore = ReturnType<typeof useWorkspaceStore>;

interface UseTodoFormsOptions {
    workspace: WorkspaceStore;
    defaultColor: string;
}

export const useTodoForms = ({ workspace, defaultColor }: UseTodoFormsOptions) => {
    const projectForm = reactive<ProjectFormShape>({
        name: "",
        description: "",
        color: defaultColor,
    });

    const taskForm = reactive<TaskFormShape>({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
    });

    const resetProjectForm = () => {
        projectForm.name = "";
        projectForm.description = "";
        projectForm.color = defaultColor;
    };

    const resetTaskForm = () => {
        taskForm.title = "";
        taskForm.description = "";
        taskForm.startTime = "";
        taskForm.endTime = "";
    };

    const submitProjectForm = async () => {
        if (!projectForm.name.trim()) return false;
        await workspace.createProject({
            name: projectForm.name.trim(),
            description: projectForm.description.trim() || undefined,
            color: projectForm.color,
        });
        resetProjectForm();
        return true;
    };

    const submitTaskForm = async (projectId: string | null) => {
        if (!projectId || !taskForm.title.trim()) return false;
        await workspace.createTask(projectId, {
            title: taskForm.title.trim(),
            description: taskForm.description.trim() || undefined,
            startTime: timeStringToISO(taskForm.startTime),
            endTime: timeStringToISO(taskForm.endTime),
        });
        resetTaskForm();
        return true;
    };

    return {
        projectForm,
        taskForm,
        resetProjectForm,
        resetTaskForm,
        submitProjectForm,
        submitTaskForm,
    };
};


