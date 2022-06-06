import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import ModalStore from "./modalStore";
import UserStore from "./userStore";
import EmployeeStore from "./employeeStore";
import User_TaskStore from "./user_taskStore";

interface Store {
  empStore: EmployeeStore;
  commonStore: CommonStore;
  userStore: UserStore;
  modalStore: ModalStore;
  user_taskStore: User_TaskStore;
}

export const store: Store = {
  empStore: new EmployeeStore(),
  commonStore: new CommonStore(),
  userStore: new UserStore(),
  modalStore: new ModalStore(),
  user_taskStore: new User_TaskStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
