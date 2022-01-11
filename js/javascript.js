{
    let buttons = document.getElementsByClassName("button");
    let themeButtons = document.getElementsByClassName("themeBtn");
    let inputText = document.getElementById("input");

    let input = "0";
    let operators = ['÷', '×', '+', '-'];
    let regFilter = ['(',')','÷', '×', '+', '-'];
    let actions = ["ac", "="];
    let result=0;

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
                    if (checkType(input[input.length - 2]) !== "num") {
                        inputText.innerHTML = "Error";
                        input = "0"
                    } 
                    
                    else {
                        result = solveInput(splitInput(input));
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

    let splitInput = (string) => {
        let arr=[];
        const reg=new RegExp('(?=[\\' + regFilter.join(',\\') + '])|(?<=[\\' + regFilter.join(',\\') + '])', "g");
        arr=string.replace(/ /g, '').split(reg);
        return arr;
    }

    let solveInput = (queue) => {
        while(queue.indexOf(')')>-1) {
            let closeBracketPosition=queue.indexOf(')');
            let openBracketPosition=queue.indexOf('(');

            let openBracketPositions=getAllIndexes(queue,'(');
            for(let i=openBracketPositions.length-1; i>0; i--) {
                if(openBracketPositions[i]<closeBracketPosition) {
                    openBracketPosition=openBracketPositions[i];
                    break;
                }
            }
    
            let smallerQueue=queue.slice(openBracketPosition+1, closeBracketPosition);
            let numOfElementsInside=closeBracketPosition-openBracketPosition-1;
            queue.splice(openBracketPosition,numOfElementsInside+2,solveInput(smallerQueue));
        }
        return solveBedmas(queue);
    }

    let solveBedmas = (array) => {
        for (let i = 0; i < operators.length; i++) {
            let currentOperationArray = getAllIndexes(array, operators[i]);
            while (currentOperationArray.length > 0) {
                let currentValue = calculator[operators[i]](parseFloat(array[currentOperationArray[0] - 1]), parseFloat(array[currentOperationArray[0] + 1]));
                array.splice(currentOperationArray[0] - 1, 3, currentValue);
                currentOperationArray = getAllIndexes(array, operators[i]);
            }
        }
        return array[0];
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
            q = [];
        },
        "print": function(number) {
            q = [];
            inputText.innerHTML = number;
        }
    }

    const setTheme = theme => document.documentElement.className = theme;

    for (let i = 0; i < themeButtons.length; i++) {
        let btnId = themeButtons[i].id;
        themeButtons[i].onclick = () => {
            var current = document.getElementsByClassName("activeTheme");
            current[0].className = current[0].className.replace(" activeTheme", "");
            themeButtons[i].className += " activeTheme";
            setTheme(btnId);
        }
    }
}