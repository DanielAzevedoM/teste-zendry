import { useAuthStore } from "@/stores/authStore";
import { users } from "~/utils/fakeApi/mock-data";

export const userMe = () =>{
    const authStore = useAuthStore()
    const user = users.find(user => user.id === authStore.userId)
    return user
}