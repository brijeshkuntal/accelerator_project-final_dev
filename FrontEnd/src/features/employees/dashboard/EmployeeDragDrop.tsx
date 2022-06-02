import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { Grid, Ref, Table } from "semantic-ui-react";
import "./EmployeeDragDrop.scss";

interface Props {}

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
    initials: undefined,
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
];

export default observer(function EmployeeDragDrop(props: Props) {
  const [userList, setUserList] = useState(userData);
  const [taskList, setTaskList] = useState(taskItemsList);

  const getNameInitials = (name: string): string => {
    let ar = name.split(" ");
    if (ar.length > 1)
      return ar[0].substring(0, 1) + ar[ar.length - 1].substring(0, 1);
    else return ar[0].substring(0, 1);
  };

  const handleDragEnd = (results: DropResult) => {
    const { source, destination } = results;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    if (destination.droppableId === "task-data-drop") {
      let dragData = userList[source.index];
      if (dragData && !taskList[destination.index].filled) {
        setTaskList((prevList: any) => {
          let newList = JSON.parse(JSON.stringify(prevList));
          newList = newList.map((val: any, index: number) => {
            if (index === destination.index && !val.details.id) {
              return {
                ...val,
                filled: true,
                initials: getNameInitials(dragData?.name || ""),
                details: dragData,
              };
            }
            return { ...val };
          });

          return newList;
        });
        userList.splice(source.index, 1);
      }
    }
    if (destination.droppableId === "user-data-drop") {
      let dropData: any = taskList[source.index].details;
      if (dropData) {
        userList.splice(destination.index, 0, dropData);
        let filteredTaskList = taskList.map((val: any, index: number) => {
          if (index === source.index) {
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
      }
    }
  };

  return (
    <>
      <DragDropContext
        onDragEnd={(results: DropResult) => handleDragEnd(results)}
      >
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Droppable droppableId="user-data-drop">
            {(provided) => (
              <Ref innerRef={provided.innerRef}>
                <Table.Body {...provided.droppableProps}>
                  {userList.map((user: any, index: number) => (
                    <Draggable
                      draggableId={`user-data-drag-${user.id.toString()}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Ref innerRef={provided.innerRef}>
                          <Table.Row
                            className={
                              snapshot.isDragging ? "row-drag-start" : ""
                            }
                            key={index}
                            id={user.name}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Table.Cell>{user.name}</Table.Cell>
                            <Table.Cell>{user.desc}</Table.Cell>
                            <Table.Cell>{user.status}</Table.Cell>
                          </Table.Row>
                        </Ref>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Table.Body>
              </Ref>
            )}
          </Droppable>
        </Table>
        <Droppable droppableId={`task-data-drop`} direction="horizontal">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <Grid>
                {taskList.map((task: any, index: number) => (
                  <Grid.Column width={2}>
                    <div
                      className="task-item"
                      key={index}
                      id={task.id.toString()}
                    >
                      <Draggable
                        draggableId={`task-data-drag-${task.id.toString()}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            className={`task-item-details ${
                              task.filled ? "filled" : ""
                            }`}
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            style={{
                              ...(snapshot.isDragging
                                ? provided.draggableProps.style
                                : ""),
                            }}
                          >
                            {task.initials}
                          </div>
                        )}
                      </Draggable>
                    </div>
                  </Grid.Column>
                ))}
              </Grid>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
});
