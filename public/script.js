/*document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('holidayForm');
    const yearInput = document.getElementById('year');
    const countryInput = document.getElementById('country');
    const monthInput = document.getElementById('month');
    const dayInput = document.getElementById('country');
    const holidayResults = document.getElementById('holidayResults');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const year = yearInput.value;
      const country = countryInput.value;
      const month = monthInput.value;
      const day = dayInput.value;
  
      try {
        // Fetch holiday data from your Express server
        const response = await fetch(`/holidays/${year}/${country}/${month}/${day}`);
        const data = await response.json();
  
        // Display holiday data on the page
        let html = '<h2>Holiday Data:</h2>';
        html += '<ul>';
        for (const holiday of data.holidays) {
          html += `<li>${holiday.name} - ${holiday.date}</li>`;
        }
        html += '</ul>';
        holidayResults.innerHTML = html;
      } catch (error) {
        console.error(error);
        holidayResults.innerHTML = '<p>An error occurred while fetching holiday data.</p>';
      }
    });
  });*/
  