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
//This works. Second number just ignored.
function square_root(a){
	return a ** (1/2);
}
//This works. Second number just ignored.
function percent(a){
	return a/100;
}
const operations = {
	"*" : multiply,
	"/" : divide,
	"+" : add,
	"-" : subtract,
	"√x" : square_root,
	"%" : percent,
}
function operator(first_number,operator,third_number){
	if (operator === "/" && third_number === 0) {
		error = true;
		return 	"Zero divide error. Press AC";
	}else if (operator === "√x" && first_number < 0){
		error = true;
		return 	"Negative square root error. Press AC";
	}
	return convert_to_precision(precision,operations[operator](first_number,third_number));
}
function convert_to_precision(precision_digits,number){
	//Works only to certain range. Approx 21 and -21 in exp form. 
	//If range is exceeded function shall do nothing. 
	return Number(number.toFixed(precision_digits));
}
//May be be overguard.
// But this ensures that if js file defers too much we will not start with wrong value.
//Be sure to sync html and js files about this.
let precision = 9;
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
const form_precision = document.querySelector(".set_precision");
const input_precision = document.querySelector("#setting_precision");
input.value = "0";
let error = false;
let waiting_for_number = true; //Initially we do wating for number
//Design choice - 4. or 4.0 shall be treated as 4 so are 4.000 and so on
//Calculator implementation does not commit to preseriving decimal notation after operation(for example 1.0 * 1.0) either. 
numbers.addEventListener("click",(event)=>{
	if (event.target === numbers || error) return;
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
	if (event.target === operators || error) return;
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
		//Also we allow typing to = result. This behavior is arguably more powerful tool we are giving to user's disposal.
		//Warning - this behavior is not conventional.
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
		error = false;
	}else{
		if (error) return; //AC must come before error checking.
		//Centralize logic. Give decision to be made to operator
		//Html must sync with operations. Ensure.
		const number = operator(Number(input.value),event.target.textContent);
		input.value = number;
		if (waiting_for_number && calculator.stored_value !== undefined) 
			calculator.stored_value = number;
	}
})
backspace.addEventListener("click",()=>{
	if(error) return;
	if (waiting_for_number) return //Handles cases like 5 + backspace
	let new_value = input.value.slice(0,input.value.length - 1) || "0";
	if (new_value === "-") new_value = 0;
	input.value = new_value;
})
form_precision.addEventListener("submit",(e)=>{
	//Added just for native html validation - see HTML
	e.preventDefault();
	precision = input_precision.value;
})