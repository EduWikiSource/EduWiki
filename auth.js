// =======================
// REGISTER FUNCTION
// =======================
function register() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("All fields are required");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if user already exists
  const exists = users.find(u => u.username === username);
  if (exists) {
    alert("User already exists");
    return;
  }

  users.push({
    username: username,
    password: password
  });

  localStorage.setItem("users", JSON.stringify(users));

  alert("Registration successful! Please login.");
  window.location.href = "login.html";
}