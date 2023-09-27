// JavaScript code for handling registration form submission
document.getElementById("register-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get the input values
    var newUsername = document.getElementById("new-username").value;
    var newPassword = document.getElementById("new-password").value;

    // You can implement your registration logic here
    // For a simple example, you can store the new username and password in an array
    // or send them to a server for registration

    // Example: Storing in an array (not secure, use a database in a real application)
    var users = JSON.parse(localStorage.getItem("users")) || [];
    users.push({ username: newUsername, password: newPassword });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful! You can now log in.");
    // Redirect to the login page
    window.location.href = "login.html";
});
