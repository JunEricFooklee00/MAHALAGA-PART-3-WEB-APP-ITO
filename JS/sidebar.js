document.addEventListener("DOMContentLoaded", function(event) {
    
    const showNavbar = (toggleId, navId, bodyId, headerId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId),
    bodypd = document.getElementById(bodyId),
    headerpd = document.getElementById(headerId)
        
    // Validate that all variables exist
    if(toggle && nav && bodypd && headerpd){
        toggle.addEventListener('click', ()=>{
            // show navbar
            nav.classList.toggle('show')
            // change icon
            toggle.classList.toggle('bx-x')
            // add padding to body
            bodypd.classList.toggle('body-pd')
            // add padding to header
            headerpd.classList.toggle('body-pd')
            })
        }
    }
    
    showNavbar('header-toggle','nav-bar','body-pd','header')
    
    /*===== LINK ACTIVE =====*/
    const linkColor = document.querySelectorAll('.nav_link')
    
    function colorLink(){
        if(linkColor){
            linkColor.forEach(l=> l.classList.remove('active'))
            this.classList.add('active')
        }
    }
    linkColor.forEach(l=> l.addEventListener('click', colorLink))
    // Your code to run since DOM is loaded and ready
})

function dashboardSubmit(){
    document.getElementById("fDashBoard").submit()
}

function scheduleSubmit(){
    document.getElementById("fSchedule").submit()
}

function projectSubmit(){
    document.getElementById("fProject").submit()
}

function employeeSubmit(){
    document.getElementById("fEmployees").submit()
}

function clientSubmit(){
    document.getElementById("fClients").submit()
}

function settingsSubmit(){
    document.getElementById("fSettings").submit()
}

async function logoutSubmit(){
    const response = await fetch("/logout", {
        method: "POST"
    });
    const data = await response.json();
    if(data.success){
        for(let i = 0; i < history.length; i++){
            window.history.pushState({}, null, "portalpage");
        }
        window.location.href = "portalpage";
    } else{
        alert("Logout failed");
    }
}
