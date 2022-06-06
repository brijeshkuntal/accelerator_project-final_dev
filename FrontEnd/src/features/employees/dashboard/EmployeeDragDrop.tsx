import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { Grid, Ref, Table } from "semantic-ui-react";
import { useWindowSize } from "../../../app/common/hooks/screenSize";
import { useStore } from "../../../app/stores/store";
import "./EmployeeDragDrop.scss";

interface Props {}

/* const userData = [
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
]; */

/* const taskItemsList = [
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
]; */

/* const task2ItemList = [
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
]; */

export default observer(function EmployeeDragDrop(props: Props) {
  const { user_taskStore } = useStore();
  const {
    loadUserDetails,
    userDetailsList,
    taskDetailsList,
    loading,
    updateUserDetails,
    updateTaskDetails,
    updating,
  } = user_taskStore;

  const screenSize = useWindowSize();
  const columnsPerRow = screenSize === "mobile" ? 3 : 4;

  useEffect(() => {
    console.log("test");
    loadUserDetails();
  }, []);

  const getNameInitials = (name: string): string => {
    let ar = name.split(" ");
    if (ar.length > 1)
      return ar[0].substring(0, 1) + ar[ar.length - 1].substring(0, 1);
    else return ar[0].substring(0, 1);
  };

  const handleDragEnd = (results: DropResult) => {
    let tempList = userDetailsList;
    const { source, destination } = results;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.droppableId === "user-data-drop"
    )
      return;

    if (destination.droppableId === "user-data-drop") {
      let dropData: any = taskDetailsList[source.index].details;
      if (dropData) {
        tempList.splice(destination.index, 0, dropData);
        updateUserDetails(tempList);
        let filteredTaskList = taskDetailsList.map(
          (val: any, index: number) => {
            if (index === source.index) {
              return {
                ...val,
                filled: false,
                initials: "",
                details: {},
              };
            } else {
              return val;
            }
          }
        );
        updateTaskDetails(filteredTaskList);
      }
    }

    if (destination.droppableId.includes("drop-QA-")) {
      if (source.droppableId === "user-data-drop") {
        let dragData = tempList[source.index];
        if (
          dragData &&
          taskDetailsList[destination.index] &&
          !taskDetailsList[destination.index].filled
        ) {
          let filteredTaskList = taskDetailsList.map(
            (val: any, index: number) => {
              if (index === destination.index && !val.filled) {
                return {
                  ...val,
                  filled: true,
                  initials: getNameInitials(dragData.name),
                  details: dragData,
                };
              }
              return { ...val };
            }
          );
          updateTaskDetails(filteredTaskList);
          tempList.splice(source.index, 1);
          updateUserDetails(tempList);
        }
      }
      if (source.droppableId.includes("drop-QA-")) {
        let dragData: any = taskDetailsList[source.index];
        if (
          dragData &&
          taskDetailsList[destination.index] &&
          !taskDetailsList[destination.index].filled
        ) {
          let dropData: any = taskDetailsList[source.index].details;
          let tempList = taskDetailsList.map((val, index) => {
            if (index === source.index) {
              return {
                ...val,
                filled: false,
                initials: "",
                details: {},
              };
            }
            if (index === destination.index) {
              return {
                ...val,
                filled: true,
                initials: getNameInitials(dropData.name),
                details: dropData,
              };
            }

            return { ...val };
          });
          updateTaskDetails(tempList);
        }
      }
    }
    /* else if (destination.droppableId.includes("drop-Developer-")) {
      if (source.droppableId === "user-data-drop") {
        let dragData = tempList[source.index];
        if (
          dragData &&
          taskList2[destination.index] &&
          !taskList2[destination.index].filled
        ) {
          let filteredList = taskList2.map((val: any, index: number) => {
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
          setTask2List(filteredList);
          tempList.splice(source.index, 1);
          updateUserDetails(tempList);
        }
      }

      if (source.droppableId.includes("drop-QA-")) {
        let dragData: any = taskList[source.index];
        if (
          dragData &&
          taskList2[destination.index] &&
          !taskList2[destination.index].filled
        ) {
          let filteredList = taskList2.map((val: any, index: number) => {
            if (index === destination.index && !val.details.id) {
              return {
                ...val,
                filled: true,
                initials: getNameInitials(dragData.details.name),
                details: dragData.details,
              };
            }
            return { ...val };
          });
          setTask2List(filteredList);

          filteredList = taskList.map((val: any) => {
            if (val.id === dragData.id) {
              return {
                ...val,
                filled: false,
                initials: "",
                details: {},
              };
            }
            return { ...val };
          });
          updateTaskDetails(filteredList);
        }
      }
    } */
  };

  const renderColumns = (data: any[], taskName: string) => {
    let renderData: any;
    let columnCount = screenSize === "mobile" ? 3 : 4;

    const res = [];
    for (let i = 0; i < data.length; i += columnCount) {
      const chunk = data.slice(i, i + columnCount);
      res.push(chunk);
    }

    renderData = res.map((row: any, rowIndex: number) => {
      return (
        <Droppable
          droppableId={`drop-${taskName}-${rowIndex}`}
          direction="horizontal"
          key={rowIndex}
        >
          {(provided, snapshot) => (
            <Ref innerRef={provided.innerRef}>
              <Grid.Row {...provided.droppableProps}>
                {row.map((column: any, columnIndex: number) => {
                  return (
                    <Grid.Column index={columnIndex}>
                      <div className="task-item">
                        <Draggable
                          draggableId={`drag-${taskName}-${column.id}`}
                          index={column.id - 1}
                        >
                          {(provided, snapshot) => (
                            <div
                              className={`task-item-details ${
                                column.filled ? "filled" : ""
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
                              {column.initials}
                            </div>
                          )}
                        </Draggable>
                      </div>
                    </Grid.Column>
                  );
                })}
              </Grid.Row>
            </Ref>
          )}
        </Droppable>
      );
    });
    return renderData;
  };

  if (loading) return <>Loading......</>;

  return (
    <>
      <DragDropContext
        onDragEnd={(results: DropResult) => handleDragEnd(results)}
      >
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Organisation</Table.HeaderCell>
              <Table.HeaderCell>Date of Joining</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Droppable droppableId="user-data-drop">
            {(provided) => (
              <Ref innerRef={provided.innerRef}>
                <Table.Body {...provided.droppableProps}>
                  {userDetailsList &&
                    userDetailsList.map((user: any, index: number) => (
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
                              <Table.Cell>{user.org}</Table.Cell>
                              <Table.Cell>{user.doj}</Table.Cell>
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

        <Grid>
          <Grid.Column width={6}>
            <Grid columns={columnsPerRow}>
              {renderColumns(taskDetailsList, "QA")}
            </Grid>
          </Grid.Column>
          <Grid.Column width={2}></Grid.Column>
          {/* <Grid.Column width={6}>
            <Grid columns={columnsPerRow}>
              {renderColumns(taskDetailsList, "Developer")}
            </Grid>
          </Grid.Column> */}
        </Grid>
      </DragDropContext>
    </>
  );
});
