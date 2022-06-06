import Axios from "axios";
import { makeAutoObservable, toJS } from "mobx";
import agent from "../api/agent";

export interface UserDetails {
  id: number;
  name: string;
  org: string;
  doj: string;
}
export interface TaskList {
  id: number;
  filled: boolean;
  initials: string;
  details: UserDetails | {};
}
export default class User_TaskStore {
  userDetails: UserDetails[] = [];
  taskList: TaskList[] = [
    {
      id: 1,
      filled: false,
      initials: "",
      details: {},
    },
    {
      id: 2,
      filled: false,
      initials: "",
      details: {},
    },
    {
      id: 3,
      filled: false,
      initials: "",
      details: {},
    },
    {
      id: 4,
      filled: false,
      initials: "",
      details: {},
    },
    {
      id: 5,
      filled: false,
      initials: "",
      details: {},
    },
    {
      id: 6,
      filled: false,
      initials: "",
      details: {},
    },
    {
      id: 7,
      filled: false,
      initials: "",
      details: {},
    },
  ];
  loading = false;
  updating = false;

  constructor() {
    makeAutoObservable(this);
  }

  get userDetailsList() {
    return toJS(this.userDetails);
  }

  get taskDetailsList() {
    return toJS(this.taskList);
  }
  loadUserDetails = async () => {
    this.setLoading(true);
    try {
      const { data } = await Axios.get("http://nagarro.test.com:8000/userlist");
      let arry = data.data.map((val: any) => {
        let obj: UserDetails = {
          id: val.empID,
          name: val.empName,
          org: val.empOrg,
          doj: val.empDOJ,
        };
        return obj;
      });

      this.setUserList(arry);
      this.setLoading(false);
    } catch (error) {
      console.log(error);
      this.setLoading(false);
    }
  };

  updateUserDetails = async (list: UserDetails[]) => {
    this.setUpdating(true);
    try {
      ////api logic to update user details table
      //
      //

      this.setUserList(list);
      this.setUpdating(false);
    } catch (error) {
      console.log(error);
      this.setUpdating(false);
    }
  };

  loadTaskDetails = async () => {};

  updateTaskDetails = async (list: TaskList[]) => {
    this.setUpdating(true);
    try {
      ////api logic to update user details table
      //
      //

      this.setTaskList(list);
      this.setUpdating(false);
    } catch (error) {
      console.log(error);
      this.setUpdating(false);
    }
  };

  private setUserList(list: UserDetails[]) {
    this.userDetails = list;
  }

  private setTaskList(list: TaskList[]) {
    this.taskList = list;
  }

  private setLoading(loading: boolean) {
    this.loading = loading;
  }

  private setUpdating(updating: boolean) {
    this.updating = updating;
  }
}
