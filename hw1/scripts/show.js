window.onload = function() {

    var ex1 = document.getElementById('date');
    var ex2 = document.getElementById('time');

    ex1.onclick = dt;
    ex2.onclick = tt;
    

}

function dt() {
    var my_time = new Date()
    var d = my_time.toISOString().split('T')[0]
    var x = " "
    let radius = document.querySelector("#radius");
    radius.innerText ="The date is "+ d;
}

function tt() {
    var my_time = new Date()
    var n = my_time.toLocaleTimeString();
    let radius = document.querySelector("#radius");
    radius.innerText ="The time is "+ n;
}