
import { addTask, updateTaskStatus, deleteTask, getTasksDatabase, deleteAllCompletedTask, activeTasksCount } from "./task-manager.js";

/* todo-list header */
const newTaskInput = document.getElementById('newTaskInput');
const wordsCounter = document.getElementById('wordsCounter');

/* todo-list body */
const tasksContainer = document.querySelector('.todo-list__body');

/* todo-list footer */
const tasksInfo = document.querySelector('.tasks-info');
const clearCompletedBtn = document.getElementById('clearCompletedTask');
const showAllTasksBtn = document.getElementById('allTaskView');
const showActiveTasksBtn = document.getElementById('activeTaskView');
const showCompletedTasksBtn = document.getElementById('completedTaskView');


const updateCounter = ({length}) => wordsCounter.textContent = 80 - length;

const createInputMsg = content => {
    const inputMessage = document.createElement('span');
    inputMessage.classList.add('input-msg');
    inputMessage.textContent = content;
    return inputMessage;
}

const showInputFeedback = (status, message) => {
    const previousMsg = newTaskInput.parentElement.querySelector('.input-msg');
    if(previousMsg) previousMsg.remove();
    newTaskInput.parentElement.classList.remove('error', 'success');

    const inputMessage = createInputMsg(message);
    newTaskInput.parentElement.classList.add(status);
    newTaskInput.parentElement.appendChild(inputMessage);

    setTimeout(() => {
        inputMessage.remove();
        newTaskInput.parentElement.classList.remove(status);
    }, 1200);
}

const createTaskHtml = (content, isCompleted) => {
  return `
            <div class="task ${isCompleted ? 'completed' : ''}" draggable="true">
                <span class="task__status"></span>
                <span class="task__content">${content}</span>
                <span class="task__delete"></span>
            </div>
        `;
};

const newTaskHandler = ({ key, target}) => {
    if(!key || key !== 'Enter') return updateCounter(target.value);
    
    target.disabled = true;
    const taskContent = target.value.trim();

    const {success, message} = addTask(taskContent);
    if(success){
        tasksContainer.insertAdjacentHTML('beforeend', createTaskHtml(taskContent, false));
        tasksContainer.classList.remove('empty');
        updateTasksInfo();
        target.value = '';
        showInputFeedback('success', message);
    }else{
        showInputFeedback('error', message)
    }

    updateCounter(target.value);
    target.disabled = false;
    target.focus();
}

const deleteTaskHandler = taskHtml => {
    if(!taskHtml) return;
    const taskContent = taskHtml.querySelector('.task__content');
    if(!taskContent) return;

    const deleteProcess = deleteTask(taskContent.textContent);
    if(deleteProcess.success === false) return;

    taskHtml.remove();
    if(tasksContainer.children.length === 0) tasksContainer.classList.add('empty');
    updateTasksInfo();
}

const updateTaskStatusHandler = taskHtml => {
    if(!taskHtml) return;
    const taskContent = taskHtml.querySelector('.task__content');
    if(!taskContent) return;

    const updateProcess = updateTaskStatus(taskContent.textContent);
    if(updateProcess.success === false) return;

    (updateProcess.taskIsCompleted) ? taskHtml.classList.add('completed') : taskHtml.classList.remove('completed');
    updateTasksInfo();
}

const clearCompletedTaskHandler = (event) => {
    const deletedTasksContent = deleteAllCompletedTask();

    Array.from(tasksContainer.children).forEach(taskHtml => {
        const taskContent = taskHtml.querySelector('.task__content');
        if(taskContent && deletedTasksContent.includes(taskContent.textContent)){
            taskHtml.remove()
        }
    });

    if(tasksContainer.children.length === 0) tasksContainer.classList.add('empty');
}

const showTaskByFilter = (filterCallback) => {
    Array.from(tasksContainer.children).forEach(taskHtml => {
        taskHtml.classList.toggle('hidden', !filterCallback(taskHtml));
    });
}

const setActiveStatusToView = (viewBtn) => {
    Array.from(viewBtn.parentElement.children).forEach(btn => btn.classList.remove('active'));
    viewBtn.classList.add('active');
}

const updateTasksInfo = () => {
    tasksInfo.textContent = `${activeTasksCount()} items left`;
}

// Load Tasks before set Event Listeners
(() => {
    getTasksDatabase().forEach(({content, isCompleted}) => {
        tasksContainer.insertAdjacentHTML('beforeend', createTaskHtml(content, isCompleted));
    });
    if(tasksContainer.children.length === 0) tasksContainer.classList.add('empty');
    updateTasksInfo();
})();

// Set Event Listeners
newTaskInput.addEventListener('keyup', newTaskHandler);

tasksContainer.addEventListener('click', (event) => {
    const clickedElement = event.target;

    if(clickedElement.classList.contains('task__delete')){
        return deleteTaskHandler(event.target.closest('.task'));
    }

    if(clickedElement.classList.contains('task__status')){
        return updateTaskStatusHandler(event.target.closest('.task'))
    }
});

clearCompletedBtn.addEventListener('click', clearCompletedTaskHandler);

showAllTasksBtn.addEventListener('click', (event) => {
    setActiveStatusToView(event.target);
    showTaskByFilter((taskHtml) => true);
})

showActiveTasksBtn.addEventListener('click', (event) => {
    setActiveStatusToView(event.target);
    showTaskByFilter((taskHtml) => !taskHtml.classList.contains('completed'));
})

showCompletedTasksBtn.addEventListener('click', (event) => {
    setActiveStatusToView(event.target);
    showTaskByFilter((taskHtml) => taskHtml.classList.contains('completed'));
})
