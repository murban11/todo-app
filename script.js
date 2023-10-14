"use strict"

let Todo = function(title, description, place, dueDate) {
    this.title = title;
    this.description = description;
    this.place = place;
    this.dueDate = dueDate;
}

let todoList = [];

let addTodo = function() {
    todoList.push(
        new Todo(
            document.getElementById("inputTitle").value,
            document.getElementById("inputDescription").value,
            document.getElementById("inputPlace").value,
            document.getElementById("inputDate").value
        )
    );

    window.localStorage.setItem("todos", JSON.stringify(todoList));
}

let deleteTodo = function(index) {
    todoList.splice(index, 1);

    window.localStorage.setItem("todos", JSON.stringify(todoList));
}

let restoreTodoList = function() {
    let savedTodos = window.localStorage.getItem("todos");

    if (savedTodos != null) {
        todoList = JSON.parse(savedTodos);
    }
}

let updateTodoList = function() {
    let todoListDiv = document.getElementById("todoListView");

    while (todoListDiv.firstChild) {
        todoListDiv.removeChild(todoListDiv.firstChild);
    }

    let filterInput = document.getElementById("inputSearch");   
    for (let idx in todoList) {
        if (
            (filterInput.value == "")
                || (todoList[idx].title.includes(filterInput.value))
                || (todoList[idx].description.includes(filterInput.value))
        ) {
            let newElement = document.createElement("p");
            let newContent = document.createTextNode(todoList[idx].title
                + " " + todoList[idx].description);
            newElement.appendChild(newContent);
            todoListDiv.appendChild(newElement);

            let newDeleteButton = document.createElement("input");
            newDeleteButton.type = "button";
            newDeleteButton.value = "x";
            newDeleteButton.addEventListener("click", () => {
                deleteTodo(idx)
            });
            newElement.appendChild(newDeleteButton);
        }
    }
}

restoreTodoList();
updateTodoList();
setInterval(updateTodoList, 1000);
