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
calculator.stored_value = "0";
calculator.not_decimal = true;
const numbers = document.querySelector(".numbers");
const operators = document.querySelector(".operators");
const input = document.querySelector(".input");
const special_operators = document.querySelector(".special-operators");
const decimal = document.querySelector("#decimal");
const backspace = document.querySelector("#backspace");
input.inert = true;
input.value = "0";
let user_entered = false;
numbers.addEventListener("click",(event)=>{
	if (event.target === numbers) return;
	if (input.value.length > 16) return;
	if (event.target.textContent === "+/-"){
		input.value = Number(input.value) * -1;
		return
	}
	user_entered = true;
	if (event.target.textContent === "."){
		if (calculator.not_decimal) calculator.not_decimal = false;
		else return;
		if (input.value === "0"){
			input.value = "0."
			return;
		}
	}
	if (event.target.textContent === "0" && input.value === "0") return;
	input.value = input.value === "0" ? event.target.textContent : input.value + event.target.textContent;
})
operators.addEventListener("click",(event)=>{
if (event.target === operators) return;
	const key = event.target.textContent;
		const isEquals = key === "=";
		if (!user_entered && !isEquals) {
		calculator.operator = key;
		return;
		}
		let current_value = Number(input.value);
		if (calculator.operator !== undefined){
			calculator.last_rule = [calculator.operator, current_value];
			current_value = operator(Number(calculator.stored_value),calculator.operator,current_value);
		}else if (isEquals && calculator.last_rule) {
			current_value = operator(current_value, ...calculator.last_rule);
		}
		if (isEquals) {
			calculator.operator = undefined;
			if (Number.isInteger(current_value)) calculator.not_decimal = true;
			else  calculator.not_decimal = false;
			input.value = current_value;
		} else {
			user_entered = false;
			calculator.not_decimal = true;
			calculator.stored_value = current_value;
			calculator.operator = key;
			calculator.last_rule = undefined;
			input.value = "0";
		}
})
special_operators.addEventListener("click",(event) =>{
	if (event.target === special_operators) return;
	if (event.target.textContent === "AC"){
		calculator.stored_value = "0";
		calculator.not_decimal = true;
		calculator.last_rule = undefined;
		calculator.operator = undefined;
		input.value = "0";
		user_entered = false;
	}
	if (event.target.textContent === "√x"){
		input.value = Number(input.value) ** (1/2);
	}
	if (event.target.textContent === "%"){
		input.value = Number(input.value) / 100;
	}
})
backspace.addEventListener("click",()=>{
	if (input.value.at(-1) === ".") calculator.not_decimal = true;
	input.value = input.value.slice(0,input.value.length - 1) || "0";
})