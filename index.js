

const modal = document.querySelector(".searchPopupModal");
const modalTop = document.querySelector(".searchPopupModalEdit"); 
const inputName = document.getElementById("inputName");
const inputVacancy = document.getElementById("inputVacancy");
const inputPhone = document.getElementById("inputPhone");
const btnAdd = document.getElementById("btnAdd");
const btnClearList = document.getElementById("btnClearList");
const btnSearch = document.getElementById("btnSearch");
const firstColumn = document.getElementById("firstColumn");
const secondColumn = document.getElementById("secondColumn");
const table = document.getElementById("table");
const searchPopup = document.querySelector(".searchPopup");
const btnCloseModal = document.querySelectorAll('.btnCloseModal')
const nameEdit = document.getElementById("nameEdit");
const vacancyEdit = document.getElementById("vacancyEdit");
const phoneEdit = document.getElementById("phoneEdit");
const btnEditCandidate = document.getElementById("btnEditCandidate");
const searchCandidatesList = document.getElementById("searchCandidatesList");
const searchCandidatesListResult = document.getElementById("searchCandidatesListResult");
const showAllCandidates = document.getElementById("showAllCandidates");


const candidatesData = {
  allCandidates: {},
};

function saveToLocalStorage() {
  localStorage.setItem(
    "candidatesData",
    JSON.stringify(candidatesData.allCandidates)
  );
}

function loadFromLocalStorage() {
  const saveData = localStorage.getItem("candidatesData");
  if (saveData) {
    candidatesData.allCandidates = JSON.parse(saveData);
  }
}

function initCandidatesData() {
  loadFromLocalStorage();

  if (Object.keys(candidatesData.allCandidates).length == 0) {
    const alphabet = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
    candidatesData.allCandidates = {};

    for (let letter of alphabet) {
      candidatesData.allCandidates[letter] = {};
    }

    saveToLocalStorage();
  }
}

function renderCandidates() {
  loadFromLocalStorage();

  const activeLetters = new Set();
  document.querySelectorAll(".candidatesList > li.active").forEach((item) => {
    activeLetters.add(item.textContent[0]);
  });

  firstColumn.innerHTML = "";
  secondColumn.innerHTML = "";

  const letters = Object.keys(candidatesData.allCandidates);
  console.log(letters);
  const half = Math.ceil(letters.length / 2);

  letters.forEach((letter, index) => {
    const letterItem = document.createElement("li");
    letterItem.textContent = letter;

    const candidates = candidatesData.allCandidates[letter];

    const countCandidates = document.createElement("span");

    if (Object.keys(candidates).length > 0) {
      countCandidates.textContent = Object.keys(candidates).length;
      countCandidates.classList.add("countCandidates");
      letterItem.appendChild(countCandidates);
    }

    if (Object.keys(candidates).length > 0) {
      const candidatesList = document.createElement("ul");

      Object.values(candidates).forEach((candidate) => {
        const candidateItem = document.createElement("li");
        const itemName = document.createElement("span");
        const itemVacancy = document.createElement("span");
        const itemPhone = document.createElement("a");

        itemName.textContent = `Имя: ${candidate.name}`;
        itemVacancy.textContent = `Вакансия: ${candidate.vacancy}`;
        itemPhone.textContent = `Телефон: ${candidate.phone}`;

        candidateItem.appendChild(itemName);
        candidateItem.appendChild(itemVacancy);
        candidateItem.appendChild(itemPhone);

        candidatesList.appendChild(candidateItem);

        const btnDelete = document.createElement("button");
        btnDelete.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        btnDelete.classList.add("btnDelete");

        candidateItem.appendChild(btnDelete);

        btnDelete.onclick = function () {
          deleteCandidate(candidate.id);
        };

        const btnEdit = document.createElement("button");
        btnEdit.innerHTML = '<i class="fa-solid fa-pencil"></i>';
        btnEdit.classList.add("btnEdit");

        candidateItem.appendChild(btnEdit);

        btnEdit.onclick = function () {
          editCandidate(candidate.id);
        };
      });

      letterItem.appendChild(candidatesList);

      if (activeLetters.has(letter)) {
        letterItem.classList.add("active");
      }
    }

    if (index < half) {
      firstColumn.append(letterItem);
    } else {
      secondColumn.append(letterItem);
    }
  });
}

table.onclick = function (e) {
  let target = e.target;
  if (target.tagName === "LI") {
    if (target.children.length > 0) {
      target.classList.toggle("active");
    }
  }
};

btnAdd.addEventListener("click", function () {

  const name = inputName.value.trim();
  const vacancy = inputVacancy.value.trim();
  const phone = inputPhone.value.trim();

  let hasError = false;


  
  if (!name || name.length <= 3) {
    inputName.classList.toggle("error");
    inputName.value = "";
    inputName.placeholder = "Некорректное имя";

    setTimeout(() => {
      inputName.classList.toggle("error");
      inputName.placeholder = "Введите имя";
    }, 3000);

    hasError = true;
  } else {
    const firstLetter = name[0].toUpperCase();

    if (!candidatesData.allCandidates.hasOwnProperty(firstLetter)) {
      inputName.classList.toggle("error");
      inputName.value = "";
      inputName.placeholder = "Используйте кириллицу";

      setTimeout(() => {
        inputName.classList.toggle("error");
        inputName.placeholder = "Введите имя";
      }, 3000);

      hasError = true;
    }
  }

  if (!vacancy || vacancy.length < 3) {
    inputVacancy.classList.toggle("error");
    inputVacancy.value = "";
    inputVacancy.placeholder = "Некорректная вакансия";
  
    setTimeout(() => {
      inputVacancy.classList.toggle("error");
      inputVacancy.placeholder = "Введите вакансию";
    }, 3000);

    hasError = true;
  }

  if (!phone || phone.length < 11 || phone[0] !== "+") {
    inputPhone.classList.toggle("error");
    inputPhone.placeholder = "Некорректный телефон";

    setTimeout(() => {
      inputPhone.classList.toggle("error");
      inputPhone.placeholder = "Введите телефон +7...";
    }, 3000);

    hasError = true;
  }


  if (hasError) return;

  const firstLetter = name[0].toUpperCase();

  if (candidatesData.allCandidates[firstLetter]) {
    const candidate = {
      id: Date.now(),
      name: name,
      vacancy: vacancy,
      phone: phone,
    };

    candidatesData.allCandidates[firstLetter][candidate.id] = candidate;
    saveToLocalStorage();
    renderCandidates();

    inputName.value = "";
    inputVacancy.value = "";
    inputPhone.value = "";
  }
});

btnClearList.addEventListener("click", deleteAllCandidates);
btnSearch.addEventListener("click", function() {
   modal.classList.add("active");
   searchPopup.classList.add("active");
});

btnCloseModal.forEach(btn => {
  btn.addEventListener("click", function () {
   if (modalTop.classList.contains("active")) {
     modalEdit.classList.remove("active");
     modalTop.classList.remove("active");
     
   } else {
     modal.classList.remove("active");
     modalEdit.classList.remove("active");
     searchPopup.classList.remove("active");
   }
  });
})


function deleteCandidate(candidateId) {
  for (let letter in candidatesData.allCandidates) {
    for (let candidateName in candidatesData.allCandidates[letter]) {
      const candidate = candidatesData.allCandidates[letter][candidateName];

      if (candidate.id === candidateId) {
        delete candidatesData.allCandidates[letter][candidate.id];

        saveToLocalStorage();
        renderCandidates();
      }
    }
  }
}

function editCandidate(candidateId) {
  let foundCandidate = null
  let foundLetter = null

  for (let letter in candidatesData.allCandidates) {
    if (candidatesData.allCandidates[letter][candidateId]) {

      foundCandidate = candidatesData.allCandidates[letter][candidateId];
      foundLetter = letter;
      break;
    }
  }

   if(!foundCandidate) return

      
  modal.classList.add("active");
  modalEdit.classList.add("active");

  nameEdit.value = foundCandidate.name;
  vacancyEdit.value = foundCandidate.vacancy;
  phoneEdit.value = foundCandidate.phone;

  btnEditCandidate.onclick = function () {
    const newName = nameEdit.value.trim();
    const newVacancy = vacancyEdit.value.trim();
    const newPhone = phoneEdit.value.trim();

    if(!newName || newName.length <= 3) {
      alert('Некорректное имя')
      return
    }
     
    const newFirstLetter = newName[0].toUpperCase();

    if (!candidatesData.allCandidates.hasOwnProperty(newFirstLetter)) {
      alert('Используйте кириллицу');
      return;
    }

    if (!newVacancy || newVacancy.length <= 3) {
      alert("Некорректное имя");
      return;
    }
    if (!newPhone || newPhone.length < 11 || newPhone[0] !== '+') {
      alert("Некорректное имя");
      return;
    }

    if (foundLetter !== newFirstLetter) {
      delete candidatesData.allCandidates[foundLetter][candidateId];

      
      foundCandidate.name = newName;
      foundCandidate.vacancy = newVacancy;
      foundCandidate.phone = newPhone;

      candidatesData.allCandidates[newFirstLetter][candidateId] = foundCandidate;
    } else {
      foundCandidate.name = newName;
      foundCandidate.vacancy = newVacancy;
      foundCandidate.phone = newPhone;
    }

    if(modalTop.classList.contains('active')) {
      modalEdit.classList.remove('active')
      modalTop.classList.remove('active')
    } else {
      modal.classList.remove("active");
      modalEdit.classList.remove("active");
    }
    
    saveToLocalStorage();
    renderCandidates();
    
    if(searchPopup.classList.contains('active')) {
      renderSearchResults(searchCandidatesListResult.value)
    }
  };
}

function deleteAllCandidates() {
  if(!confirm("Вы уверены, что хотите удалить всех кандидатов?")) {
    return
  }

  for (let letter in candidatesData.allCandidates) {
    candidatesData.allCandidates[letter] = {}
  } 
  saveToLocalStorage();
  renderCandidates();
  return; 
}


function renderSearchResults(searchTerm = '') {
  searchCandidatesList.innerHTML = "";
  
  const allCandidates = getAllCandidates();
  console.log(allCandidates);


  const filteredCandidates = allCandidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.vacancy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if(filteredCandidates.length === 0) {
      const noResult = document.createElement('li')
      noResult.textContent = "Результаты не найдены"
      searchCandidatesList.appendChild(noResult);
  }

  filteredCandidates.forEach(candidate => {
    const candidateItem = document.createElement('li')
  
    const itemName = document.createElement("div");
    const itemVacancy = document.createElement("div");
    const itemPhone = document.createElement("a");

    itemName.textContent = `Имя: ${candidate.name}`;
    itemVacancy.textContent = `Вакансия: ${candidate.vacancy}`;
    itemPhone.textContent = `Телефон: ${candidate.phone}`;

    candidateItem.appendChild(itemName);
    candidateItem.appendChild(itemVacancy);
    candidateItem.appendChild(itemPhone);

    const btnDelete = document.createElement('button')
    btnDelete.classList.add("btnDelete");
    btnDelete.innerHTML = '<i class="fa-solid fa-xmark"></i>';  

    btnDelete.onclick = function() {
      deleteCandidate(candidate.id)
      saveToLocalStorage();
      renderCandidates()
      renderSearchResults(searchCandidatesListResult.value);
    }

    const btnEdit = document.createElement("button");
    btnEdit.classList.add("btnEdit");
    btnEdit.innerHTML = '<i class="fa-solid fa-pencil"></i>';

    btnEdit.onclick = function () {
      if (modal.classList.contains("active")) {
        modalTop.classList.add("active");
      }

      editCandidate(candidate.id);
      saveToLocalStorage()   
      renderCandidates();
      renderSearchResults(searchCandidatesListResult.value);

    };

    candidateItem.appendChild(btnDelete);
    candidateItem.appendChild(btnEdit);

    searchCandidatesList.appendChild(candidateItem);
  })
}

searchCandidatesListResult.addEventListener('input', function() {
    renderSearchResults(this.value)
})

showAllCandidates.addEventListener('click', function() {
    renderSearchResults();

})

function getAllCandidates() {
  const allCandidates = []
  for(let letter in candidatesData.allCandidates) {
    for(let candidateId in candidatesData.allCandidates[letter]) {
      allCandidates.push(candidatesData.allCandidates[letter][candidateId]);
    }
  }
  return allCandidates;
}



initCandidatesData();
renderCandidates();
