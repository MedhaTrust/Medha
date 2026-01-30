const BASE_URL = "https://script.google.com/macros/s/AKfycbzu4bW_mKYqxzJrCXt8Q-ez4WjI_lL78_oraNomyFgN48ui9Z2ZAX-FSrt_srqCa3Yw/exec";
let groupMembers = [];

/* ===============================
   EXCEL CATEGORY DATA
   Category = fees / books / conveyance / welfare
   SubCategory = Excel items
================================ */

const paymentData = { 
  fees: {
    "College Fee": [
      "Tuition Fee",
      "Affiliation Fee",
      "Building Fee",
      "Semester Registration Fee",
      "College Reporting Fee",
      "CRT Fee",
      "Placement Fee",
      "College Bus Fee",
      "College Uniform",
      "CA/CMA/CS Coaching Fee",
      "Minor Degree Tuition Fee"
    ], 
    "Exam Fee": [
      "Semester Exam Fee",
      "Annual Exam Fee",
      "CA/CMA/CS Exam Fee",
      "IPE Board Exam Fee",
      "NPTEL Exam Fee",
      "Minor Degree Exam Fee"
    ], 
    "Miscellaneous Fees": [
      "CMM",
      "Original Degree",
      "Provisional Fee",
      "NCC Related",
      "Study Hall Fee"
    ],
    "Hostel Fee": ["Hostel Fee"],
    "Mess Fee": ["Mess Fee"],
    "Extra Academic Expense": [
      "Internship Fee",
      "Major Project Equipment",
      "Minor Project Equipment",
      "Industrial Visit",
      "IEEE",
      "CISCO",
      "SAE",
      "TASK"
    ]
  },

  books: {
    "Text Books": ["Text Books", "Reference Materials"],
    "Note Books": ["Note Books"],
    "Stationery": ["Pens", "Pencils", "Loose Sheets", "Scale"],
    "Records and Manuals": [
      "Lab Records",
      "Lab Manuals",
      "Major Project Reports",
      "Minor Project Reports"
    ]
  },

  conveyance: {
    "Regular Travel": [
      "Monthly Bus Pass",
      "Quarterly Bus Pass",
      "Monthly Auto Pass",
      "Daily Travel",
      "Medical Travel",
      "College Reporting",
      "Outstation Travel"
    ]
  },

  welfare: {
    "Food Expenses": [
      "Food Expenses",
      "Additional Aid",
      "Relief",
      "Telephone Expenses",
      "Data Expenses",
      "Awards to Students"
    ]
  }
};

/* ===============================
   LOAD CATEGORY (EXCEL MAIN)
================================ */

function loadCategories() {
  const category = document.getElementById("category");
  const subCategory = document.getElementById("subCategory");

  category.innerHTML = `<option value="">Select Category</option>`;
  subCategory.innerHTML = `<option value="">Select Sub-Category</option>`;

  Object.keys(paymentData).forEach(key => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = key.toUpperCase();
    category.appendChild(opt);
  });
}

/* ===============================
   LOAD SUB CATEGORY (EXCEL ITEMS)
================================ */

function loadSubCategories() {
  const categoryKey = document.getElementById("category").value;
  const subCategory = document.getElementById("subCategory");

  subCategory.innerHTML = `<option value="">Select Sub-Category</option>`;
  if (!categoryKey) return;

  Object.keys(paymentData[categoryKey]).forEach(group => {
    paymentData[categoryKey][group].forEach(item => {
      const opt = document.createElement("option");
      opt.value = item;
      opt.textContent = `${group} - ${item}`; // Excel style
      subCategory.appendChild(opt);
    });
  });
}

/* ===============================
   HELPERS
================================ */

function val(id) {
  return document.getElementById(id).value.trim();
}

function setVal(id, v) {
  document.getElementById(id).value = v || "";
}

/* ===============================
   FETCH MAIN STUDENT
================================ */

function fetchMainStudent() {
  const mssid = val("mssid");
  if (!mssid) return alert("Enter MSS ID");

  fetch(`${BASE_URL}?mssid=${encodeURIComponent(mssid)}`)
    .then(res => res.json())
    .then(data => {
      if (!data.name) return alert("❌ Student not found");
      setVal("name", data.name);
      setVal("college", data.college);
      alert("✅ Student details fetched");
    });
}

/* ===============================
   REQUEST TYPE
================================ */

function handleRequestType() {
  const type = val("requestType");
  document.getElementById("groupMembers").innerHTML = "";
  groupMembers = [];

  document.getElementById("groupCountBox").style.display =
    type === "Group" ? "block" : "none";
}

/* ===============================
   GROUP INPUTS
================================ */

function createGroupInputs() {
  const count = parseInt(val("groupCount"));
  const box = document.getElementById("groupMembers");
  box.innerHTML = "";
  groupMembers = [];

  for (let i = 0; i < count; i++) {
    box.innerHTML += `
      <div class="memberBox">
        <h5>Group Member ${i + 1}</h5>
        <input id="gm_mssid_${i}" placeholder="MSS ID">
        <input id="gm_year_${i}" placeholder="Year">
        <button type="button" onclick="fetchGroupMember(${i})">Fetch</button>
        <input id="gm_name_${i}" placeholder="Name" disabled>
        <input id="gm_college_${i}" placeholder="College" disabled>
      </div>
    `;
  }
}

/* ===============================
   FETCH GROUP MEMBER
================================ */

function fetchGroupMember(i) {
  const mssid = val(`gm_mssid_${i}`);
  const year = val(`gm_year_${i}`);

  fetch(`${BASE_URL}?mssid=${encodeURIComponent(mssid)}`)
    .then(res => res.json())
    .then(data => {
      if (!data.name) return alert("❌ Member not found");

      document.getElementById(`gm_name_${i}`).value = data.name;
      document.getElementById(`gm_college_${i}`).value = data.college;

      groupMembers[i] = {
        mssid,
        year,
        name: data.name,
        college: data.college
      };
    });
}

/* ===============================
   SUBMIT REQUEST
================================ */

function submitRequest() {

  if (!val("requestType") ||
      !val("category") ||
      !val("subCategory") ||
      !val("paymentMode") ||
      !val("dueDate")) {
    alert("❌ Please fill all required fields");
    return;
  }

  const payload = new URLSearchParams({
    requestType: val("requestType"),
    category: val("category"),
    subCategory: val("subCategory"),
    paymentMode: val("paymentMode"),
    details: val("details"),
    dueDate: val("dueDate"),
    mssid: val("mssid"),
    name: val("name"),
    college: val("college"),
    year: val("year"),
    attachmentLink: val("attachment"),
    groupMembers: JSON.stringify(groupMembers)
  });

  fetch(BASE_URL, { method: "POST", body: payload })
    .then(res => res.text())
    .then(id => {
      alert("✅ Request Submitted\nID: " + id);
      window.location.href = "index.html";
    });
}
