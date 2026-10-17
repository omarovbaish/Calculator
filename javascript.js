function add(a,b){
	return a + b;
}
function subtract(a,b){
	return a - b;
}
function multiply(a,b){
	return a * b;
}
function divide(a,b){
	return a / b;
}
const operations = {
	"*" : multiply,
	"/" : divide,
	"+" : add,
	"-" : subtract,
}
function operator(first_number,operator,third_number){
	if (operator === "/" && third_number === 0) return "Zero divide error"
	return operations[operator](first_number,third_number);
}
const calculator = document.querySelector(".calculator");
calculator.operator = undefined;
calculator.last_rule = undefined;
calculator.stored_value = undefined;
const numbers = document.querySelector(".numbers");
const operators = document.querySelector(".operators");
const input = document.querySelector(".input");
const special_operators = document.querySelector(".special-operators");
const decimal = document.querySelector("#decimal");
const backspace = document.querySelector("#backspace");
input.value = "0";
let waiting_for_number = true; //Initially we do wating for number
numbers.addEventListener("click",(event)=>{
	if (event.target === numbers) return;
	if (event.target.textContent === "+/-"){
		const negative_number = Number(input.value) * -1;
		input.value = negative_number;
		if (waiting_for_number && calculator.stored_value !== undefined) 
			calculator.stored_value = negative_number;
		return
	}
	//Must stay BEFORE lenght checking
	if (waiting_for_number) {
		input.value = "0";
		waiting_for_number = false;
	}
	if (input.value.length > 16) return;
	if (event.target.textContent === "."){
		//dot problem should be resolved when inputting numbers. Not in operators.
		//Warning - this version does NOT handle exponential form. Later on it will be fixed with regular expression.
		if (!input.value.includes(".")){
			input.value += event.target.textContent;
		}
		return;
	}
	if (event.target.textContent === "0" && input.value === "0") return;
	input.value = input.value === "0" ? event.target.textContent : input.value + event.target.textContent;
})
operators.addEventListener("click",(event)=>{
	if (event.target === operators) return;
	const key = event.target.textContent;
	const isEquals = key === "=";
	 //Just change operator. We are waiting.
	if (calculator.operator !== undefined && waiting_for_number){
		if (!isEquals) calculator.operator = key; //= as first operator is not valid.
		return; //There is nothing for us to do for now
	}
	//If user did not enter first number - we do nothing(this ensures sequence like this: = or + is handled properly)
	if (waiting_for_number) return;

	if (calculator.operator !== undefined){
		const number = Number(input.value);
		calculator.last_rule = [calculator.operator,number] //Remember last rule
		input.value = operator(calculator.stored_value,calculator.operator,number);
		if (isEquals){
			calculator.operator = undefined //Assure consecutive equal sign will trigger last_rule behavior.
			calculator.stored_value = undefined//This will ensure data will not be corrupted by +/-;
			//Do not save operator or result.
			//Also we allow typing to = result.This behavior is aligned with previous version.
			return 
		}
	}else if(isEquals){
		//We have no last_rule yet. Just skip(this ensures sequence like this: 5 = is handled properly)
		if (calculator.last_rule === undefined){
			return;
		};
		//Compute with last_rule
		input.value = operator(Number(input.value),...calculator.last_rule);
		//Do not save operator or result.
		//Also we allow typing to = result.This behavior is aligned with previous version.
		return;
	}
	calculator.stored_value = Number(input.value);
	calculator.operator = key;
	waiting_for_number = true; //We wait for second number
})
special_operators.addEventListener("click",(event) =>{
	if (event.target === special_operators) return;
	if (event.target.textContent === "AC"){
		calculator.stored_value = undefined;
		calculator.last_rule = undefined;
		calculator.operator = undefined;
		input.value = "0";
		waiting_for_number = true;
	}
	if (event.target.textContent === "√x"){
		const number = Number(input.value) ** (1/2);
		input.value = number;
		if (waiting_for_number && calculator.stored_value !== undefined) 
			calculator.stored_value = number;
	}
	if (event.target.textContent === "%"){
		const number = Number(input.value) / 100;
		input.value = number;
		if (waiting_for_number && calculator.stored_value !== undefined) 
			calculator.stored_value = number;
	}
})
backspace.addEventListener("click",()=>{
	if (waiting_for_number) return //Handles cases like 5 + backspace
	let new_value = input.value.slice(0,input.value.length - 1) || "0";
	if (new_value === "-") new_value = 0;
	input.value = new_value;
})