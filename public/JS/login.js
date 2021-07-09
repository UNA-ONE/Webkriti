const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});


var state= false;
function toggle(){
    if(state){
	document.getElementById("password").setAttribute("type","password");
	document.getElementById("eye").style.color='#7a797e';
	state = false;
     }
     else{
	document.getElementById("password").setAttribute("type","text");
	document.getElementById("eye").style.color='#5887ef';
	state = true;
     }
}

