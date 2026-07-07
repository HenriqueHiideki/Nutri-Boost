(function () {
  const token = localStorage.getItem("nutriboost_token");

  if (!token) {
    window.location.href = "login.html";
  }
})();