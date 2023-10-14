"use strict"

let Task = function(title, description, place, dueDate) {
    this.title = title;
    this.description = description;
    this.place = place;
    this.dueDate = dueDate;
}

let todoList = [];

let initList = function() {
    let savedList = window.localStorage.getItem("todos");

    if (savedList != null) {
        todoList = JSON.parse(savedList);
    }
}

let addTodo = function() {
    let inputTitle = document.getElementById("inputTitle");
    let inputDescription = document.getElementById("inputDescription");
    let inputPlace = document.getElementById("inputPlace");
    let inputDate = document.getElementById("inputDate");

    todoList.push(
        new Task(
            inputTitle.value,
            inputDescription.value,
            inputPlace.value,
            new Date(inputDate.value)
        )
    );

    window.localStorage.setItem("todos", JSON.stringify(todoList));
}

let deleteTodo = function(index) {
    todoList.splice(index, 1);

    window.localStorage.setItem("todos", JSON.stringify(todoList));
}

let updateTodoList = function() {
    let todoListDiv = document.getElementById("todoListView");

    while (todoListDiv.firstChild) {
        todoListDiv.removeChild(todoListDiv.firstChild);
    }

    let filterInput = document.getElementById("inputSearch");   
    for (let todo in todoList) {
        if (
            (filterInput.value == "")
                || (todoList[todo].title.includes(filterInput.value))
                || (todoList[todo].description.includes(filterInput.value))
        ) {
            let newElement = document.createElement("p");
            let newContent = document.createTextNode(todoList[todo].title
                + " " + todoList[todo].description);
            newElement.appendChild(newContent);
            todoListDiv.appendChild(newElement);

            let newDeleteButton = document.createElement("input");
            newDeleteButton.type = "button";
            newDeleteButton.value = "x";
            newDeleteButton.addEventListener("click", () => {
                deleteTodo(todo)
            });
            newElement.appendChild(newDeleteButton);
        }
    }
}

initList();
updateTodoList();

setInterval(updateTodoList, 1000);
