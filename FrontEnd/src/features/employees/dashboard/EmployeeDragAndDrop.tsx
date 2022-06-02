import { observer } from "mobx-react-lite";
import React, { useRef, useState } from "react";
import { Table } from "semantic-ui-react";

const userData = [
  {
    id: 1,
    name: "Brijesh Kuntal",
    desc: "description",
    status: "approved",
  },
  {
    id: 2,
    name: "Vijay",
    desc: "description",
    status: "approved",
  },
  {
    id: 3,
    name: "Shahvez Akhtar",
    desc: "description",
    status: "approved",
  },
  {
    id: 4,
    name: "Neeraj",
    desc: "description",
    status: "approved",
  },
];

const taskItemsList = [
  {
    id: 1,
    filled: false,
    initials: null,
    details: {},
  },
  {
    id: 2,
    filled: false,
    initials: null,
    details: {},
  },
  {
    id: 3,
    filled: false,
    initials: null,
    details: {},
  },
  {
    id: 4,
    filled: false,
    initials: null,
    details: {},
  },
  {
    id: 5,
    filled: false,
    initials: null,
    details: {},
  },
];

export default observer(function EmployeeDragAndDrop() {
  const [userList, setUserList] = useState(userData);
  const [taskList, setTaskList] = useState(taskItemsList);
  const dragNode = useRef();

  const dragStart = (event: any, user: {}) => {
    dragNode.current = event.target;
    event.dataTransfer.setData("text", JSON.stringify(user));
  };

  const allowDrag = (event: any) => {
    event.preventDefault();
  };

  const dropEnd = (event: any, index: number) => {
    let tableDropData = JSON.parse(event.dataTransfer.getData("text"));
    if (userList.filter((val) => val.id === tableDropData.id).length === 0) {
      /* let arr = JSON.parse(JSON.stringify(userList));
      arr.splice(index, 0, tableDropData);
      setUserList(arr); */

      setUserList((prevData) => [...prevData, tableDropData]);
    }

    let filteredTaskList = taskList.map((val: any) => {
      if (val.details.id === tableDropData.id) {
        return {
          ...val,
          filled: false,
          initials: null,
          details: {},
        };
      } else {
        return val;
      }
    });
    setTaskList(filteredTaskList);
  };

  const getNameInitials = (name: string): string => {
    let ar = name.split(" ");
    if (ar.length > 1)
      return ar[0].substring(0, 1) + ar[ar.length - 1].substring(0, 1);
    else return ar[0].substring(0, 1);
  };

  return (
    <>
      <Table celled inverted selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {userList.map((user, index) => (
            <Table.Row
              key={index}
              id={user.name}
              draggable
              onDragStart={(event: any) => dragStart(event, user)}
              onDragOver={(event: any) => {
                allowDrag(event);
              }}
              onDrop={(event: any) => dropEnd(event, index)}
            >
              <Table.Cell>{user.name}</Table.Cell>
              <Table.Cell>{user.desc}</Table.Cell>
              <Table.Cell>{user.status}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <div style={{ display: "flex" }}>
        {taskList.map((task, index) => (
          <div
            draggable={task.initials ? true : false}
            onDragStart={(e: any) => {
              dragNode.current = e.target;
              e.dataTransfer.setData("text", JSON.stringify(task.details));
            }}
            onDragOver={(e) => {
              dragNode.current !== e.target &&
                !task.filled &&
                e.preventDefault();
            }}
            onDrop={(e: any) => {
              let dataTransfer = JSON.parse(e.dataTransfer.getData("text"));
              const rs = userList.filter(
                (user) => user.name !== dataTransfer.name
              );
              setUserList(rs);
              setTaskList((prevList) => {
                let newList = JSON.parse(JSON.stringify(prevList));
                newList = newList.map((val: any, index: any) => {
                  if (val.id === Number(e.target.id)) {
                    return {
                      ...val,
                      filled: true,
                      initials: getNameInitials(dataTransfer.name),
                      details: dataTransfer,
                    };
                  }
                  if (val.details.id === dataTransfer.id) {
                    return {
                      ...val,
                      filled: false,
                      initials: null,
                      details: {},
                    };
                  }
                  return { ...val };
                });

                return newList;
              });
            }}
            key={index}
            id={task.id.toString()}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "50px",
              height: "50px",
              border: "1px solid black",
              marginRight: "5px",
              marginTop: "5px",
              borderRadius: "5px",
              backgroundColor: task.filled ? "blue" : "grey",
            }}
          >
            {task.initials && task.initials}
          </div>
        ))}
      </div>
    </>
  );
});
