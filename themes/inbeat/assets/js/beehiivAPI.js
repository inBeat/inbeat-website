var beehiivAPI = {
  subscribe: function (email, source) {
    var endpoint = "https://graphql.inbeat.co/beehiiv";
    
    return fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, utm_source: source })
    })
    .then(function(response) {
      console.log("response:", response);
      if (!response.ok) throw new Error("HTTP error status: " + response.status);
      return response.json();
    })
    .catch(function(error) {
      return { error: error.message };
    });
  }
};