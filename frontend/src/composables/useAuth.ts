import { ref } from "vue";
import { useRouter } from "vue-router";
import { ensureAuthenticated } from "@/lib/ensureAuth";
import { useAuthStore } from "@/stores/auth";

type AuthMode = "login" | "register";

export const useAuthRedirect = () => {
    const router = useRouter();
    const auth = useAuthStore();

    const redirectToDashboardIfAuthenticated = async () => {
        if (!auth.user && auth.token) {
            await auth.fetchMe();
        }

        if (auth.isAuthenticated) {
            router.push("/dashboard");
        }
    };

    const ensureRouteAuth = async () => {
        const ok = await ensureAuthenticated();
        if (!ok) router.push("/");
        return ok;
    };

    return {
        redirectToDashboardIfAuthenticated,
        ensureRouteAuth,
    };
};

export const useAuthForm = (mode: AuthMode) => {
    const email = ref("");
    const password = ref("");
    const loading = ref(false);
    const error = ref("");

    const router = useRouter();
    const auth = useAuthStore();

    const defaultError =
        mode === "login"
            ? "Prihlásenie zlyhalo. Skús to znova."
            : "Registrácia zlyhala. Skús to znova.";

    const submit = async () => {
        error.value = "";
        loading.value = true;

        try {
            const action =
                mode === "login"
                    ? auth.login.bind(auth)
                    : auth.register.bind(auth);

            await action(email.value, password.value);
            const ok = await ensureAuthenticated();
            if (ok) router.push("/dashboard");
        } catch (err: any) {
            error.value = err?.response?.data?.message ?? defaultError;
        } finally {
            loading.value = false;
        }
    };

    return {
        email,
        password,
        loading,
        error,
        submit,
    };
};
