import { makeAutoObservable, runInAction, toJS } from "mobx";
import agent from "../api/agent";
import { Employee } from "../models/employee";
import { toast } from "react-toastify";
import { create_employee,delete_employee, get_all_Employees, get_employee, update_employee } from "../common/query/query";

export default class EmployeeStore {
    employeeRegistry = new Map<number, Employee>();
    selectedEmployee: Employee |undefined =undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;
    constructor() {
        makeAutoObservable(this)
    }

    // sort employee list by DOJ
    get employeesByDate() {
        return Array.from(this.employeeRegistry.values())
       .sort((a, b) =>
       a.empDOJ!.getDate()-b.empDOJ!.getDate()
       )
    }

    // grouping employee according to DOJ
    get groupedEmployee() {
        return Object.entries(
            this.employeesByDate.reduce((employees,employee) => {
                const date = this.convertDate(employee.empDOJ);
                employees[date] = employees[date] ? [...employees[date], employee] : [employee];
                return employees;
            }, {} as {[key: string]: Employee[]})
        )
    }

    // to call api for all employees & store them in registry
    loadEmployees = async () => {
        const get_all_Employees_Query = {"query":  get_all_Employees };
        this.loadingInitial = true;
        try {
            const employees = await agent.API.data(get_all_Employees_Query);
            employees.data.data.allEmployees.forEach((employee: Employee) => {
                this.setEmployee(employee);
            })
            this.setLoadingInitial(false);
        } catch (error) {
             console.log(error);
             this.setLoadingInitial(false);
        }
    }

        // to call api to get single employee by its ID
    loademployee = async (id: number) => {
       let employee = this.getEmloyee(id);
        if (employee) {
            this.selectedEmployee = employee;
            return employee;
        } else {
            this.loadingInitial = true;
            const  get_Employee_Query={
                "query": get_employee,
                      "variables":{
                          "empID": id
                        }
                };
            try {
             const employee= await agent.API.data(get_Employee_Query);
              this.setEmployee(employee.data.data.employees[0]);
                runInAction(() => {
                    this.selectedEmployee=employee.data.data.employees[0];
                })
               this.setLoadingInitial(false);
               return employee.data.data.employees[0];
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
       }
    }

    // to set employee in registry
    private setEmployee = (employee: Employee) => {
        employee.empDOJ = new Date(employee.empDOJ!);
        this.employeeRegistry.set(employee.empID, employee);
    }

    // to get employee from registry by its ID
    private getEmloyee = (id: number) => {
    return this.employeeRegistry.get(id)
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    // convert data into format {yyyy-mm-dd}
    private convertDate(str:any) {           
        var date = new Date(str),
          mnth = ("0" + (date.getMonth() + 1)).slice(-2),
          day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
      }

     // to call create employee api 
    createEmployee = async (employee: Employee) => {
      const  create_Employee_Query={
        "query": create_employee,
              "variables":{
                  "empName": employee.empName,
                  "empCity": employee.empCity,
                  "empOfficeVenue": employee.empOfficeVenue,
                   "empDOJ": this.convertDate(employee.empDOJ),
                  "empDescription": employee.empDescription,                
                  "empCategory": employee.empCategory             
                }
        };
        this.loading = true;
        try {
          const emp= await agent.API.data(create_Employee_Query);
            runInAction(() => {
              this.employeeRegistry.set(emp.data.data.createEmployee.employee.empID, emp.data.data.createEmployee.employee);
               this.selectedEmployee = emp.data.data.createEmployee.employee;
                this.editMode = false;
                this.loading = false;
            })
            toast.success("Employee Created !")
            return emp.data.data.createEmployee.employee.empID;
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

     // to call update employee api 
    updateEmployee = async (employee: Employee) => {
        const  update_Employee_Query={
            "query":update_employee,
              "variables":{
                "empID": employee.empID,
                "empName": employee.empName,
                "empCity": employee.empCity,
                "empOfficeVenue": employee.empOfficeVenue,
                "empDOJ": this.convertDate(employee.empDOJ),
                "empDescription": employee.empDescription,                
                "empCategory": employee.empCategory             
              }
            };
        this.loading = true;
        try {
           await agent.API.data(update_Employee_Query);

            runInAction(() => {
                this.employeeRegistry.set(employee.empID, employee);
                this.selectedEmployee = employee;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

         // to call delete employee api 
    deleteemployee = async (id: number) => {
        this.loading = true;
        const  delete_Employee_Query={
            "query":delete_employee,
                  "variables":{
                      "empID": id
                    }
            };
    
        try {
         await agent.API.data(delete_Employee_Query);
            runInAction(() => {
                this.employeeRegistry.delete(id);
                this.loading = false;
            })
           toast.success("Employee Deleted !")
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }
}