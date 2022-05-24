for(let i=1; i<=10; i++){
    console.log(Math.pow(2,i));
}

let num=1;
while(num<=10){
    console.log(Math.pow(2,num));
    num++;
}

let user
do{
    prompt("what's your name?");

}while(user.length ===1 || !isNaN(user))
alert('welcome${user}');
