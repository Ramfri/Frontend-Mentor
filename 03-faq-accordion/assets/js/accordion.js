
const enableAccordionItem = (item) => {
    const header = item.querySelector('.item__header');
    const content = item.querySelector('.item__content');
    if(!header || !content) return;
    
    header.addEventListener('click', (e) => {
        e.stopImmediatePropagation();
        content.style.setProperty('--current-height', content.scrollHeight + "px");
        item.classList.toggle('active');
    })
}

const enableAccordion = () => {
    const accordion = document.querySelector('.accordion');
    if(!accordion) return;
    Array.from(accordion.children, enableAccordionItem);
}

document.addEventListener('DOMContentLoaded', enableAccordion);

