// Function to add a new task
function addTask(listId, inputId) {
    const taskText = document.getElementById(inputId).value.trim();

    if (taskText !== "") {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.textContent = taskText;
        listItem.draggable = true;

        // Drag and drop functionality
        listItem.addEventListener('dragstart', function (e) {
            e.dataTransfer.setData('text/plain', e.target.id);
            e.dataTransfer.effectAllowed = 'move';
        });

        // Generate a unique ID for the list item
        listItem.id = 'item-' + new Date().getTime();

        document.getElementById(listId).appendChild(listItem);
        document.getElementById(inputId).value = '';
    }
}

// Event listeners for adding tasks
document.getElementById('add-fruit-task').addEventListener('click', function () {
    addTask('fruit-list', 'new-fruit-task');
});

document.getElementById('new-fruit-task').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask('fruit-list', 'new-fruit-task');
    }
});

document.getElementById('add-vegetable-task').addEventListener('click', function () {
    addTask('vegetable-list', 'new-vegetable-task');
});

document.getElementById('new-vegetable-task').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask('vegetable-list', 'new-vegetable-task');
    }
});

document.getElementById('add-fastfood-task').addEventListener('click', function () {
    addTask('fastfood-list', 'new-fastfood-task');
});

document.getElementById('new-fastfood-task').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask('fastfood-list', 'new-fastfood-task');
    }
});

// Allow dropping into the lists
function allowDrop(e) {
    e.preventDefault();
}

function drop(e, listId) {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    const draggedItem = document.getElementById(data);

    // Move the dragged item to the new list and remove it from the original list
    if (draggedItem) {
        document.getElementById(listId).appendChild(draggedItem);
    }
}

// Event listeners for allowing drop on the lists
document.getElementById('fruit-list').addEventListener('dragover', allowDrop);
document.getElementById('fruit-list').addEventListener('drop', function (e) {
    drop(e, 'fruit-list');
});

document.getElementById('vegetable-list').addEventListener('dragover', allowDrop);
document.getElementById('vegetable-list').addEventListener('drop', function (e) {
    drop(e, 'vegetable-list');
});

document.getElementById('fastfood-list').addEventListener('dragover', allowDrop);
document.getElementById('fastfood-list').addEventListener('drop', function (e) {
    drop(e, 'fastfood-list');
});
