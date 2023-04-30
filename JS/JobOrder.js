//Delete Job
function deleteJob(id){
  const _id = document.querySelector(".clickable-item" + id + "").getAttribute("data-id")

  dataContainer.style.display = 'none'

  alert("You have Clicked Me! Your id is " + _id + "")

  fetch("/DeleteJob", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ id:_id })
  })
  .then(res => res.json())
  .then(data => {
      if(data.success){
        
      }
  })
  .catch(err => {
      alert(err)
  })
}

$(document).ready(function() {

  // Get the timestamp of the last fetched data
  const lastTimestamp = $('#users-container').data('last-timestamp')
  
  // Define a function to fetch the data from the server
  function fetchData() {
    $.ajax({
      url: '/jobs?timestamp=' + lastTimestamp,
      type: 'GET',
      dataType: 'json',
      success: function(jobs) {
        // Update the HTML with the fetched data
        let html = ''
        for (let i = 0; i < jobs.length; i++) {
          html += '<div class="deleteContainer">';
          html += '<button class="deleteButton" onclick="deleteJob(' + i + ')">';
          html += '<div class="material-symbols-sharp" style="color: red;">delete</div>';
          html += '</button>';
          html += '</div>';
          html += '<div class="clickable-item' + i + '" onclick="showEntry(' + i + ')" data-id="' + jobs[i]._id + '" style="overflow: hidden; margin-top: -50px; margin-bottom: 10px;">';
          html += '<div class="project_prog">';
          html += '<span class="material-symbols-sharp">analytics</span>';
          html += '<div class="middle">';
          html += '<div class="left">';
          html += '<h3 font-family: poppins, sans-serif;>Project Name: ' + jobs[i].ProjectName + '</h3>';
          html += '<h3 font-family: poppins, sans-serif;>Type of Work: ' + jobs[i].TypeOfWork + '</h3>';
          html += '<h3 style = font-size:20px; font-family: poppins, sans-serif;>Client Name: ' + jobs[i].ClientName + '</h3>';
          html += '</div>';
          html += '</div>';
          html += '<small class="text-muted">Last 24 Hours</small>';
          html += '</div>';
          html += '<div class="additional-info" style="display: none;" id="info-' + i + '">';
          html += '<table class="table">';
          html += '<div class="jobID" id-job="' + jobs[i]._id + '">';
          html += '<tr>';
          html += '<th style="width: auto;">Starting Date</th>';
          html += '<td>' + jobs[i].StartingDate + '</td>';
          html += '</tr>';
          html += '<tr>';
          html += '<th style="width: auto;">Expected Finish Date</th>';
          html += '<td>' + jobs[i].ExpectedFinishDate + '</td>';
          html += '</tr>';
          html += '<tr>';
          html += '<th style="width: auto;">Area</th>';
          html += '<td>' + jobs[i].Area + '</td>';
          html += '</tr>';
          html += '<tr>';
          html += '<th style="width: auto;">Unit</th>';
          html += '<td>' + jobs[i].Unit + '</td>';
          html += '</tr>';
          html += '<tr>';
          html += '<th style="width: auto;">Location</th>';
          html += '<td id="jobLocation">' + jobs[i].Location + '</td>';
          html += '</tr>';
          html += '</div>';
          html += '</table>';
          html += '</div>';
          html += '</div>';
        }
        $('#jobs-container').html(html);
      },
      error: function() {
        console.log('Error fetching data from the server')
      }
    })
  }

  // Call the fetchData function immediately
  fetchData();

  // Call the fetchData function every 1 seconds
  // setInterval(fetchData, 1000)
});

const inputArea = document.querySelector(".form-select")
const inputUnit = document.querySelector(".Unit")
const showUnit = document.querySelector("#showUnit")

inputArea.addEventListener("change", () => {
  const selectedOptionValue = inputArea.value
  const selectIdValue = document.querySelector(`[value="${selectedOptionValue}"]`).getAttribute("id-data")
  showUnit.innerHTML = ""

  switch (selectIdValue) {
    case "Site Preparation":
      showUnit.innerHTML = "Lot"
      inputUnit.value = "Lot"
      break;

    case "Carpentry Works":
      showUnit.innerHTML = "Square Meter"
      inputUnit.value = "Square Meter"
      break;

    case "Mechanical/Metal Works":
      showUnit.innerHTML = "Square Meter"
      inputUnit.value = "Square Meter"
      break;

    case "Plumbing Works":
      showUnit.innerHTML = "Linear Meter"
      inputUnit.value = "Linear Meter"
      break;

    case "Masonry Works":
      showUnit.innerHTML = "Square Meter"
      inputUnit.value = "Square Meter"
      break;

    case "Electrical Works":
      showUnit.innerHTML = "Linear Meter"
      inputUnit.value = "Linear Meter"
      break;

    case "Painting Works":
      showUnit.innerHTML = "Square Meter"
      inputUnit.value = "Square Meter"
      break;

      default:
          break;
  }
})

// Get the clickable items and the info table
const infoTable = document.querySelector('#info-table tbody')
const infoTC= document.querySelector('.info-table-container')
const dataContainer = document.querySelector('.data-container')

// Hide the data container by default
dataContainer.style.display = 'none'

// Loop through each clickable-item div and add a click event listener
function showEntry(number){
  const info = document.querySelector(`#info-${number}`).innerHTML

  // Populate the info table with the additional info
  infoTable.innerHTML = info

  // Show the data container
  dataContainer.style.display = 'block'
}

// Get the modal element
const modal = document.getElementById('exampleModal');

// When the user clicks outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function submitForm(event){
  event.preventDefault()
  const form = event.target
  const decision = checkInputFields()

  if(decision){
    fetch("/JobOrder", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ProjectName:form.projectName.value,
        cNumber:form.cNumber.value,
        Name:form.fname.value + " " +form.lname.value,
        TypeOfWork:form.TypeOfWork.value,
        Area:form.Area.value,
        Unit:form.Unit.value,
        Location:form.Location.value,
        StartingDate:form.StartingDate.value,
        ExpectedFinishDate:form.ExpectedFinishDate.value })
    })
    .then(res => res.json())
    .then(data => {
        if(data.success){
          alert("Job Order Submitted")
          document.querySelector("#exampleModalJO").classList.remove("show")
          document.querySelector("#exampleModalJO").style.display = "none"
          form.TypeOfWork.value = "Choose Type of Work"
          form.fname.value = ""
          form.lname.value = ""
          form.Area.value = ""
          form.Unit.value = ""
          form.Location.value = ""
          form.StartingDate.value = ""
          form.ExpectedFinishDate.value = ""
          showUnit.innerHTML = ""
        } else{
          alert("Submit Failed")
        }
    })
    .catch(err => {
        alert(err)
    })
  } else alert("Something is wrong with the Inputs")
}

async function showRF() {
  let id = document.querySelector("#info-table .jobID").getAttribute("id-job")

  $.ajax({
    url: '/showRF?id=' + id,
    type: 'GET',
    dataType: 'json',
    success: function(data) {
      // Update the HTML with the fetched data
      let html = ''
      let html1 = ''
      if(data.success) {
        document.querySelector(".fcontainer1").style.display = "block"
        document.querySelector(".fcontainer3").style.display = "block"
        document.querySelector(".fcontainer5").style.display = "block"
        html =  '<h3>Fetched Data!</h3>' +
                '<div class="input-group mb-2">' +
                '<span class="input-group-text">Type of Work</span>' +
                '<input disabled type="text" name="TypeofWork" id="TypeofWork" value="' + data.job.TypeOfWork + '" class="form-control">' +
                '</div>' +
                '<div class="input-group mb-2">' +
                '<span class="input-group-text" id="inputGroup-sizing-default">Area</span>' +
                '<input disabled type="number" name="Area" id="finalArea" value="' + data.job.Area + '" class="form-control">' +
                '<span id="showUnit" class="input-group-text">' + data.job.Unit + '</span>' +
                '<input hidden disabled type="text" name="Unit" id="finalUnit" class="Unit" value="' + data.job.Unit + '">' +
                '</div>' +
                '<div class="input-group mb-2">' +
                '<span class="input-group-text" id="inputGroup-sizing-default">Days Expected to Finish</span>' +
                '<input disabled type="number" name="ExpectedFinishDate" id="expFDate" class="form-control" value="' + data.job.ExpectedFinishDate + '">' +
                '<span class="input-group-text">Day/s</span>' +
                '</div>' +
                '<input hidden disabled type="text" name="finalProjectName" id="finalProjectName" class="form-control" value="' + data.job.ProjectName + '">' +
                '<input hidden disabled type="text" name="finalClientName" id="finalClientName" class="form-control" value="' + data.job.ClientName + '">' +
                '<input hidden disabled type="number" name="finalCNumber" id="finalCNumber" class="form-control" value="' + data.job.ContactNumber + '">' +
                '<input hidden disabled type="text" name="finalLocation" id="finalLocation" class="form-control" value="' + data.job.Location + '">' +
                '<input hidden disabled type="date" name="finalSDate" id="finalSDate" class="form-control" value="' + data.job.StartingDate + '">' ;
        $('#fcontainer1').html(html);
      } else {
        document.querySelector(".fcontainer2").style.display = "block"
        html1 =  '<input hidden disabled type="text" name="TypeofWork" id="TypeofWork" value="' + data.job.TypeOfWork + '">' +
                '<input hidden disabled type="number" name="Area" id="finalArea" value="' + data.job.Area + '">' +
                '<input hidden disabled type="text" name="Unit" id="finalUnit" class="Unit" value="' + data.job.Unit + '">' +
                '<input hidden disabled type="number" name="ExpectedFinishDate" id="expFDate" value="' + data.job.ExpectedFinishDate + '">' +
                '<input hidden disabled type="text" name="finalProjectName" id="finalProjectName" value="' + data.job.ProjectName + '">' +
                '<input hidden disabled type="text" name="finalClientName" id="finalClientName"value="' + data.job.ClientName + '">' +
                '<input hidden disabled type="number" name="finalCNumber" id="finalCNumber" value="' + data.job.ContactNumber + '">' +
                '<input hidden disabled type="text" name="finalLocation" id="finalLocation" value="' + data.job.Location + '">' +
                '<input hidden disabled type="date" name="finalSDate" id="finalSDate" value="' + data.job.StartingDate + '">' ;
        $('#fcontainer2').html(html1);
        const mainWorker = getWorker(data.job.TypeOfWork)
        document.querySelector("#optWorker1").value = mainWorker
        document.querySelector(".fcontainer4").style.display = "block"
        document.querySelector(".fcontainer5").style.display = "block"
        document.querySelector("#lastStep").style.display = "none"
        // html =  
        // $('#fcontainer2').html(html);
      }
    },
    error: function() {
      console.log('Error fetching data from the server')
    }
  })
}

document.querySelector("#edit").addEventListener("click", () => {
  document.querySelector("#suggestManpower").removeAttribute("disabled")
  document.querySelector("#edit").style.display = "none"
  document.querySelector("#check").style.display = "block"
  document.querySelector("#cancel").style.display = "block"
})

document.querySelector("#check").addEventListener("click", () => {
  clearList()
  document.querySelector(".containerLaborWorkers").style.display = "none"
  document.querySelector(".containerSkilledWorkers").style.display = "none"
  document.querySelector("#suggestManpower").setAttribute("disabled", true)
  document.querySelector("[data-change='changeDecision']").innerHTML = "Suggested Number of Manpower"
  document.querySelector("[data-change='changeDecision']").style = "border: 2px solid #00aeff;"
  document.querySelector("#edit").style.display = "block"
  document.querySelector("#check").style.display = "none"
  document.querySelector("#cancel").style.display = "none"
})

document.querySelector("#cancel").addEventListener("click", () => {
  clearList()
  document.querySelector(".containerLaborWorkers").style.display = "none"
  document.querySelector(".containerSkilledWorkers").style.display = "none"
  document.querySelector("#suggestManpower").setAttribute("disabled", true)
  const origValue = document.querySelector('div[predicted-value]').getAttribute("predicted-value")
  document.querySelector("#suggestManpower").value = origValue
  document.querySelector("[data-change='changeDecision']").innerHTML = "Forcasted Number of Manpower"
  document.querySelector("[data-change='changeDecision']").style = "border: 2px solid #00aeff;"
  document.querySelector("#edit").style.display = "block"
  document.querySelector("#check").style.display = "none"
  document.querySelector("#cancel").style.display = "none"
})

async function submitFinalJob(){
  const projectData = {
    clientName: document.querySelector("#finalProjectName").value,
    projName: document.querySelector("#finalClientName").value,
    startDate: document.querySelector("#finalSDate").value,
    cNumber: document.querySelector("#finalCNumber").value,
    expDate: document.querySelector("#expFDate").value,
    area: document.querySelector("#finalArea").value,
    unit: document.querySelector("#finalUnit").value,
    location: document.querySelector("#finalLocation").value,
    typeJob: document.getElementById("TypeofWork").value,
    origValue: document.querySelector("div[predicted-value]").getAttribute("predicted-value"),
    sugValue: getManpowerValue(document.querySelector("div[predicted-value]").getAttribute("predicted-value")),
    selectedWorker: getSelectedWorkers()
  };

  fetch("/submitFinalJob", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({ projectData })
  })
  .then(res => res.json())
  .then(data => {
      if(data.success){
        alert("Submit Success")
        const id = document.querySelector(".jobID").getAttribute("id-job")
        fetch("/DeleteJob", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ id:id })
        })
        .then(res => res.json())
        .then(data => {
            if(data.success){
              alert("Delete Success")
            }
        })
        .catch(err => {
            alert(err)
        })
      } else{
        alert("Submit Failed")
      }
  })
  .catch(err => {
      alert(err)
  })
}

function getManpowerValue(origValue){
  const sugValue = document.querySelector("#suggestManpower").value
  if(sugValue === origValue) return 0
  else return sugValue
}

function getSelectedWorkers() {
  const selectedWorkers = document.querySelectorAll("[data-selected='true']")
  const workers = []

  selectedWorkers.forEach((worker) => {
    let data = worker.value
    workers.push(data)
  })

  return workers
}

nameRegex = /^[a-z ,.'-]+$/i
contRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im

let projectName = document.querySelector("#projectName")
function checkProjectname(){
    if(projectName.value == ""){
        projectName.style = "border-color: red;"
        return false
    } else {
        projectName.style = "border-color: green;"
        console.log("hehehe")
        return true
    }
}

let firstname = document.querySelector("#fname")
function checkFirstname(){
    if(firstname.value == ""){
        firstname.style = "border-color: red;"
        return false
    } else {
        firstname.style = "border-color: green;"
        console.log("hehehe")
        return true
    }
}

let lastname = document.querySelector("#lname")
function checkLastname(){
    if(lastname.value == ""){
        lastname.style = "border-color: red;"
        return false
    } else {
        lastname.style = "border-color: green;"
        console.log("hehehe")
        return true
    }
}

let TypeOfWork = document.querySelector("#TypeOfWork")
function CheckTypeOfWork(){
    if(TypeOfWork.value.match("Choose Type of Work")){
        TypeOfWork.style = "border-color: red;"
        return false
    } else {
        TypeOfWork.style = "border-color: green;"
        console.log("hehehe")
        return true
    }
}

let Area = document.querySelector("#Area")
function checkArea(){
    if(Area.value == ""){
        Area.style = "border-color: red;"
        return false
    } else {
        Area.style = "border-color: green;"
        console.log("hehehe")
        return true
    }
}

let contNum = document.querySelector("#cNumber")
function checkContNum(){
  if(!contNum.value.match(contRegex)){
      contNum.style = "border-color: red;"
      return false
  } else{
      contNum.style = "border-color: green;"
      return true
  }
}

let Unit = document.querySelector("#Unit")
function checkUnit(){
    if(Unit.value == ""){
        Unit.style = "border-color: red;"
        return false
    } else {
        Unit.style = "border-color: green;"
        return true
    }
}

let Location = document.querySelector("#Location")
function checkLocation(){
    if(Location.value ==""){
        Location.style = "border-color: red;"
        return false
    } else {
        Location.style = "border-color: green;"
        console.log("hehehe")
        return true
    }
}

let StartingDate = document.querySelector("#StartingDate")
function checkStartingDate(){
    if(StartingDate.value ==""){
        StartingDate.style = "border-color: red;"
        return false
    } else {
        StartingDate.style = "border-color: green;"
        console.log("hehehe")
        return true
    }
}

let ExpectedFinishDate = document.querySelector("#ExpectedFinishDate")
function checkExpectedFinishDate(){
    if(ExpectedFinishDate.value == ""){
        ExpectedFinishDate.style = "border-color: red;"
        return false
    } else {
        ExpectedFinishDate.style = "border-color: green;"
        console.log("hehehe")
        return true
    }
}

function clearError(){
  projectName.style.display = "none"
  firstname.style.display = "none"
  lastname.style.display = "none"
  contNum.style.display = "none"
  TypeOfWork.style.display = "none"
  Area.style.display = "none"
  Unit.style.display = "none"
  StartingDate.style.display = "none"
  ExpectedFinishDate.style.display = "none"
}

function checkInputFields(){
    clearError()
    let x1 = checkProjectname()
    let x2 = checkFirstname()
    let x3 = checkLastname()
    let x4 = CheckTypeOfWork()
    let x5 = checkArea()
    let x6 = checkUnit()
    let x7 = checkLocation()
    let x8 = checkStartingDate()
    let x9 = checkExpectedFinishDate()
    let x10 = checkContNum()
    if(x1 != false && x2 != false && x3 != false && x4 != false && x5 != false && x6 != false && x7 != false && x8 != false && x9 != false && x10 != false) return true
    else return false
}

// document.addEventListener("DOMContentLoaded", function() {
//   const NextButtons = document.querySelector(".Submit");

//   NextButtons.addEventListener("click", function(event) {
//     const current_fs = this.parentNode;
//     const next_fs = this.parentNode.nextElementSibling;
//     const progressBar = document.querySelectorAll("#progressbar li");

//     if (checkInputFields1() != false) {
//     }

//     event.preventDefault();
//   });
  
// });