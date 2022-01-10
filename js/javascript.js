{
    let buttons = document.getElementsByClassName("button");
    let inputText = document.getElementById("input");

    let input = "0";
    let operators = ['÷', '×', '+', '-'];
    let actions = ["ac", "="];
    let queue = [];

    let checkType = (btn) => {
        for (let i = 0; i < actions.length; i++) {
            if (btn === actions[i]) {
                return "action";
            }
        }

        for (let i = 0; i < operators.length; i++) {
            if (btn === operators[i]) {
                return "operator";
            }
        }
            
        return "num"; 
    }

        for (let i = 0; i < buttons.length; i++) {
            let btn = buttons[i].id;
            buttons[i].onclick = () => {

                if(checkType(btn)==="action") {
                    if (btn === "ac") {
                        calculator.ac();
                    } 
        
                    else if (btn === "=") {
                        if (checkType(queue[queue.length - 2]) !== "num") {
                            inputText.innerHTML = "Error";
                            input = "0"
                        } 
                        
                        else {
                            let result = solveQueue();
                            input = result;
                            calculator.print(result);
                        }
                    }
                }

                else if(checkType(btn)==="operator") {
                    if (input !== "" && checkType(input[input.length-2])!=="operator") {
                        if(input[input.length-1]==".") {
                            input = input.substring(0, input.length - 1) + " ";
                        }
                        input += " " + buttons[i].id + " ";
                        inputText.innerHTML = input;
                    }
                }

                else {

                    if (btn === "0" && input === "0") {

                    } 

                    else if (btn === ".") {
                        if (input.indexOf(".") === -1) {
                            input += buttons[i].id;
                            inputText.innerHTML = input;
                        }
                        else if (input.lastIndexOf(" ") > -1) {
                            let temp=input.substring(input.lastIndexOf(" ")-1);
                            if (checkType(temp[temp.length-2])!=="operator" && temp.indexOf(".") === -1) {
                                input += buttons[i].id;
                                inputText.innerHTML = input;
                            }
                        }
                    } 

                    else if (input==="0") {
                        input = buttons[i].id;
                        inputText.innerHTML = input;
                    }

                    else {
                        input += buttons[i].id;
                        inputText.innerHTML = input;
                    }
                }
            }
        }

    let solveQueue = () => {
        queue=splitInput(input);
        if (queue.length > 1) {
            for (let i = 0; i < operators.length; i++) {
                let currentOperationArray = getAllIndexes(queue, operators[i]);
                while (currentOperationArray.length > 0) {
                    let currentValue = calculator[operators[i]](parseFloat(queue[currentOperationArray[0] - 1]), parseFloat(queue[currentOperationArray[0] + 1]));
                    queue.splice(currentOperationArray[0] - 1, 3, currentValue);
                    currentOperationArray = getAllIndexes(queue, operators[i]);
                }
            }
        }
        return queue[0];
    }

    let splitInput = (string) => {
        let arr=[];
        const reg=new RegExp('(?=[\\' + operators.join(',\\') + '])|(?<=[\\' + operators.join(',\\') + '])', "g");
        arr=string.replace(/ /g, '').split(reg);
        return arr;
    }

    let getAllIndexes = (array, value) => {
        let indexes = [],
            i = -1;
        while ((i = array.indexOf(value, i + 1)) != -1) {
            indexes.push(i);
        }
        return indexes;
    }

    let calculator = {
        "÷": function(x, y) {
            return (x / y);
        },
        "×": function(x, y) {
            return (x * y);
        },
        "+": function(x, y) {
            return (x + y);
        },
        "-": function(x, y) {
            return (x - y);
        },
        "ac": function() {
            input = "0";
            inputText.innerHTML = "0";
            queue = [];
        },
        "print": function(number) {
            queue = [];
            inputText.innerHTML = number;
        }
    }
}