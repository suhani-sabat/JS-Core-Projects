let arr = []; 
let add_btn = document.querySelector("button");
let ul = document.querySelector("ul");
let editIdx = null;

async function loadInitialData() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=4");
    const serverData = await response.json();
    
    arr = serverData.map(item => ({
      name: item.title,
      type: "75" 
    }));
    
    renderlist(arr);
  } catch (error) {
    console.error("Error loading startup data:", error);
    // FIXED: Show toast to the user if initial fetch fails!
    showToast("⚠️ Error: Failed to load tech stack from server.");
  }
}

function renderlist(targetArray) {
  ul.innerHTML = "";
  targetArray.forEach((element, index) => {
    let li = document.createElement("li");
    li.textContent = `Skill: ${element.name} | Proficiency: ${element.type} `;

    let delete_btn = document.createElement("button");
    delete_btn.innerText = "Delete";
    delete_btn.setAttribute("data-id", index);
    li.appendChild(delete_btn);

    let edit_btn = document.createElement("button");
    edit_btn.innerText = "Edit";
    edit_btn.setAttribute("data-id", index);
    li.appendChild(edit_btn);
    ul.appendChild(li);
  });
}

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
            renderlist(arr);
          }
        } catch (error) {
          // FIXED: Swapped old alert() for your custom toast engine!
          showToast("⚠️ Network Error: Could not save new item to the server.");
        }
      }

      skill.value = "";
      proficiency.value = "50";
    }
  });
}

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
      li.textContent = "No skill found";
      ul.appendChild(li);
    } else {
      renderlist(filteredArr);
    }
  });
}

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

// Initialization Sequence
addHandler();
actionHandler();
search();
loadInitialData();