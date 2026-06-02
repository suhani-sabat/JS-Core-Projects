let arr = []; 
let add_btn = document.querySelector("button");
let ul = document.querySelector("ul");
let editIdx = null;

// Initialization Sequence Launcher
addHandler();
actionHandler();
search();
loadInitialData();

/**
 * Persistence Engine: Commits local application state to hardware memory string arrays
 */
function saveToLocalStorage() {
    localStorage.setItem("techStackData", JSON.stringify(arr));
}

/**
 * Asynchronous Data Stream Bootstrapper
 * Prioritizes persistent Local Cache before executing remote fetch calls
 */
async function loadInitialData() {
  const localCache = localStorage.getItem("techStackData");
  
  if (localCache) {
    console.log("⚡ Loading persistent data from LocalStorage Cache...");
    arr = JSON.parse(localCache);
    renderlist(arr);
    return; // Fast return to save server bandwidth
  }

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=4");
    const serverData = await response.json();
    
    arr = serverData.map(item => ({
      name: item.title,
      type: "75" // Default proficiency baseline for initial remote logs
    }));
    
    saveToLocalStorage(); // Lock initial down-stream data into local memory
    renderlist(arr);
  } catch (error) {
    console.error("Error loading startup data:", error);
    showToast("⚠️ Error: Failed to load tech stack from server.");
  }
}

/**
 * Dynamic DOM Structural Builder
 * Compiles rows matching your CSS flexbox specs
 */
function renderlist(targetArray) {
  ul.innerHTML = "";
  targetArray.forEach((element, index) => {
    let li = document.createElement("li");
    
    // Wrap target item descriptions inside a separate component block
    let textSpan = document.createElement("span");
    textSpan.className = "skill-info";
    textSpan.textContent = `⚡ Skill: ${element.name} | Proficiency: ${element.type}%`;
    li.appendChild(textSpan);

    // Group control action components together for CSS right alignment
    let actionControls = document.createElement("div");
    actionControls.className = "action-controls";

    let edit_btn = document.createElement("button");
    edit_btn.innerText = "Edit";
    edit_btn.setAttribute("data-id", index);
    actionControls.appendChild(edit_btn);

    let delete_btn = document.createElement("button");
    delete_btn.innerText = "Delete";
    delete_btn.setAttribute("data-id", index);
    actionControls.appendChild(delete_btn);

    li.appendChild(actionControls);
    ul.appendChild(li);
  });
}

/**
 * Action Controller: Handles data append and mutations to remote server + local cache
 */
function addHandler() {
  add_btn.addEventListener("click", async (e) => {
    e.preventDefault();
    let skill = document.querySelector("#tech");
    let proficiency = document.querySelector("#proficiency");
    let skill_name = skill.value;
    let proficiency_level = proficiency.value;

    if (skill_name.trim() !== "") {
      let myArr = { name: skill_name, type: proficiency_level };

      if (editIdx !== null) {
        try {
          const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${editIdx}`, {
            method: "PUT",
            body: JSON.stringify(myArr), 
            headers: { "Content-type": "application/json; charset=UTF-8" }
          });

          if (response.ok) {
            arr[editIdx] = myArr;
            editIdx = null;
            add_btn.innerText = "Add";
            saveToLocalStorage(); // Synchronize persistent memory cache
            renderlist(arr);
          }
        } catch (error) {
          showToast("⚠️ Network Error: Unable to update item on the server.");
        }
      } else {
        try {
          const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
            method: "POST",
            body: JSON.stringify(myArr), 
            headers: { "Content-type": "application/json; charset=UTF-8" }
          });

          if (response.ok) {
            arr.push(myArr);
            saveToLocalStorage(); // Synchronize persistent memory cache
            renderlist(arr);
          }
        } catch (error) {
          showToast("⚠️ Network Error: Could not save new item to the server.");
        }
      }

      skill.value = "";
      proficiency.value = "50"; // Reset slider indicator to baseline middle path
    }
  });
}

/**
 * Event Delegation Core Matrix
 * Intercepts dynamically generated component click paths securely
 */
function actionHandler() {
  ul.addEventListener("click", async (e) => {
    if (e.target.tagName === "BUTTON") {
      let targetIdx = parseInt(e.target.dataset.id, 10);  

      if (e.target.innerText === "Delete") {
        try {
          const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${targetIdx}`, {
            method: "DELETE"
          });

          if (response.ok) {
            arr.splice(targetIdx, 1);
            saveToLocalStorage(); // Clean persistent copy
            renderlist(arr);
          }
        } catch (error) {
          showToast("⚠️ Network Error: Unable to delete item from server.");
        }
      } else if (e.target.innerText === "Edit") {
        let targetItem = arr[targetIdx];
        document.querySelector("#tech").value = targetItem.name;
        document.querySelector("#proficiency").value = targetItem.type;
        editIdx = targetIdx;
        add_btn.innerText = "Save";
      }
    }
  });
}

/**
 * Linear Dynamic Query Array Filter Module
 */
function search() {
  let searchBox = document.querySelector("#search-box");
  searchBox.addEventListener("input", () => {
    let val = searchBox.value.toLowerCase();

    if (val.trim() === "") {
      renderlist(arr);
      return;
    }
    let filteredArr = arr.filter((obj) => obj.name.toLowerCase().includes(val));

    if (filteredArr.length === 0) {
      ul.innerHTML = "";
      let li = document.createElement("li");
      li.className = "skill-info";
      li.textContent = "❌ No matching system stack component discovered.";
      ul.appendChild(li);
    } else {
      renderlist(filteredArr);
    }
  });
}

/**
 * Hardware Overlay Component: Drops transient error logs over current view thread
 */
function showToast(message) {
    const container = document.querySelector("#notification-container");
    const toast = document.createElement("div");
    toast.className = "toast-alert";
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 4000);
}