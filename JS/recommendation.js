// RECOMMENDATION FUNCTIONS
async function sendData() {
    requestSkilled()
    requestLabor()
    document.querySelector(".containerLaborWorkers").style.display = "block"
}

// Client-side code
async function requestSkilled() {
    const projectLocation = document.querySelector("#jobLocation").innerHTML
    const optimalWorker = document.querySelector("#optWorker").value

    if (optimalWorker && projectLocation) {
        console.log('Sending data to API endpoint: ', { optimalWorker:optimalWorker, projectLocation:projectLocation });

        const response = await fetch('/recommendation', {
            method: 'POST',
            body: JSON.stringify({ optimalWorker, projectLocation }),
            headers: { 'Content-Type': 'application/json' }
        })

        if (!response.ok) {
            throw new Error('Failed to send data to API endpoint')
        }

        const matchedProfiles = await response.json()
        
        displayMatchedProfiles1(matchedProfiles)
    }
}

async function requestLabor() {
  const projectLocation = document.querySelector("#jobLocation").innerHTML
  const optimalWorker = "Labor"

  if (optimalWorker && projectLocation) {
      console.log('Sending data to API endpoint: ', { optimalWorker:optimalWorker, projectLocation:projectLocation });

      const response = await fetch('/recommendation', {
          method: 'POST',
          body: JSON.stringify({ optimalWorker, projectLocation }),
          headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
          throw new Error('Failed to send data to API endpoint')
      }

      const matchedProfiles = await response.json()
      
      displayMatchedProfiles2(matchedProfiles)
  }
}

let selectedCount = 0; // Counter for selected items

function displayMatchedProfiles1(matchedProfiles) {
  clearList()
  const selectLimiter = document.querySelector("#suggestManpower").value
  const matchedProfilesList = document.querySelector(".containerSkilledWorkers");

  let allProfiles = [];

  // Check if matchedProfiles is an array
  if (Array.isArray(matchedProfiles)) {
    // Combine all sets of matched profiles
    matchedProfiles.forEach((profileSet) => {
      allProfiles = allProfiles.concat(profileSet);
    });

    allProfiles.forEach((profile) => {
      console.log(profile)
      const button = document.createElement("button");
      button.classList.add("list-group-item", "btn");
      button.setAttribute("type", "button");
      button.setAttribute("data-selected", "false");
      button.setAttribute("value", profile._id);

      const ul = document.createElement("ul");
      ul.classList.add("list-group", "list-group-horizontal-sm");

      const nameLi = document.createElement("li");
      nameLi.classList.add("list-group-item");
      nameLi.innerText = profile.name;

      const addressLi = document.createElement("li");
      addressLi.classList.add("list-group-item");
      addressLi.innerText = profile.address;

      const jobTypeLi = document.createElement("li");
      jobTypeLi.classList.add("list-group-item");
      jobTypeLi.innerText = profile.jobType;

      const distanceLi = document.createElement("li");
      distanceLi.classList.add("list-group-item");
      distanceLi.innerText = profile.distance;

      ul.appendChild(nameLi);
      ul.appendChild(addressLi);
      ul.appendChild(jobTypeLi);
      ul.appendChild(distanceLi);

      button.appendChild(ul);

      button.addEventListener("click", () => {
        // Handle button click event
        const isSelected = button.getAttribute("data-selected");

        if (isSelected === "false" && selectedCount < selectLimiter) {
          button.setAttribute("data-selected", "true");
          button.classList.add("active");
          selectedCount++;
          // Perform actions when the button is selected
          console.log("Button selected:", profile.name);
          // Add your custom logic here
        } else if (isSelected === "true") {
          button.setAttribute("data-selected", "false");
          button.classList.remove("active");
          selectedCount--;
          // Perform actions when the button is deselected
          console.log("Button deselected:", profile.name);
          // Add your custom logic here
        }
      });

      matchedProfilesList.appendChild(button);
    });
    matchedProfilesList.style.display = "block"
  }
}

function displayMatchedProfiles2(matchedProfiles) {
  const selectLimiter = document.querySelector("#suggestManpower").value
  const matchedProfilesList = document.querySelector(".containerLaborWorkers");

  let allProfiles = [];

  // Check if matchedProfiles is an array
  if (Array.isArray(matchedProfiles)) {
    // Combine all sets of matched profiles
    matchedProfiles.forEach((profileSet) => {
      allProfiles = allProfiles.concat(profileSet);
    });

    allProfiles.forEach((profile) => {
      const button = document.createElement("button");
      button.classList.add("list-group-item", "btn");
      button.setAttribute("type", "button");
      button.setAttribute("data-selected", "false");
      button.setAttribute("value", profile._id);

      const ul = document.createElement("ul");
      ul.classList.add("list-group", "list-group-horizontal-sm");

      const nameLi = document.createElement("li");
      nameLi.classList.add("list-group-item");
      nameLi.innerText = profile.name;

      const addressLi = document.createElement("li");
      addressLi.classList.add("list-group-item");
      addressLi.innerText = profile.address;

      const jobTypeLi = document.createElement("li");
      jobTypeLi.classList.add("list-group-item");
      jobTypeLi.innerText = profile.jobType;

      const distanceLi = document.createElement("li");
      distanceLi.classList.add("list-group-item");
      distanceLi.innerText = profile.distance;

      ul.appendChild(nameLi);
      ul.appendChild(addressLi);
      ul.appendChild(jobTypeLi);
      ul.appendChild(distanceLi);

      button.appendChild(ul);

      button.addEventListener("click", () => {
        // Handle button click event
        const isSelected = button.getAttribute("data-selected");

        if (isSelected === "false" && selectedCount < selectLimiter) {
          button.setAttribute("data-selected", "true");
          button.classList.add("active");
          selectedCount++;
          // Perform actions when the button is selected
          console.log("Button selected:", profile.name);
          // Add your custom logic here
        } else if (isSelected === "true") {
          button.setAttribute("data-selected", "false");
          button.classList.remove("active");
          selectedCount--;
          // Perform actions when the button is deselected
          console.log("Button deselected:", profile.name);
          // Add your custom logic here
        }
      });

      matchedProfilesList.appendChild(button);
    });
  }
  matchedProfilesList.style.display = "block"
}

function clearList() {
  const matchedProfilesList1 = document.querySelector(".containerSkilledWorkers")
  matchedProfilesList1.innerHTML = ""
  const matchedProfilesList2 = document.querySelector(".containerLaborWorkers")
  matchedProfilesList2.innerHTML = ""
  selectedCount = 0
}

// function getSkilled(){
//   const optWorker = document.querySelector("#optWorker").value

//   $.ajax({
//     url: '/skilledWorker?worker=' + optWorker,
//     type: 'GET',
//     dataType: 'json',
//     success: function(data) {
//       // Update the HTML with the fetched data
//       let html = ''
//       for (let i = 0; i < data.length; i++) {
//         html = `<button class="list-group-item btn" type="button" id="button1" data-selected="false">
//                   <ul class="list-group list-group-horizontal-sm">
//                       <li class="list-group-item">${data[i].name}</li>
//                       <li class="list-group-item">${data[i].address}</li>
//                       <li class="list-group-item">${data[i].jobType}</li>
//                   </ul>
//                 </button>`;
//       }
//       $('.containerSkilledWorkers').html(html)
//     },
//     error: function() {
//       console.log('Error fetching data from the server')
//     }
//   })
// }

// const buttons = document.querySelectorAll('.btn');

// buttons.forEach(button => {
//   button.addEventListener('click', function() {
//     // If the button is already selected, deselect it
//     if (button.dataset.selected === "true") {
//       button.classList.remove('active');
//       button.dataset.selected = "false";
//     }
//     // If the button is not selected and two buttons are already selected, do nothing
//     else if (document.querySelectorAll('.btn.active').length == 4) {
//       return;
//     }
//     // If the button is not selected and less than two buttons are selected, select it
//     else {
//       button.classList.add('active');
//       button.dataset.selected = "true";
//     }
//   });
// });
