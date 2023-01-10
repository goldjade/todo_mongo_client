/** @format */

import React from 'react';
import { useSelector } from 'react-redux';
import ListItem from './ListItem';
const List = React.memo(({ todoData, setTodoData, deleteClick }) => {
  // console.log('List Rendering...');
  const user = useSelector((state) => state.user);
  return (
    <div>
      {todoData.map(
        (item) =>
          item.author.uid === user.uid && (
            // item = { id: 1, title: "할일 1", completed: false },
            <div key={item.id}>
              <ListItem
                item={item}
                todoData={todoData}
                setTodoData={setTodoData}
                deleteClick={deleteClick}
              />
            </div>
          )
      )}
    </div>
  );
});

export default List;
