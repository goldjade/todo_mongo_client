import React from "react";
import ListItem from "./ListItem";

const List = React.memo( ({ todoData, setTodoData, deleteClick}) => {
  // console.log("List Rendering...")
  return (
    <div>
      {todoData.map((item) => (
        // item = { id: 1, title: "할일 1", completed: false },

        <div key={item.id}>
          <ListItem item={item} todoData ={todoData} setTodoData ={setTodoData} deleteClick={deleteClick}/>
        </div>
      ))}
    </div>
  );
});

export default List;
