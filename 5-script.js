const BASE_URL = "https://script.google.com/macros/s/AKfycbxue-jZ8DkUr-4Q0IipHlBJet7fKSEIGpm06Ffdyol7yFRE1BBWlfNmTUksoNYiOysB/exec";
let groupMembers = [];

/* ===============================
   PAYMENT DROPDOWN DATA
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

    "Hostel Fee": [
      "Hostel Fee"
    ],

    "Mess Fee": [
      "Mess Fee"
    ],

    "Extra Academic Expense": [
      "Internship Fee",
      "Major Project Equipment",
      "Minor Project Equipment",
      "Industrial Visit",
      "IEEE",
      "CISCO",
      "SAE",
      "TASK"
    ],

    "Graduate Entrance Registration": [
      "TS EAMCET Registration",
      "AP EAMCET Registration",
      "JEE Mains Registration",
      "JEE Advanced Registration",
      "NEET Registration",
      "CA/CMA/CS Registration",
      "DOST Registration Fee",
      "CSAB Fee"
    ],  

    "Post-Graduate Entrance Registration": [
      "GATE Application Fee",
      "NEET PG Application Fee",
      "CUET Application Fee",
      "GPAT Application Fee"
    ],

    "Graduate Counselling": [
      "TS EAMCET Counselling",
      "AP EAMCET Counselling",
      "JoSAA Counselling",
      "MCC Counselling",
      "TS MBBS Counselling",
      "Ag BSc / BVSc Counselling",
      "BSc Nursing Counselling",
      "TS AYUSH Counselling",
      "DOST Counselling"
    ],

    "Extra Coaching": [
      "GATE Coaching",
      "NEET PG Coaching",
      "Study Material / Marrow"
    ],

    "Spoken English Course": [
      "Spoken English Course"
    ],

    "Technical Courses": [
      "C",
      "Java",
      "Full Stack",
      "Skill Enhancement Course",
      "DSA",
      "NPTEL",
      "TASK"
    ]
  },

  books: {
    "Text Books": [
      "Text Books",
      "Reference Materials"
    ],

    "Note Books": [
      "Note Books"
    ],

    "Stationery": [
      "Pens",
      "Pencils",
      "Loose Sheets",
      "Scale"
    ],

    "Records and Manuals": [
      "Lab Records",
      "Lab Manuals",
      "Major Project Reports",
      "Minor Project Reports"
    ],

    "Engineering Required Items": [
      "Aprons",
      "Drafters",
      "Calculators",
      "Drawing Instruments"
    ],

    "MBBS Required Items": [
      "Aprons",
      "Scrubs",
      "Stethoscope",
      "Dissection Kit",
      "Knee Hammer"
    ],

    "MSS Enrolment Kits": [
      "Trunk Box",
      "Plank",
      "Chair",
      "Plate",
      "Glass",
      "Bag",
      "Bedsheet",
      "Cot",
      "Water Bottle",
      "Bucket",
      "Mug",
      "Lock",
      "Pillow"
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
    ],

    "Personality Development Session": [
      "Yoga",
      "Mind Management Techniques",
      "Fear and Anxiety Course",
      "Other Development Sessions"
    ]
  }
};


function loadCategories() {
  const process = document.getElementById("paymentType").value;
  const category = document.getElementById("category");
  const subCategory = document.getElementById("subCategory");

  category.innerHTML = `<option value="">Select Category</option>`;
  subCategory.innerHTML = `<option value="">Select Sub-Category</option>`;

  if (!process) return;

  Object.keys(paymentData[process]).forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    category.appendChild(opt);
  });
}

function loadSubCategories() {
  const process = document.getElementById("paymentType").value;
  const category = document.getElementById("category").value;
  const subCategory = document.getElementById("subCategory");

  subCategory.innerHTML = `<option value="">Select Sub-Category</option>`;

  if (!category) return;

  paymentData[process][category].forEach(sub => {
    const opt = document.createElement("option");
    opt.value = sub;
    opt.textContent = sub;
    subCategory.appendChild(opt);
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
  if (!mssid) {
    alert("Enter MSS ID");
    return;
  }

  fetch(`${BASE_URL}?mssid=${encodeURIComponent(mssid)}`)
    .then(res => res.json())
    .then(data => {
      if (!data.name) {
        alert("❌ Student not found");
        return;
      }
      setVal("name", data.name);
      setVal("college", data.college);
      alert("✅ Student details fetched");
    })
    .catch(err => {
      alert("❌ Fetch failed");
      console.error(err);
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

  if (!mssid) {
    alert("Enter MSS ID");
    return;
  }

  fetch(`${BASE_URL}?mssid=${encodeURIComponent(mssid)}`)
    .then(res => res.json())
    .then(data => {
      if (!data.name) {
        alert("❌ Member not found");
        return;
      }

      document.getElementById(`gm_name_${i}`).value = data.name;
      document.getElementById(`gm_college_${i}`).value = data.college;

      groupMembers[i] = {
        mssid,
        year,
        name: data.name,
        college: data.college
      };

      alert(`✅ Member ${i + 1} fetched`);
    })
    .catch(err => {
      alert("❌ Fetch failed");
      console.error(err);
    });
}

/* ===============================
   SUBMIT REQUEST
================================ */

function submitRequest() {

  if (!val("requestType") ||
      !val("paymentType") ||
      !val("category") ||
      !val("subCategory") ||
      !val("paymentMode") ||
      !val("dueDate")) {
    alert("❌ Please fill all required fields");
    return;
  }

  if (val("requestType") === "Group" && groupMembers.length === 0) {
    alert("❌ Add group members");
    return;
  }

  const payload = new URLSearchParams({
    requestType: val("requestType"),
    paymentType: val("paymentType"),
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
    groupMembers: JSON.stringify(groupMembers),
    memberCount: groupMembers.length
  });

  fetch(BASE_URL, {
    method: "POST",
    body: payload
  })
    .then(res => res.text())
    .then(id => {
      if (id.includes("ERROR")) {
        alert("❌ " + id);
      } else {
        alert("✅ Request Submitted\nID: " + id);
        window.location.href = "index.html";
      }
    })
    .catch(err => {
      alert("❌ Submission failed");
      console.error(err);
    });
}