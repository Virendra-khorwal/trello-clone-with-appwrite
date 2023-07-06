import { ID, database, storage } from '@/appwrite';
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import uploadImage from '@/lib/uploadImage';
import { create } from 'zustand';

interface BoardState {
    board: Board;
    getBoard: () => void;
    setBoardState: (board: Board) => void;
    updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
    searchString: string;
    newTaskInput: string;
    newTaskType: TypedColumn;
    image: File | null;
    addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
    setNewTaskType: (newTaskType: TypedColumn) => void;
    setNewTaskInput: (newTaskInput: string) => void;
    setSearchString: (searchString: string) => void;
    deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void;
    setImage: (image: File | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
    board: {
        columns: new Map<TypedColumn, Column>(),
    },
    searchString: '',
    newTaskInput: '',
    newTaskType: 'todo',
    image: null,
    addTask: async (todo, columnId, image) => {
        let file: Image | undefined;
        if (image) {
            const fileUploaded = await uploadImage(image);
            if(fileUploaded) {
                file = {
                    bucketID: fileUploaded.bucketId,
                    fileId: fileUploaded.$id,
                }
            }
        }

        const { $id } = await database.createDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            ID.unique(),
            {
                title: todo,
                status: columnId,
                ...(file && { image: JSON.stringify(file) })
            }
        )

        set({newTaskInput: ''});
        set((state) => {
            const newColumns = new Map(state.board.columns);

            const newTodo: Todo = {
                $id,
                $createdAt: new Date().toISOString(),
                title: todo,
                status: columnId,
                ...(file && { image: file })
            }

            const column = newColumns.get(columnId);

            if(!column) {
                newColumns.set(columnId, {
                    id: columnId,
                    todos: [newTodo],
                });
            } else {
                newColumns.get(columnId)?.todos.push(newTodo);
            }

            return {
                board: {
                    columns: newColumns,

                }
            }
        })
    },
    setImage: (image) => set({ image }),
    setNewTaskType: (newTaskType) => set({ newTaskType }),
    setNewTaskInput: (newTaskInput) => set({ newTaskInput }),
    setSearchString: (searchString) => set({ searchString }),
    getBoard: async () => {
        const board = await getTodosGroupedByColumn();
        set({ board });
    },
    setBoardState: (board) => set({ board }),

    deleteTask: async (taskIndex, todo, id) => {
        const newColumns = new Map(get().board.columns);

        // delete todoId from newColumns
        newColumns.get(id)?.todos.splice(taskIndex, 1);

        set({ board: { columns: newColumns } });
        if (todo.image) {
            await storage.deleteFile(todo.image.bucketID, todo.image.fileId)
        }

        await database.deleteDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id
        )
    },

    updateTodoInDB: async (todo, columnId) => {
        await database.updateDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id,
            {
                title: todo.title,
                status: columnId,
            }
        )
    }
}));