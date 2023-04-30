//your javascript goes here
var currentTab = 0;
document.addEventListener("DOMContentLoaded", function(event) {
    showTab(currentTab);
});

function showTab(n) {
    var x = document.getElementsByClassName("tab");
    x[n].style.display = "block";
    if (n == 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "Submit";
        const nextBtn = document.querySelector("#nextBtn");
        nextBtn.onclick = () => {
            submitFinalJob(); // Replace this with the desired new onclick function
        };
    } else {
        document.getElementById("nextBtn").innerHTML = "Next";
        const nextBtn = document.querySelector("#nextBtn");
        nextBtn.onclick = () => {
            nextPrev(1); // Replace this with the desired new onclick function
        };
    }
    fixStepIndicator(n)
}

function closeRF(){
    document.querySelector(".fcontainer1").style.display = "none"
    document.querySelector(".fcontainer2").style.display = "none"
    document.querySelector(".fcontainer3").style.display = "none"
    document.querySelector(".fcontainer4").style.display = "none"
    document.querySelector(".fcontainer5").style.display = "none"
    document.querySelector(".fcontainer1").innerHTML = ""
    document.querySelector("#manualInputManpower").value = ""
    document.querySelector("[data-change='changeDecision']").style = "none"
    document.querySelectorAll(".tab")[currentTab].style.display = "none"
    document.getElementById('predictionResult').innerHTML = ""
    document.querySelector('#suggestManpower').value = ""
    document.querySelector('#optWorker').value = ""
    clearList()
    document.querySelector(".containerLaborWorkers").style.display = "none"
    document.querySelector(".containerSkilledWorkers").style.display = "none"
    currentTab = 0
    nextPrev(currentTab)
    showTab(currentTab)
    fixStepIndicator(currentTab)
}

function clearList() {
    const matchedProfilesList = document.querySelector(".containerSkilledWorkers");
    matchedProfilesList.innerHTML = ""; // Remove all child elements
  }

function nextPrev(n) {
    var x = document.getElementsByClassName("tab");
    if (n == 1 && !validateForm()) return false;
    x[currentTab].style.display = "none";
    currentTab = currentTab + n;
    if (currentTab >= x.length) {
        // document.getElementById("regForm").submit();
        // return false;
        //alert("sdf");
        document.getElementById("nextprevious").style.display = "none";
        document.getElementById("all-steps").style.display = "none";
        document.getElementById("register").style.display = "none";
        document.getElementById("text-message").style.display = "block";
    }
    showTab(currentTab);
}

function validateForm() {
    var x, y, i, valid = true;
    // x = document.getElementsByClassName("tab");
    // y = x[currentTab].getElementsByTagName("input");
    // for (i = 0; i < y.length; i++) {
    //     if (y[i].value == "") {
    //         y[i].className += " invalid";
    //         valid = false;
    //     }
    // }
    if (valid) { document.getElementsByClassName("step")[currentTab].className += " finish"; }
    return valid;
}

function fixStepIndicator(n) {
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) { x[i].className = x[i].className.replace(" active", ""); }
    x[n].className += " active";
}