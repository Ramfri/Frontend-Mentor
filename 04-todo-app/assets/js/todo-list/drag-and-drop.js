
const tasksContainer = document.querySelector('.todo-list__body');
let currentItem = null;

const getClosestItem = target => target.closest('.task');

const topOrBottom = ({ y }, { offsetTop, offsetHeight, previousElementSibling, nextElementSibling}) => {
    if(previousElementSibling === null) return 'beforebegin';
    if(nextElementSibling === null) return 'afterend';
    return ( y > offsetTop + offsetHeight / 2 ) ? 'beforebegin' : 'afterend';
}

tasksContainer.addEventListener('dragstart', (event) => {
    const item = getClosestItem(event.target);
    if(!item) return;

    event.dataTransfer.effectAllowed = 'move';
    currentItem = item;
    item.classList.add('is-moving');
})

tasksContainer.addEventListener('dragover', (event) => event.preventDefault());

tasksContainer.addEventListener('dragenter', (event) => {
    if(currentItem === null) return;

    const item = getClosestItem(event.target);
    if(!item || item === currentItem) return;

    const position = topOrBottom(event, item);
    item.insertAdjacentElement(position, currentItem);
});

tasksContainer.addEventListener('dragend', (event) => {
    if(currentItem) currentItem.classList.remove('is-moving');
    currentItem = null;
})


