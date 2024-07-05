/*

    Task manager se encarga de la logica

    propiedades:
    -- tareas del usuario -> { content: string, isCompleted: boolean}

    metodos privados:
    --validar tarea -> { valid: boolean, message: string }
    --buscar tarea -> indice de la tarea : number  || null
    --autoSaveTasks -> void

    metodos expuestos:
    --agregar tarea -> { success: boolean, message: string}
    --actualizar estado de una tarea -> return { success: bolean, taskIsCompleted : boolean}
    --eliminar una tarea -> return boolean


    --TODO: filtrar tareas -> return array


    TODO: Agregar una función que realize multiples validaciones al cargar las tareas
    provenientes de localStorage para evitar alteraciones
*/

let userTasks = JSON.parse(localStorage.getItem('userTasks')) || [];

const searchTask = taskContent => {
    const index = userTasks.findIndex(({content}) => content === taskContent);
    return (index !== -1) ? index : null ;
}

const isValidTask = task => {
    if(task.length < 5){
        return {
            valid : false,
            message : 'Tasks must contain at least 5 characters',
        }
    }

    if(task.length > 80){
        return {
            valid : false,
            message : 'Tasks must contain a maximum of 80 characters',
        }
    }

    if(searchTask(task) !== null){
        return{
            valid : false,
            message : 'The task already exists',
        }
    }

    return {
        valid: true,
        message: 'Task successfully added',
    };
}

const autoSaveTasks = () => localStorage.setItem('userTasks', JSON.stringify(userTasks));

export const addTask = taskContent => {
    const { valid, message } = isValidTask(taskContent);
    if(valid) {
        userTasks.push({content: taskContent, isCompleted : false});
        autoSaveTasks();
    };

    return {success : valid, message};
}

export const updateTaskStatus = taskContent => {
    const taskIndex = searchTask(taskContent);
    if(taskIndex === null) return {success : false};
    
    const task = userTasks[taskIndex];
    task.isCompleted = !task.isCompleted;
    autoSaveTasks();

    return { success : true, taskIsCompleted : task.isCompleted}
}

export const deleteTask = taskContent => {
    const taskIndex = searchTask(taskContent);
    if(taskIndex === null) return {success : false};
    
    userTasks.splice(taskIndex, 1);
    autoSaveTasks();

    return { success : true }
}

export const getTasksDatabase = () => JSON.parse(JSON.stringify(userTasks));

export const deleteAllCompletedTask = () => {
    const deletedTasksContent = [];
    const newTaskDatabase = [];

    userTasks.forEach(({content, isCompleted}) => {
        if(isCompleted) deletedTasksContent.push(content);
        else newTaskDatabase.push({content, isCompleted});
    })

    userTasks = newTaskDatabase;
    autoSaveTasks();

    return deletedTasksContent;
}

export const activeTasksCount = () => {
    return userTasks.reduce((acc, {isCompleted}) => acc + ((isCompleted) ? 0 : 1) , 0)
}
