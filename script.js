const ahjsTypeMap = {
  "ems": "EMS",
  "fire": "Fire",
  "police": "Police"
}

const getImage = (serviceType) => {
  switch(serviceType) {
    case "ems": 
      return "ems-icon.png";
    case "fire":
      return "fire-icon.png";
    case "police":
      return "police-icon.png";
    default:
      return ""
  }
}

const getEmergencyContacts = () => {
  const addr = document.getElementById("address").value;
  console.log("here: ", addr);
  console.log("https://api.precisely.com/911/v1/ahj-psap/byaddress?" + new URLSearchParams({address: addr}).toString());
  fetch("https://api.precisely.com/911/v1/ahj-psap/byaddress?" + new URLSearchParams({address: addr}).toString(), {
      headers: {
        Authorization: "Bearer XXXXXXXXXXX"
      }
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      console.log("data: ", data);
      displayResults(data);
      
    })
    .catch(err => {
      console.log("Error: ", err);
    })

  return false;   // prevent reload of page
}

const displayResults = (data) => {
 

  if(!data["ahjs"]) {   // no search results
    const results = document.getElementById("no-results-div");
    results.innerHTML = "<p class='no-results'>No Search Results<p>";
  }
  else {
    const no_results = document.getElementById("no-results-div");
    no_results.innerHTML = "";

    const results = document.getElementById("results-accordion");
    const ahjs = data["ahjs"]["ahjs"];
    for(var idx = 0; idx < ahjs.length; idx++) {
      const curEl = ahjs[idx];
      var res = document.createElement("div");
      res.innerHTML =  
        `<div class="accordion-item"> 
          <h2 class="accordion-header" id="item-${idx}"> 
            <button class="accordion-button ${idx > 0 ? 'collapsed' : ''}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${idx}" aria-expanded="${idx > 0 ? 'false' : 'true'}" aria-controls="collapse${idx}"> 
              <img class="header-img" src="${getImage(curEl["ahjType"])}" alt="${ahjsTypeMap[curEl["ahjType"]]} icon" width="50" />
              <span class="header-label-type">${ahjsTypeMap[curEl["ahjType"]]}</span>  ${curEl["agency"]}
            </button> 
          </h2> 
          <div id="collapse${idx}" class="accordion-collapse collapse ${idx > 0 ? '' : 'show'}" aria-labelledby="item-${idx}" data-bs-parent="#results-accordion"> 
            <div class="accordion-body"> 
              <span class="body-label">Phone</span>: ${curEl["phone"]} <br>
              <span class="body-label">Address</span>: ${curEl["mailingAddress"]["formattedAddress"]}
            </div> 
          </div> 
        </div>`;
        results.appendChild(res);
    }
  }
}