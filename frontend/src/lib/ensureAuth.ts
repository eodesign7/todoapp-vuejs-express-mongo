import { useAuthStore } from "@/stores/auth";

// Overí, či máme načítaného používateľa; vráti true keď je prihlásený.
export const ensureAuthenticated = async (): Promise<boolean> => {
    const auth = useAuthStore();
    // ak už je user načítaný a je prihlásený, nič nerob
    if (auth.isAuthenticated) return true;

    // ak máme token, skús načítať používateľa
    if (auth.token && !auth.user) {
        await auth.fetchMe();
        if (auth.isAuthenticated) return true;
    }

    return false;
};