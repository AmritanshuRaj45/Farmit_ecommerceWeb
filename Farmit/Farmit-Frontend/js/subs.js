const customerId = sessionStorage.getItem('customerId');
// for subscriptions
if (sessionStorage.getItem('isAdminLoggedIn_' + customerId) === 'true') {
    window.onload = function() {
        const check_login=localStorage.getItem('loginStatus_' + customerId); 
            if (check_login === 'loggedOut') {
                window.location.replace("index.html");
            }
        const username = sessionStorage.getItem('username');
        console.log(username);
       const usernameElement = document.getElementById('username-display');
       if (username && usernameElement) {
           usernameElement.textContent = username;
       }
        fetchSubscriptions();
    };
    };
    


function fetchSubscriptions() {
    const container = document.getElementById('subscriptionCardsContainer');

    if (!container) {
        console.error('The container for subscriptions was not found.');
        return;
    }

    fetch('/api/subscriptions', {
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token_' + customerId)}`, // Add the token to the request header
        }
    })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    alert('You are not authorized. Please log in!');
                    window.location.href = '/index'; // Redirect to login if unauthorized
                    return;
                }

                throw new Error('Failed to fetch subscription data. Please try again later.');
            }

            return response.json();
        })
        .then(data => {
            data.forEach(subscription => {
                const card = createSubscriptionCard(subscription);
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching subscription data:', error);
            alert('There was an issue fetching the subscription data. Please try again later.');
        });
}

function createSubscriptionCard(subscription) {
    const card = document.createElement('div');
    card.classList.add('subscription-card');

    const email = document.createElement('h3');
    email.classList.add('email');
    email.textContent = subscription.email;

    const subscribedAt = document.createElement('p');
    subscribedAt.classList.add('subscribed-at');
    const date = new Date(subscription.subscribed_at);
    subscribedAt.textContent = `Subscribed on: ${date.toLocaleString()}`;

    card.appendChild(email);
    card.appendChild(subscribedAt);

    return card;
}
