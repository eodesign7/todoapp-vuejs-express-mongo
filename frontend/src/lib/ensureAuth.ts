import { router } from "@/routes";
import { useAuthStore } from "@/stores/auth";


export const ensureAuthenticated = async (redirectPath: string = "/login"): Promise<boolean> => {
    const auth = useAuthStore();
    // ak už je user načítaný a je prihlásený, nič nerob
    if (auth.isAuthenticated) return true;

    // ak máme token, skús načítať používateľa
    if (auth.token && !auth.user) {
        await auth.fetchMe();
        if (auth.isAuthenticated) return true;
    }

    // nič nevyšlo → presmeruj na home
    router.push(redirectPath);
    return false;
};