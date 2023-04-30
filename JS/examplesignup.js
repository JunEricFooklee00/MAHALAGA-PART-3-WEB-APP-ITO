var Form1 = document.getElementById("form1")

let name = document.querySelector(".name")
let email = document.querySelector(".email")
let username = document.querySelector(".username")
let password = document.querySelector(".password")
let contNum = document.querySelector(".contactNumber")
let address1 = document.querySelector(".address1")
let address2 = document.querySelector(".address2")
let address3 = document.querySelector(".address3")
let address4 = document.querySelector(".address4")
let zipcode = document.querySelector(".zipcode")

let nameError = document.querySelector(".name-error")
let emailError = document.querySelector(".email-error")
let usernameError = document.querySelector(".username-error")
let passwordError = document.querySelector(".password-error")
let contError = document.querySelector(".contactnumber-error")
let add1Error = document.querySelector(".address1-error")
let add2Error = document.querySelector(".address2-error")
let add3Error = document.querySelector(".address3-error")
let add4Error = document.querySelector(".address4-error")
let zipError = document.querySelector(".zipcode-error")

emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var usernameRegex = new RegExp("^[A-Za-z][A-Za-z0-9_]{7,29}$")
var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")
nameRegex = /^[a-z ,.'-]+$/i
contRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
bdayRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/

function clearError1(){
    nameError.style.display = "none"
    usernameError.style.display = "none"
    passwordError.style.display = "none"
    contError.style.display = "none"
    add1Error.style.display = "none"
    add2Error.style.display = "none"
    add3Error.style.display = "none"
    add4Error.style.display = "none"
    zipError.style.display = "none"
}

function checkName(){
    if(!name.value.match(nameRegex)){
        nameError.style.display = "flex"
        name.style = "border-color: red;"
        return false
    } else {
        nameError.style.display = "none", name.style = "border-color: green;"
        console.log("hehehe")
        return true
    }
}

function checkEmail(){

    const emailInput = email.value

    fetch("/check-email", {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        }, body: JSON.stringify({ email:emailInput }),
    })
    .then(response => response.json())
    .then(data => {
        if(data.exists){
            emailError.style.display = "flex", email.style = "border-color: red;"
            return false
        } else if(!email.value.match(emailRegex)){
            emailError.style.display = "flex", email.style = "border-color: red;"
            return false
        } else{
            emailError.style.display = "none", email.style = "border-color: green;"
            console.log("hehehe")
            return true
        }
    })
    .catch(error => console.error(error))
}

function checkUsername(){

    const usernameInput = username.value

    fetch("/check-username", {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        }, body: JSON.stringify({ username:usernameInput }),
    })
    .then(response => response.json())
    .then(data => {
        if(data.exists){
            usernameError.style.display = "flex", username.style = "border-color: red;"
            return false
        } else if(!username.value.match(usernameRegex)){
            usernameError.style.display = "flex", username.style = "border-color: red;"
            return false
        } else{
            usernameError.style.display = "none", username.style = "border-color: green;"
            return true
        }
    })
    .catch(error => console.error(error))
}

function checkPassword(){
    if(!password.value.match(strongRegex)){
        passwordError.style.display = "flex"
        password.style = "border-color: red;"
        return false
    } else{
        passwordError.style.display = "none", password.style = "border-color: green;"
        return true
    }
}

function checkContNum(){
    if(!contNum.value.match(contRegex)){
        contError.style.display = "flex"
        contNum.style = "border-color: red;"
        return false
    } else{
        contError.style.display = "none", contNum.style = "border-color: green;"
        return true
    }
}

function checkAdd1(){
    if(address1.value.length >= 8){
        add1Error.style.display = "none"
        address1.style = "border-color: green;"
        return true
    } else{
        add1Error.style.display = "flex", address1.style = "border-color: red;"
        return false
    }
}

function checkAdd2(){
    if(address2.value.length >= 8){
        add2Error.style = "display: none; left: -176px;", address2.style = "border-color: green;"
        return true
    } else{
        add2Error.style = "display: flex; left: -176px;", address2.style = "border-color: red;"
        return false
    }
}

function checkAdd3(){
    if(address3.value.length >= 8){
        add3Error.style.display = "none", address3.style = "border-color: green;"
        return true
    } else{
        add3Error.style.display = "flex", address3.style = "border-color:red;"
        return false
    }
}

function checkAdd4(){
    if(address4.value.length >= 3){
        add4Error.style = "display: none; left: -176px;", address4.style = "border-color: green;"
        return true
    } else{
        add4Error.style = "display: flex; left: -176px;", address4.style = "border-color:red;"
        return false
    }
}

function checkZip(){
    if(zipcode.value.length == 4){
        zipError.style = "display: none;", zipcode.style = "border-color: green;"
        return true
    } else{
        zipError.style = "display: flex;", zipcode.style = "border-color: red;"
        return false
    }
}

function checkInputFields1(){
    clearError1()
    let x1 = checkName()
    let x2 = checkEmail()
    let x3 = checkUsername()
    let x4 = checkPassword()
    let x5 = checkContNum()
    let x6 = checkAdd1()
    let x7 = checkAdd2()
    let x8 = checkAdd3()
    let x9 = checkAdd4()
    let x10 = checkZip()
    if(x1 != false && x2 != false && x3 != false && x4 != false && x5 != false && x6 != false && x7 != false && x8 != false && x9 != false && x10 != false) return true
    else return false
}

// document.addEventListener("DOMContentLoaded", function() {
//     const NextButtons = document.querySelector(".next");
  
//     NextButtons.addEventListener("click", function(event) {
//       const current_fs = this.parentNode;
//       const next_fs = this.parentNode.nextElementSibling;
//       const progressBar = document.querySelectorAll("#progressbar li");
  
//       if (checkInputFields1() != false) {

//         if (progressBar.length > 0) {
//         progressBar[Array.prototype.indexOf.call(document.querySelectorAll("fieldset"), next_fs)].classList.add("active");
//         }

//         next_fs.style.display = "block";
  
//         let opacity = 1;
//         const hideCurrentFieldset = setInterval(function() {
//           opacity -= 0.1;
//           current_fs.style.opacity = opacity;
  
//           if (opacity <= 0) {
//             clearInterval(hideCurrentFieldset);
//             current_fs.style.display = "none";
//             current_fs.style.position = "relative";
//             next_fs.style.opacity = 1;
//           }
//         }, 60);
//       }
  
//       event.preventDefault();
//     });
    
//   });


// function submitForm(event) {
//     event.preventDefault();
//     const form = event.target;
//     const name = form.name.value;
//     const password = form.password.value;
//     const username = form.username.value;
//     const contactNumber = form.contactNumber.value;
//     const email = form.email.value;
//     const address1 = form.address1.value;
//     const address2 = form.address2.value;
//     const address3 = form.address3.value;
//     const address4 = form.address4.value;
//     const zipcode = form.zipcode.value;
  
  
//     fetch("/Signupexample", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ name, password, username, contactNumber, email, address1, address2, address3, address4, zipcode })
//     })
//     .then(res => res.json())
//     .then(data => {
//         if(data.success) {
//             console.log(data.user)
//             if(data.user == "Admin"){
//                  window.location.href = "AdminInterface"
//             }
//             else if(data.user == "Employee"){
//                  window.location.href = "EmployeeInterface"
//             }
//             else{
//                 window.location.href = "ClientInterface"
//             }
//         }
//     })
//       .catch(err => {
//         console.error(err);
//         alert("Please fill the blanks");

//       });
//   }


  function submitForm(event) {
    event.preventDefault();
    // const form = event.target;
    // const name = form.name.value;
    // const password = form.password.value;
    // const username = form.username.value;
    // const contactNumber = form.contactNumber.value;
    // const email = form.email.value;
    // const address1 = form.address1.value;
    // const address2 = form.address2.value;
    // const address3 = form.address3.value;
    // const address4 = form.address4.value;
    // const zipcode = form.zipcode.value;
  
    // Check if any of the textboxes are empty
    if (!name || !password || !username || !contactNumber || !email || !address1 || !address2 || !address3 || !address4 || !zipcode) {
      alert("Please fill in all the fields");
      return;
    }else{
        fetch("/Signupexample", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify()
          })
          .then(res => res.json())
          .then(data => {
            if(data.success) {
              console.log(data.user)
              if(data.user == "Admin"){
                window.location.href = "AdminInterface"
              }
              else if(data.user == "Employee"){
                window.location.href = "EmployeeInterface"
              }
              else{
                window.location.href = "ClientInterface"
              }
            }
          })
          .catch(err => {
            console.error(err);
            alert("An error occurred while submitting the form");
          });

    }
  }