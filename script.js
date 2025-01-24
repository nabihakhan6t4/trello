// Generalized addTask function
function addTask(listId, taskText, label = "normal", dueDate = "") {
  const trimmedText = taskText.trim();

  if (trimmedText !== "") {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item";
    listItem.textContent = trimmedText;
    listItem.draggable = true;

    // Add label to task
    listItem.classList.add(label);

    // Add due date if available
    if (dueDate) {
      const dateSpan = document.createElement("span");
      dateSpan.textContent = `Due: ${dueDate}`;
      dateSpan.classList.add("task-due-date");
      listItem.appendChild(dateSpan);
    }

    // Generate a unique ID for the list item
    listItem.id = "item-" + new Date().getTime(); // Unique ID for each task

    // Create buttons (Edit, Delete, Complete, Archive)
    const editButton = createButton(
      "Edit",
      "btn-warning",
      handleEdit.bind(null, listItem, trimmedText)
    );
    const deleteButton = createButton(
      "Delete",
      "btn-danger",
      handleDelete.bind(null, listItem, trimmedText)
    );
    const completeButton = createButton(
      "Complete",
      "btn-success",
      handleComplete.bind(null, listItem, trimmedText)
    );

    // Append buttons and task to the list
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    listItem.appendChild(completeButton);
    document.getElementById(listId).appendChild(listItem);

    // Sweet Alert for task addition
    Swal.fire({
      title: "Task Added!",
      text: `'${trimmedText}' has been successfully added!`,
      icon: "success",
      confirmButtonText: "Cool",
    });

    saveTasks(); // Save tasks to local storage
  }
}

// Utility function to create buttons
function createButton(text, className, onClickHandler) {
  const button = document.createElement("button");
  button.className = `btn btn-sm ms-2 ${className}`;
  button.textContent = text;
  button.onclick = onClickHandler;
  return button;
}

// Handle task editing
function handleEdit(listItem, originalText) {
  const newText = prompt("Edit your task:", originalText);
  if (newText !== null && newText.trim() !== "") {
    listItem.textContent = newText.trim();
    listItem.appendChild(
      createButton(
        "Edit",
        "btn-warning",
        handleEdit.bind(null, listItem, newText.trim())
      )
    );
    listItem.appendChild(
      createButton(
        "Delete",
        "btn-danger",
        handleDelete.bind(null, listItem, newText.trim())
      )
    );
  }
}

// Handle task deletion
function handleDelete(listItem, taskText) {
  Swal.fire({
    title: "Are you sure?",
    text: `Do you want to delete '${taskText}'?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Delete it",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      listItem.remove();
      Swal.fire({
        title: "Task Deleted!",
        text: `'${taskText}' has been deleted.`,
        icon: "error",
        confirmButtonText: "Okay",
      });
      saveTasks(); // Update the task list in local storage
    }
  });
}

// Mark task as completed
function handleComplete(listItem, taskText) {
  Swal.fire({
    title: "Complete Task?",
    text: `Do you want to mark '${taskText}' as completed?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  }).then((result) => {
    if (result.isConfirmed) {
      listItem.classList.toggle("completed");
      Swal.fire({
        title: "Task Completed!",
        text: `'${taskText}' has been marked as completed.`,
        icon: "success",
        confirmButtonText: "Cool",
      });
    }
  });
}

// Drag-and-drop logic (for Trello-style)
function allowDrop(e) {
  e.preventDefault();
}

function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
}

function drop(e, listId) {
  e.preventDefault();
  const data = e.dataTransfer.getData("text/plain");
  const draggedItem = document.getElementById(data);

  if (draggedItem) {
    const targetList = document.getElementById(listId);
    targetList.appendChild(draggedItem); // Append dragged item to the new list
    saveTasks(); // Save the task list to local storage after the drop
  }
}

// Event listeners for adding tasks using the input fields and buttons
const taskCategories = [
  {
    buttonId: "add-fruit-task",
    inputId: "new-fruit-task",
    listId: "fruit-list",
  },
  {
    buttonId: "add-vegetable-task",
    inputId: "new-vegetable-task",
    listId: "vegetable-list",
  },
  {
    buttonId: "add-fastfood-task",
    inputId: "new-fastfood-task",
    listId: "fastfood-list",
  },
];

taskCategories.forEach(({ buttonId, inputId, listId }) => {
  document.getElementById(buttonId).addEventListener("click", function () {
    const taskText = document.getElementById(inputId).value;
    const label = prompt("Enter label (urgent, important, normal):");
    const dueDate = prompt("Enter due date (e.g., 2025-01-24):");
    addTask(listId, taskText, label, dueDate);
    document.getElementById(inputId).value = ""; // Clear input after adding
  });

  document.getElementById(inputId).addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      const taskText = document.getElementById(inputId).value;
      const label = prompt("Enter label (urgent, important, normal):");
      const dueDate = prompt("Enter due date (e.g., 2025-01-24):");
      addTask(listId, taskText, label, dueDate);
      document.getElementById(inputId).value = ""; // Clear input
    }
  });
});

// Save tasks to local storage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll(".list-group-item").forEach((task) => {
    tasks.push({
      id: task.id,
      text: task.textContent.trim(),
      completed: task.classList.contains("completed"),
      label: task.className
        .split(" ")
        .find((c) => ["urgent", "important", "normal"].includes(c)),
      dueDate: task.querySelector(".task-due-date")
        ? task.querySelector(".task-due-date").textContent
        : "",
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from local storage on page load
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(({ id, text, completed, label, dueDate }) => {
    const listId = getListIdFromTaskId(id);
    addTask(listId, text, label, dueDate);
    if (completed) {
      document.getElementById(id).classList.add("completed");
    }
  });
}

// Helper function to map task ID to the appropriate list ID
function getListIdFromTaskId(id) {
  if (id.includes("fruit")) return "fruit-list";
  if (id.includes("vegetable")) return "vegetable-list";
  if (id.includes("fastfood")) return "fastfood-list";
  return "task-list"; // Default list
}

// Call loadTasks on page load
window.onload = loadTasks;
