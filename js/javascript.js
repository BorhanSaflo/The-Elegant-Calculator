{
    let buttons = document.getElementsByClassName("button");
    let inputText = document.getElementById("input");

    let input = "";
    let nonNumberButtons = ["add", "minus", "multiply", "divide", "ac", "equals"];
    let operations = ["divide", "multiply", "add", "minus"];
    let queue = [];
    let clear = () => {
        inputText.innerHTML = "0";
    }

    let numberButtonCheck = (btn) => {
        for (let i = 0; i < nonNumberButtons.length; i++) {
            if (btn === nonNumberButtons[i]) {
                if (btn === "ac") {
                    calculator.ac();
                } else if (btn === "equals") {
                    queue.push(parseFloat(input));
                    if (typeof queue[queue.length - 1] !== "number") {
                        inputText.innerHTML = "Error";
                        input = ""
                    } else {
                        queue.push(parseFloat(input));
                        let result = solveQueue();
                        input = result;
                        calculator.print(result);
                    }
                } else if (input !== "") {
                    queue.push(parseFloat(input));
                    queue.push(String(btn));
                    input = "";
                }
                return false;
            }
        }
        return true;
    }

    function getAllIndexes(array, value) {
        let indexes = [],
            i = -1;
        while ((i = array.indexOf(value, i + 1)) != -1) {
            indexes.push(i);
        }
        return indexes;
    }

    let solveQueue = () => {
        if (queue.length > 1) {
            for (let i = 0; i < operations.length; i++) {
                let currentOperationArray = getAllIndexes(queue, operations[i]);
                while (currentOperationArray.length > 0) {
                    let currentValue = calculator[operations[i]](queue[currentOperationArray[0] - 1], queue[currentOperationArray[0] + 1]);
                    queue.splice(currentOperationArray[0] - 1, 3, currentValue);
                    currentOperationArray = getAllIndexes(queue, operations[i]);
                }
            }
        }
        return queue[0];
    }

    let calculator = {
        divide: function(x, y) {
            return (x / y);
        },
        multiply: function(x, y) {
            return (x * y);
        },
        add: function(x, y) {
            return (x + y);
        },
        minus: function(x, y) {
            return (x - y);
        },
        ac: function() {
            input = "";
            input1 = "";
            queue = [];
            inputText.innerHTML = "0";
        },
        print: function(number) {
            queue = [];
            inputText.innerHTML = number;
        }
    }

    for (let i = 0; i < buttons.length; i++) {
        let btnId = buttons[i].id;
        buttons[i].onclick = run => {
            if (numberButtonCheck(btnId)) {
                input += buttons[i].id;
                inputText.innerHTML = input;
            }
        }
    }

}