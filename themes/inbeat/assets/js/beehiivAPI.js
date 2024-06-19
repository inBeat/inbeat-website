var beehiivAPI = {
  subscribe: function(email) {
    var apiKey = 'YOUR_BEEHIIV_API_KEY';
    var endpoint = 'https://api.beehiiv.com/v1/subscribe/123';

    return fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({ email: email })
    })
    .then(function(response) {
      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status);
      }
      return response.json();
    })
    .then(function(data) {
      console.log("Subscription data:", data);
      return data;
    })
    .catch(function(error) {
      console.error('Error:', error);
      return { error: error.message };
    });
  }
};
