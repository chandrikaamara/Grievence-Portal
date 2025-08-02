let grievances = JSON.parse(localStorage.getItem("grievances")) || [];

const grievanceForm = document.getElementById("grievanceForm");
const grievanceList = document.getElementById("grievanceList");
const clearAllBtn = document.getElementById("clearAll");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const themeToggle = document.getElementById("themeToggle");

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("toast-success", "toast-warning", "toast-error");
  toast.classList.add("show", `toast-${type}`);
  toast.style.display = "block";
  setTimeout(() => {
    toast.classList.remove("show", `toast-${type}`);
    toast.style.display = "none";
  }, 3000);
}

function displayGrievances() {
  const query = searchInput.value.toLowerCase();
  const status = statusFilter.value;
  grievanceList.innerHTML = "";

  grievances
    .filter(g => {
      const matchesSearch =
        g.studentId.toLowerCase().includes(query) ||
        g.description.toLowerCase().includes(query);
      const matchesStatus = status === "All" || g.status === status;
      return matchesSearch && matchesStatus;
    })
    .forEach(g => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${g.category}</strong> - ${g.description}<br>
        <small>ID: ${g.studentId} | ${g.timestamp} |
          <span class="status ${g.status.toLowerCase()}">
            ${g.status === 'Pending' ? 'Pending' : 'Resolved'}
          </span>
        </small><br>
        ${g.status === "Pending" ? `<button onclick="markResolved(${g.id})">Mark as Resolved</button>` : ""}
        <button onclick="deleteGrievance(${g.id})">Delete</button>
      `;
      grievanceList.appendChild(li);
    });
}


grievanceForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const studentId = document.getElementById("studentId").value.trim();
const category = document.getElementById("category").value.trim();
const description = document.getElementById("description").value.trim();

    if (!studentId.trim() || !category.trim() || !description.trim()) {
  showToast("Please fill out all fields before submitting.");
  return;
}

    const isDuplicate = grievances.some(g =>
  g.studentId.trim().toLowerCase() === studentId.trim().toLowerCase() &&
  g.category.trim().toLowerCase() === category.trim().toLowerCase() &&
  g.description.trim().toLowerCase() === description.trim().toLowerCase()
);

if (isDuplicate) {
  showToast("This grievance has already been submitted.","warning");
  return;
}


  const newGrievance = {
    id: Date.now(),
    studentId,
    category,
    description,
    timestamp: new Date().toLocaleString(),
    status: "Pending"
  };

  grievances.push(newGrievance);
  localStorage.setItem("grievances", JSON.stringify(grievances));
  grievanceForm.reset();
  showToast("Grievance submitted successfully!","success");
  displayGrievances();
});

function markResolved(id) {
  grievances = grievances.map(g => g.id === id ? { ...g, status: "Resolved" } : g);
  localStorage.setItem("grievances", JSON.stringify(grievances));
  showToast("Marked as resolved.", "success");
  displayGrievances();
}

function deleteGrievance(id) {
  grievances = grievances.filter(g => g.id !== id);
  localStorage.setItem("grievances", JSON.stringify(grievances));
  showToast("Grievance deleted.", "success");
  displayGrievances();
}

clearAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all grievances?")) {
    grievances = [];
    localStorage.setItem("grievances", JSON.stringify(grievances));
    showToast("All grievances cleared.", "warning");
    displayGrievances();
  }
});

searchInput.addEventListener("input", displayGrievances);
statusFilter.addEventListener("change", displayGrievances);

// Theme toggle logic
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Load saved theme and grievances
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
  } else {
    themeToggle.textContent = "🌙";
  }
  displayGrievances();
});
