const formTask = document.querySelector("#form-task");
const taskInput = document.querySelector("#task-input");
const tasksContainer = document.querySelector("#tasks-container");

const formFilter = document.querySelector("#filter");
const modalForm = document.querySelector('#modal-form');
const btnAddTask = document.querySelector("#add-task");
const btnCloseModal = document.querySelector("#close-modal");

let tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];

console.dir(tasks);

if(localStorage.getItem("tasks")){
    tasks.forEach(task => {
        renderTask(task);
    });
}


formFilter.addEventListener("submit", function(e){
    e.preventDefault();

    const currentValue = document.querySelector(".filter__input:checked").value ?? "all";
    
    if(currentValue === "done"){
        tasksContainer.classList.add("tasks--complete");
    }
})

// Cambiar Texto o Estados
tasksContainer.addEventListener('input', (e)=>{
    
    const currentTaskId = e.target.closest('.tasks__item');

    if(e.target.matches('.tasks__name')){
        const newText = e.target.textContent;

        updateTaskName(currentTaskId.id, newText);
    }else if(e.target.matches('.tasks__checked')){

        updateTaskState(currentTaskId.id, currentTaskId, e.target.checked);
    }


});

tasksContainer.addEventListener('click', function(e){

    const currentTask = e.target.closest('.tasks__item');
    if(e.target.matches('.close--task, .close--task *')){
        deleteTask(currentTask);
    }

   
});

// Agregar Tarea
formTask.addEventListener('submit', function(e){
    e.preventDefault();

    const currentValueInput = taskInput.value.trim();

    if(currentValueInput.length > 3){
        const newTask = createTask(currentValueInput);
        renderTask(newTask);

        tasks.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        closeModal();
    }   

    this.reset();
});

btnAddTask.addEventListener('click', function(e){
    modalForm.showModal();
});

btnCloseModal.addEventListener('click', closeModal);


// Crear Tarea Nueva
function createTask(task){
    return newTask = {
        name: task,
        completed: false,
        id: new Date().getTime() 
    }
}

// Renderizar tarea
function renderTask(task){
    const templateTask = document.querySelector("#template-task");
    const taskTemplate = document.importNode(templateTask.content, true);

    console.log(task.completed);

    if(task.completed){
        taskTemplate.querySelector('.tasks__item').dataset.state = "complete"
        taskTemplate.querySelector('[type="checkbox"]').checked = true;
    }else{
        taskTemplate.querySelector('.tasks__item').dataset.state = "incomplete"
    }

    console.log();

    taskTemplate.querySelector('p').textContent = task.name;
    taskTemplate.querySelector('li').id = task.id;

    tasksContainer.append(taskTemplate);
}

function updateTaskName(id, value){

    const [currentTask] = getTaskByID(id);
    currentTask.name = value;
    localStorage.setItem("tasks", JSON.stringify(tasks));

}

function updateTaskState(id, element, taskState){
    const [currentTask] = getTaskByID(id);

    const taskName = element.querySelector('.tasks__name');
    currentTask.completed = taskState;

    if(taskState){
        element.dataset.state = "complete";
        taskName.contentEditable = "false";
    }else{
        element.dataset.state = "incomplete";
        taskName.contentEditable = "true";
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

function deleteTask(element){
    const currentId = parseInt(element.id);
    const newTasks = tasks.filter((task) => task.id !== currentId);
    tasks = newTasks;

    localStorage.setItem("tasks", JSON.stringify(tasks));

    
    element.classList.add('tasks__item--fade');

    element.addEventListener('animationend', function(e){
        this.remove();
    });
}


function getTaskByID (id){
    const currentId = parseInt(id);

    return tasks.filter((task) => task.id === currentId)
}


function closeModal(){
    const modal = modalForm.closest('dialog[open]');
    modal.style.animation = "fade .3s forwards"; 
    
    modal.addEventListener('animationend', function(e){
        modal.style.animation = ""; 
        modal.close();
    }, {
        once: true
    });
}