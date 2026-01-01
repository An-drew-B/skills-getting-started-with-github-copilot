document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  const participantsList = document.getElementById('participants-list');

  // Hide bullet points via JS in case CSS is not enough
  participantsList.style.listStyleType = 'none';
  participantsList.style.paddingLeft = '0';

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();


      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
        // Refresh activities and participants list
        fetchActivities();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  function addParticipant(name) {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.alignItems = 'center';

    const span = document.createElement('span');
    span.textContent = name;
    span.style.flexGrow = '1';

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.title = 'Unregister participant';
    deleteBtn.style.marginLeft = '8px';
    deleteBtn.style.background = 'none';
    deleteBtn.style.border = 'none';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.fontSize = '1em';
    deleteBtn.setAttribute('aria-label', 'Delete participant');

    deleteBtn.addEventListener('click', function() {
      participantsList.removeChild(li);
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    participantsList.appendChild(li);
  }

  // Initialize app
  fetchActivities();
});
document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message and previous activities
      activitiesList.innerHTML = "";

      // Clear activity select options except the first placeholder
      while (activitySelect.options.length > 1) {
        activitySelect.remove(1);
      }

      // Populate activities list and select dropdown
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
          <p><strong>Participants:</strong></p>
        `;

        // Create participants list with delete icons
        const ul = document.createElement('ul');
        ul.className = 'participants-list';
        ul.style.listStyleType = 'none';
        ul.style.paddingLeft = '0';

        details.participants.forEach(participant => {
          const li = document.createElement('li');
          li.style.display = 'flex';
          li.style.alignItems = 'center';

          const span = document.createElement('span');
          span.textContent = participant;
          span.style.flexGrow = '1';

          const deleteBtn = document.createElement('button');
          deleteBtn.innerHTML = '🗑️';
          deleteBtn.title = 'Unregister participant';
          deleteBtn.style.marginLeft = '8px';
          deleteBtn.style.background = 'none';
          deleteBtn.style.border = 'none';
          deleteBtn.style.cursor = 'pointer';
          deleteBtn.style.fontSize = '1em';
          deleteBtn.setAttribute('aria-label', 'Delete participant');

          deleteBtn.addEventListener('click', async function() {
            // Call backend to unregister participant
            try {
              const response = await fetch(`/activities/${encodeURIComponent(name)}/unregister?email=${encodeURIComponent(participant)}`, {
                method: 'POST',
              });
              if (response.ok) {
                // Refresh activities after unregister
                fetchActivities();
              } else {
                alert('Failed to unregister participant.');
              }
            } catch (err) {
              alert('Error occurred while unregistering.');
            }
          });

          li.appendChild(span);
          li.appendChild(deleteBtn);
          ul.appendChild(li);
        });

        activityCard.appendChild(ul);
        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
        // Refresh activities and participants list after signup
        await fetchActivities();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
