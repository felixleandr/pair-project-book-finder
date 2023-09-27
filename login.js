// JavaScript code for handling login form submission
document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get the input values
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // You can implement your authentication logic here
    // For a simple example, we'll just check if the username and password match "admin" and "password"
    if (username === "admin" && password === "password") {
        alert("Login successful!");
        // Redirect to a dashboard or home page
        // Example: window.location.href = "dashboard.html";
    } else {
        alert("Login failed. Please check your username and password.");
    }
});
