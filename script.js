let string='', save='', last='', answer=0, clear=false, decimal=false;
const math=document.querySelectorAll(".math"), display=document.querySelector("textarea");
const backspace=document.querySelector(['.delete']), result=document.querySelector(['.result']);
const all_clear=document.querySelector(['.all_clear']);

math.forEach(button =>
	button.addEventListener('click', a => {
		if (clear===true && /[0-9]/.test(a.target.textContent)){
			display.value='';
			string='';
			clear=false;
		}
		else{
			if(clear==true) display.value=string; 
			clear=false;
		}
		switch (last){
			case '+': check(a.target.textContent); break;
			case '-': if (a.target.textContent!='-') check(a.target.textContent); break;
			case '×': check(a.target.textContent); break;
			case '÷': check(a.target.textContent); break;
			case '.': if (/[0-9]/.test(a.target.textContent)) input(a.target.textContent); break;
			case '√': if (a.target.textContent!=='√') decimal=false; input(a.target.textContent); break;
			case '^': if (a.target.textContent!=='^') decimal=false; input(a.target.textContent); break;
			default:
				if (decimal==true && a.target.textContent=='.'){
					;
				}
				else{
					input(a.target.textContent);
				}
				break;
		}
		if (a.target.textContent==='.') decimal=true;
		deletions(a.target.textContent);
		display.style.height=display.scrollHeight+"px";
	})
)

all_clear.addEventListener('click', a => {
	display.value='';
	string='';
	save=''; 
	last='';
	answer=0; 
	clear=false; 
	decimal=false;
	display.style.height=84+"px";
})

backspace.addEventListener('click', a => {
	if (clear===true && save!==''){
		string=save;
		display.value=save;
		save='';
		clear=false;
	}
	else{
		if (string[string.length-1]==='.') 
			decimal=false;
		string=string.substring(0, string.length-1);
		last='';
		display.value=string;
	}
})

result.addEventListener('click', a => {
	if (clear===false){
		display.value+='\r\n'+a.target.textContent;
		answer=count(string);
		let flag=0;
		console.log(answer);
		if (answer>999999999 && answer!==Infinity) flag=1;
		if (answer<-999999999 && answer!==-Infinity) flag=2;
		if (answer%10===0 && flag===1) flag=3;
		if (/\./.test(answer) && !/e/.test(answer)) if(String(answer).split('.')[1].length>12) flag=4;
		switch(flag){
			case 1: answer=Number(answer).toExponential().match(/\d.\d{1,10}/)[0] + 'e' + Number(answer).toExponential().match(/[\+]\d+$/)[0]; break;
			case 2: answer='-' + Number(answer).toExponential().match(/\d.\d{1,10}/)[0] + 'e' + Number(answer).toExponential().match(/[\+]\d+$/)[0]; break;
			case 3: answer=Number(answer).toExponential(); break;
			case 4: answer=Number(answer).toFixed(12);
			default: break;
		}
		answer=zeros(answer);
		display.value+=answer;
		display.style.height=display.scrollHeight+"px";
		clear=true;
		save=string;
		string=answer;
		flag=0;
	}
})

let input = current_input => {
	last=current_input;
	string+=current_input;
	display.value+=current_input;
}

let check = current_check => {
	if (!/[0-9\.\-\√\^]/.test(current_check)) {
		last=current_check;
		string=string.substring(0,string.length-1)+last;
		display.value=string;
		decimal=false;
	}
	else{	
		input(current_check);
		decimal=false;
	}
}

let count = string_count => {
	if (/\√/.test(string_count)) string_count=sqrt_count(string_count);
	if (/\^/.test(string_count)) string_count=pow_count(string_count);
	console.log(string_count)
	let array=string_count.split(''), temp='', numbers=[], nc=0, operators=[], oc=0, times=0;
	for (let i=0; i<=array.length; i++){
		if (/[0-9]/.test(array[i]) || array[i]==='.' || array[i]==='e' || (array[i]==='-' && !/[0-9]/.test(array[i-1]))) {
			if (array[i]=='e') {
				temp+=array[i]+array[i+1];
				i+=2;
			}
			temp+=array[i];
		}
		else{
			numbers[nc]=temp;
			if (array[i]!==undefined){
				operators[oc]=array[i];
				oc++;
			}
			if (array[i]==='×' || array[i]==='÷') times++;
			temp=''; 
			nc++;
		}
	}
	console.log(numbers, operators)
	if (times>0) rec(times, numbers, operators);
	if (numbers.length===2 && operators[0]==='e') return numbers[0].toFixed(5)+'e'+numbers[1];
	if (oc-times===0) return numbers[0]; else sum(numbers, operators);
	return numbers[0];
}

let pow_count = p_count => {
	let pos=p_count.lastIndexOf("^");
	let base='', exponent='';
	if (p_count[pos]+p_count[pos+1]==='^-'){
		pos+=2;
		exponent+='-';
	}
	else pos++;
	while (pos<p_count.length && !/[\+\-\×\÷\^\√]/.test(p_count[pos])) {
		exponent+=p_count[pos];
		pos++;
	}
	pos=p_count.lastIndexOf("^");
	pos--;
	while (pos>=0 && !/[\+\-\×\÷\^\√]/.test(p_count[pos])) {
		base=p_count[pos]+base;
		pos--;
	}
	if (p_count[pos]==='-' && (/[\+\^\×\÷]/.test(p_count[pos-1]) || p_count[pos-1]===undefined) && !/\./.test(exponent)){
		base=p_count[pos]+base;
		pos--;
	}
	console.log(base, exponent)
	let pow;
	if (/\./.test(base) && !/\./.test(exponent) && exponent>0) {
		let powLength=String(base).split('.')[1].length*exponent;
		if (powLength>8) powLength=8;
		pow=Math.pow(Number(base),Number(exponent)).toFixed(powLength);
	}
	else pow=Math.pow(Number(base),Number(exponent));
	pow=zeros(pow);
	let temp_string=p_count.substring(pos+1,p_count.length);
	p_count=p_count.substring(0,pos+1); 
	p_count=p_count+temp_string.replace(base+"^"+exponent,String(pow));
	if (/\^/.test(p_count)) p_count=pow_count(p_count);
	return p_count;
}

let zeros = pow => {
	pow=String(pow);
	while (/\./.test(pow) && /0$/.test(pow) && !/e/.test(pow)) 
		pow=pow.substring(0,pow.length-1);
	pow=pow.replace(/\.$/, '');
	return pow;
}

let sqrt_count = q_count => {
	let pos=q_count.indexOf("√");
	pos++;
	let under_sqrt='';
	while (pos<q_count.length && !/[\+\-\×\÷\^\√]/.test(q_count[pos])) {
		under_sqrt+=q_count[pos];
		pos++;
	}
	let over_sqrt=Math.sqrt(Number(under_sqrt));
	if (/\√/.test(q_count)) q_count=q_count.replace("√"+under_sqrt,"×"+over_sqrt);
	if (/\×\×/.test(q_count)) q_count=q_count.replace("××","×");
	if (/\-\×/.test(q_count)) q_count=q_count.replace("-×","-");
	if (/\+\×/.test(q_count)) q_count=q_count.replace("+×","+");
	if (/\÷\×/.test(q_count)) q_count=q_count.replace("÷×","÷");
	if (/\^\×/.test(q_count)) q_count=q_count.replace("^×","^");
	if (/\√/.test(q_count)) q_count=sqrt_count(q_count);
	if (/^\×/.test(q_count)) q_count=q_count.replace("×","");
	under_sqrt='';
	return q_count;
}

let rec = (times, numbers, operators) => {
	for (let i=0; i<operators.length; i++){
		let j=acc(numbers,i);
		if (operators[i]==='×'){
			let temp=(Math.round(numbers[i]*j)*Math.round(numbers[i+1]*j))/(j*j);
			numbers.splice(i,2,temp);
			operators.splice(i,1);
			i--;
		}
		if (operators[i]==='÷'){
			let temp=(Math.round(numbers[i]*j)/Math.round(numbers[i+1]*j));
			numbers.splice(i,2,temp);
			operators.splice(i,1);
			i--;
		}
	}
	times--;
	if (times>0) rec(times,numbers,operators);
}

let sum = (numbers, operators) => {
	for (let i=0; i<operators.length; i++){
		let j=acc(numbers,i);
		if (operators[i]==='+'){
			let temp=(Math.round(numbers[i]*j)+Math.round(numbers[i+1]*j))/j;
			numbers.splice(i,2,temp);
			operators.splice(i,1);
			i--;
		}
		if (operators[i]==='-'){
			let temp=(Math.round(numbers[i]*j)-Math.round(numbers[i+1]*j))/j;
			numbers.splice(i,2,temp);
			operators.splice(i,1);
			i--;
		}
	}
}

let acc = (numbers,i) => {
	let after_decimal1=0, after_decimal2=0;
	if (/\./.test(numbers[i])) after_decimal1=String(numbers[i]).split('.')[1].length;
	if (/\./.test(numbers[i+1])) after_decimal2=String(numbers[i+1]).split('.')[1].length;
	if (/e/.test(numbers[i])) after_decimal1=String(numbers[i]).split('e-')[1];
	if (/e/.test(numbers[i+1])) after_decimal2=String(numbers[i+1]).split('e-')[1];
	if (after_decimal1>after_decimal2) return Math.pow(10,after_decimal1); else return Math.pow(10,after_decimal2);
}

let deletions = (input) => {
	if (/\√[\+\^\×\÷\√\-]/.test(string)){
		string=string.substring(0, string.length-2);
		string+=input;
		display.value=string;
	}
	if (/[\+\-\×\÷\^][\+\×\÷\^]$/g.test(string)){
		string=string.substring(0,string.length-2)+input;
		display.value=string;
	}
	if (/^[\+\^\×\÷]/.test(string)){
		string=string.substring(1,string.length);
		display.value=string;
	}
	if (/[\^\×\÷\+\-]\^$/.test(string)){
		string=string.substring(0, string.length-2);
		string+='^';
		display.value=string;
	}
	if ((/\×\√$/).test(string)){
		string=string.replace("×√","√");
		display.value=string;
	}
	if ((/\×\×$/).test(string)){
		string=string.replace("××","×");
		display.value=string;
	}
	string=string.replace("--", "-");
	display.value=string;
}