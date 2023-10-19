"use strict"

let Todo = function(title, description, place, dueDate) {
    this.title = title;
    this.description = description;
    this.place = place;
    this.dueDate = dueDate;
}

let todoList = [];

let restoreTodoList = function() {
    try {
        $.ajax({
            url: BASE_URL,
            type: 'GET',
            headers: {
                'X-Master-Key': SECRET_KEY
            },
            success: (data) => {
                for (let r of data.record) {
                    todoList.push(new Todo(
                        r.title,
                        r.description,
                        r.place,
                        new Date(r.dueDate)
                    ));
                }
            },
            error: (err) => {
                console.log(err.responseJSON);
            }
        });
    } catch (error) {
        console.error(error);
        console.log(
            "Make sure there is a `key.js` file in the project's root "
            + "directory with the following content:\n"
            + "const BASE_URL = \"<BIN_URL>\";\n"
            + "const SECRET_KEY = \"<SECRET_KEY>\";\n"
        );
    }
}

let saveTodoList = function() {
    $.ajax({
        url: BASE_URL,
        type: 'PUT',
        headers: {
            'X-Master-Key': SECRET_KEY
        },
        contentType: 'application/json',
        data: JSON.stringify(todoList),
        success: (data) => {
            console.log(data);
        },
        error: (err) => {
            console.log(err.responseJSON);
        }
    });
}

let addTodo = function() {
    todoList.push(
        new Todo(
            document.getElementById("inputTitle").value,
            document.getElementById("inputDescription").value,
            document.getElementById("inputPlace").value,
            document.getElementById("inputDate").value
        )
    );

    saveTodoList();
}

let deleteTodo = function(index) {
    todoList.splice(index, 1);

    saveTodoList();
}

let updateTodoList = function() {
    let todoListDiv = document.getElementById("todoListView");

    while (todoListDiv.firstChild) {
        todoListDiv.removeChild(todoListDiv.firstChild);
    }

    let table = document.createElement("table");
    table.className = "container";

    let filterInput = document.getElementById("inputSearch");   
    let startDate = document.getElementById("startDate");
    let endDate = document.getElementById("endDate");
    for (let idx in todoList) {
        if (
            ((filterInput.value == "")
                || (todoList[idx].title.includes(filterInput.value))
                || (todoList[idx].description.includes(filterInput.value))
                || (todoList[idx].place.includes(filterInput.value)))
            && (startDate.value === startDate.defaultValue
                || todoList[idx].dueDate.getTime() >= startDate.valueAsDate.getTime())
            && (endDate.value === endDate.defaultValue
                || todoList[idx].dueDate.getTime() <= endDate.valueAsDate.getTime())
        ) {
            let titleCell = document.createElement("th");
            titleCell.className = "col text-center";
            let title = document.createTextNode(todoList[idx].title);
            titleCell.appendChild(title);

            let descCell = document.createElement("td");
            descCell.className = "col text-center";
            let desc = document.createTextNode(todoList[idx].description);
            descCell.appendChild(desc);

            let placeCell = document.createElement("td");
            placeCell.className = "col text-center";
            let place = document.createTextNode(todoList[idx].place);
            placeCell.appendChild(place);

            let dateCell = document.createElement("td");
            dateCell.className = "col text-center";
            let formattedDate = todoList[idx].dueDate.toLocaleString("pl-PL", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
            });

            let date = document.createTextNode(formattedDate);
            dateCell.appendChild(date);

            let closeButtonCell = document.createElement("td");
            closeButtonCell.className = "col text-center";
            let closeButton = document.createElement("button");
            closeButton.className = "btn btn-danger";
            closeButton.type = "button";
            closeButton.addEventListener("click", () => {
                deleteTodo(idx);
            });
            closeButton.innerHTML = '<span class="fa-solid fa-trash"></span>';
            closeButtonCell.appendChild(closeButton);

            let row = document.createElement("tr");
            row.className = "row my-1";
            row.appendChild(titleCell);
            row.appendChild(descCell);
            row.appendChild(placeCell);
            row.appendChild(dateCell);
            row.appendChild(closeButtonCell);

            table.appendChild(row);
        }
    }

    todoListDiv.appendChild(table);
}

restoreTodoList();
updateTodoList();
setInterval(updateTodoList, 1000);
