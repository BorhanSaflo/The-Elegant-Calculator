{
    let buttons = document.getElementsByClassName("button");
    let themeButtons = document.getElementsByClassName("themeBtn");
    let inputText = document.getElementById("input");

    let input = "0";
    let operators = ['÷', '×', '+', '-'];
    let other = ['(',')','π','e'];
    let regFilter = ['(',')','÷', '×', '+', '-'];
    let actions = ["clear", "=", "erase"];
    let result=0;

    let checkType = (btn) => {
        if(btn===" ") {
            return "space";
        }

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

        for (let i = 0; i < other.length; i++) {
            if(btn === other[i]) {
                return "other";
            }
        }
            
        return "num"; 
    }

    for (let i = 0; i < buttons.length; i++) {
        let btn = buttons[i].id;
        buttons[i].onclick = () => {

            if(checkType(btn)==="action") {
                if (btn === "clear") {
                    calculator.clear();
                } 
    
                else if (btn === "=") {
                    if (checkType(input[input.length - 1]) === "space") {
                        inputText.innerHTML = "Error";
                        input = "0"
                    } 
                    
                    else {
                        result = solveInput(splitInput(input));
                        input = result;
                        calculator.print(result);
                    }
                }

                else if (btn === "erase") {
                    calculator.erase();
                }
            }

            else if(checkType(btn)==="operator") {
                if (input !== "0" && checkType(input[input.length-2])!=="operator") {
                    if(input[input.length-1]==".") {
                        input = input.substring(0, input.length - 1) + " ";
                    }
                    input += " " + buttons[i].id + " ";
                    inputText.innerHTML = input;
                }
            }

            else if(checkType(btn)==="other") {
                if(btn===")") {
                    let openBracketsCount=input.split('(').length-1;
                    let closeBracketsCount=input.split(')').length-1;
                    if(openBracketsCount-closeBracketsCount<1) {
                        return;
                    }
                }
                if (input==="0") {
                    input = buttons[i].id;
                    inputText.innerHTML = input;
                }

                else {
                    if(btn==="(" || btn==="π" || btn==="e") {
                        if(checkType(input[input.length-1])==="num" || input[input.length-1]===")" || input[input.length-1]==="π" || input[input.length-1]==="e") {
                            input+="×";
                        }
                    }
                    input += buttons[i].id;
                    inputText.innerHTML = input;
                }
            }

            else {
                if (btn === ".") {
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
                    if(input[input.length-1]===")" || input[input.length-1]==="π" || input[input.length-1]==="e") {
                        input+="×";
                    }
                    input += buttons[i].id;
                    inputText.innerHTML = input;
                }
            }
        }
    }

    let splitInput = (string) => {
        let arr=[];
        const reg=new RegExp('(?=[\\' + regFilter.join(',\\') + '])|(?<=[\\' + regFilter.join(',\\') + '])', "g");
        string=string.replaceAll("π",3.141);
        string=string.replaceAll("e",2.718);
        arr=string.replace(/ /g, '').split(reg);
        return addMissingBrackets(arr);
    }

    let addMissingBrackets = (array) => {
        let openBracketsCount=input.split('(').length-1;
        let closeBracketsCount=input.split(')').length-1;
        if(openBracketsCount>closeBracketsCount) {
            for(let i=0;i<openBracketsCount-closeBracketsCount;i++) {
                array.push(")");
            }
        }
        return array;
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
        return compute(queue);
    }

    let compute = (array) => {
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
        "clear": function() {
            input = "0";
            inputText.innerHTML = "0";
            q = [];
        },
        "erase": function() {
            if(input.length>1) {
                if(checkType(input[input.length-1]) === "space") {
                    input=input.slice(0, -3);
                }
                else {
                    input=input.slice(0, -1);
                }
                inputText.innerHTML = input;
            }
            else {
                input = "0";
                inputText.innerHTML = "0";
            }
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