'use client'

import { useBoardStore } from '@/store/BoardStore';
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from 'react-beautiful-dnd';

import {IoCloseCircle} from 'react-icons/io5'

type Props = {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}

const TodoCard = ({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps
}: Props) => {

  const deleteTask = useBoardStore(state => state.deleteTask)

  return (
    <div 
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      className='bg-white shadow-md rounded-md p-4 space-y-2'
    >
      <div className='flex justify-between items-center'>
        <h3 className='text-lg '>{todo.title}</h3>
        <button onClick={() => deleteTask(index,todo,id)} className='text-red-500 hover:text-red-600'>
          <IoCloseCircle className='ml-5 h-8 w-8' />
        </button>
      </div>
      {/* 
      ADD Image here
      */}
    </div>
  )
}

export default TodoCard