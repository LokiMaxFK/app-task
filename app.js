const formTask = document.querySelector("#form-task");
const taskInput = document.querySelector("#task-input");
const tasksContainer = document.querySelector("#tasks-container");

const formFilter = document.querySelector("#filter");
const modalForm = document.querySelector('#modal-form');
const btnAddTask = document.querySelector("#add-task");
const btnCloseModal = document.querySelector("#close-modal");
const buttonTooltips = document.querySelector("#button-tooltip");
const templateTask = document.querySelector("#template-task");



// Leer datos localstorage y renderizar imágenes.
let tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];

tasks.forEach(task => {
    renderTask(task);
});


// Activar/Desactivar Formulario de Filtros
buttonTooltips.addEventListener('click', ()=>{
    formFilter.classList.toggle("filter--show");
});


// Evento que determina los filtros.
formFilter.addEventListener("submit", function(e){
    e.preventDefault();

    tasksContainer.className = "tasks";

    const currentValue = document.querySelector(".filter__input:checked").value ?? "all";

    if(currentValue === "done"){
        tasksContainer.classList.add("tasks--complete");
    }else if(currentValue === "pending"){
        tasksContainer.classList.add("tasks--incomplete");
    }

    // Quitamos la ventana de filtros.
    formFilter.classList.remove("filter--show");

})


// Actualizar tarea & determinar su estado.
tasksContainer.addEventListener('input', (e)=>{
    
    const currentTaskId = e.target.closest('.tasks__item');

    if(e.target.matches('.tasks__name')){
        const newText = e.target.textContent;

        updateTaskName(currentTaskId.id, newText);
    }else if(e.target.matches('.tasks__checked')){

        updateTaskState(currentTaskId.id, currentTaskId, e.target.checked);
    }

});


// Evento eliminar tarea
tasksContainer.addEventListener('click', function(e){

    const currentTask = e.target.closest('.tasks__item');
    if(e.target.matches('.close--task, .close--task *')){
        deleteTask(currentTask);
    }

});

// 1- Evento agregar tareas
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


//Abrir & Cerrar modal.
btnAddTask.addEventListener('click', function(e){
    modalForm.showModal();
    modalForm.querySelector("input").focus();
});

btnCloseModal.addEventListener('click', closeModal);



// 2-  Crear Tarea Nueva
function createTask(taskName){
    return newTask = {
        name: taskName,
        completed: false,
        id: new Date().getTime() 
    }
}

// Renderizar tarea
function renderTask(task){
    const taskTemplate = templateTask.content.cloneNode(true);

    if(task.completed){

        taskTemplate.querySelector('.tasks__item').dataset.state = "complete"
        taskTemplate.querySelector('[type="checkbox"]').checked = true;

    }else{

        taskTemplate.querySelector('.tasks__item').dataset.state = "incomplete"
        taskTemplate.querySelector('p').contentEditable = true;

    }

    taskTemplate.querySelector('p').textContent = task.name;
    taskTemplate.querySelector('li').id = task.id;

    tasksContainer.append(taskTemplate);
}

// Actualizar nombre de la tarea
function updateTaskName(id, value){
    const [currentTask] = getTaskByID(id);
    currentTask.name = value;
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Actualizar estado de la tarea
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

// Eliminar la tarea
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

// Obtener una tarea por ID
function getTaskByID (id){
    const currentId = parseInt(id);

    return tasks.filter((task) => task.id === currentId)
}


// Funcion que cierra el modal
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