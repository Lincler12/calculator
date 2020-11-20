function calculator() {
    let regexString = /[x\-+\/]/;
    let previousResult;
    let resetDisplayTextAfterResult = false;
    let firstRun = false;
    const myRegexOfOperators = new RegExp(regexString, 'i');
    const displayTextElement = document.getElementById('display-text');
    let previousResultElement = document.getElementById('result');
    function clear() {
        const clearButtonElement = document.getElementById('AC');
        function clearLogic() {
            displayTextElement.textContent = '';
            previousResult = '';
            previousResultElement.textContent = '';
            previousResultElement.display = 'none';
        }
        clearButtonElement.addEventListener('click', clearLogic);
    }
    clear();
    function operation() {
        function operatorEnum() {
            return {
                ADD: '+',
                SUBTRACT: '-',
                MULTIPLY: '*',
                DIVIDE: '/',
            }
        }
        function add(number1, number2) {
            return parseInt(number1) + parseInt(number2);
        }

        function subtract(number1, number2) {
            return number1 - number2;
        }

        function multiply(number1, number2) {
            return number1 * number2;
        }

        function divide(number1, number2) {
            if (number2 === 0)
                throw console.error("division by zero");
            return number1 / number2;
        }

        function operate(operator, number1, number2) {
            switch (operator) {
                case operatorEnum().ADD:
                    result = add(number1, number2);
                    break;
                case operatorEnum().SUBTRACT:
                    result = subtract(number1, number2);
                    break;
                case operatorEnum().MULTIPLY:
                    result = multiply(number1, number2);
                    break;
                case operatorEnum().DIVIDE:
                    result = divide(number1, number2);
            }
            return result;
        }
        return {
            operatorEnum,
            operate,
        }
    }

    function evaluate() {
        if (!displayTextElement.textContent === '')
            return;
        let evalString = displayTextElement.textContent;
        let tokenizedArray = [];
        let numberStack = [];
        let operatorStack = [];
        let outputArray = [];

        function tokenizeEvalString() { //simple evalutation of only 2 numbers
            let number;
            for (let char of evalString) {
                if (isNaN(char) && char !== '.') { //if it's not a number or a dot
                    if (number) {
                        tokenizedArray.push(number);
                        number = '';
                    }
                    if (char === 'x') {
                        char = '*';
                    }
                    tokenizedArray.push(char);
                } else {
                    if (!number)
                        number = char;
                    else {
                        number += char;
                    }

                }
            }
            tokenizedArray.push(number);
        }
        tokenizeEvalString()
        function populateStacks() {
            tokenizedArray.forEach(token => {
                if (isNaN(token)) {
                    operatorStack.push(token);
                } else {
                    numberStack.push(token);
                }
            })
        }
        populateStacks();

        function result() {
            let result;
            while (operatorStack.length) {
                let length = operatorStack.length;
                for (let i = 0; i < length; i++) {
                    if (operatorStack[i] === '*' || operatorStack[i] === '/') {
                        result = operation().operate(operatorStack.splice(i, 1)[0], numberStack.splice(i, 1)[0], numberStack.splice(i, 1)[0]);

                        if (numberStack[i]) {
                            numberStack.splice(i, 0, result);
                        } else {
                            numberStack.push(result);
                        }
                        i--; //operatoStack.splice removes an element from the array
                    }
                }

                result = operation().operate(operatorStack.shift(), numberStack.shift(), numberStack.shift());

                numberStack.unshift(result);
            }
            if (numberStack[0]) {
                firstRun = true;
            }
            resetDisplayTextAfterResult = true;
            previousResult = displayTextElement.textContent;
            displayTextElement.textContent = '';
            displayTextElement.textContent = numberStack[0];
            // previousResult += '=' + displayTextElement.textContent;
            previousResult += '=';
            previousResultElement.textContent = previousResult;
            previousResultElement.style.display = 'block';
        }

        result();
    }
    document.getElementById('equals').addEventListener('click', evaluate);

    function display(e) {


        const maxCharDisplayCapacity = 11;
        const buttonElements = document.getElementsByTagName('button');
       
        function displayText(e) {
            let lastCharFromDText = displayTextElement.textContent.slice(displayTextElement.textContent.length - 1);
            if (e.target.id === 'equals' || e.target.id ==='AC') {
                return;
            }

            if (firstRun && resetDisplayTextAfterResult) {
                previousResult += displayTextElement.textContent;
                previousResultElement = document.getElementById('result');
                previousResultElement.textContent = previousResult;


            }

            if (displayTextElement.textContent.length < maxCharDisplayCapacity) {
                switch (e.target.dataset.button) {
                    case 'basic':
                        if (resetDisplayTextAfterResult) {

                            displayTextElement.textContent = ' ';
                            resetDisplayTextAfterResult = false;
                        }

                        displayTextElement.textContent += e.target.textContent;
                        break;
                    case 'options':
                        resetDisplayTextAfterResult = false;
                        if (lastCharFromDText === ' ') {
                            if (e.target.id = 'subtract') {
                                displayTextElement.textContent = e.target.textContent;
                            }
                        }
                        if (!(myRegexOfOperators.test(lastCharFromDText))) {
                            displayTextElement.textContent += e.target.textContent;
                        }

                }

            }
        }
        Array.from(buttonElements).forEach(buttonElement => {
            buttonElement.addEventListener('click', displayText);
        })
    }
    display();
}



calculator();