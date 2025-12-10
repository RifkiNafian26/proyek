// Dynamic filtering for adopt page
document.addEventListener("DOMContentLoaded", function () {
  const filterCheckboxes = document.querySelectorAll(
    '.filter-option input[type="checkbox"]'
  );
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const animalGrid = document.getElementById("animal-grid");
  const resetButton = document.querySelector(".reset-filters");

  // Function to load animals with filters
  function loadAnimals() {
    // Collect selected filters
    const filters = {
      breed: [],
      color: [],
      age: [],
      search: searchInput.value.trim(),
    };

    // Get checked breed filters
    document
      .querySelectorAll('input[name="breed"]:checked')
      .forEach((checkbox) => {
        filters.breed.push(checkbox.value);
      });

    // Get checked color filters
    document
      .querySelectorAll('input[name="color"]:checked')
      .forEach((checkbox) => {
        filters.color.push(checkbox.value);
      });

    // Get checked age filters
    document
      .querySelectorAll('input[name="age"]:checked')
      .forEach((checkbox) => {
        filters.age.push(checkbox.value);
      });

    // Show loading state
    animalGrid.innerHTML =
      '<p style="text-align: center; width: 100%; padding: 20px;">Loading...</p>';

    // Build query string
    const queryParams = new URLSearchParams();

    if (filters.search) {
      queryParams.append("search", filters.search);
    }

    filters.breed.forEach((b) => queryParams.append("breed[]", b));
    filters.color.forEach((c) => queryParams.append("color[]", c));
    filters.age.forEach((a) => queryParams.append("age[]", a));

    // Fetch filtered animals
    fetch("get_animals.php?" + queryParams.toString())
      .then((response) => response.json())
      .then((animals) => {
        displayAnimals(animals);
      })
      .catch((error) => {
        console.error("Error loading animals:", error);
        animalGrid.innerHTML =
          '<p style="text-align: center; width: 100%; padding: 20px; color: red;">Error loading animals. Please try again.</p>';
      });
  }

  // Function to display animals
  function displayAnimals(animals) {
    if (animals.length === 0) {
      animalGrid.innerHTML =
        '<p style="text-align: center; width: 100%; padding: 20px;">No animals match your filters.</p>';
      return;
    }

    let html = "";
    animals.forEach((animal) => {
      const photo = animal.main_photo || "icon/default-pet.jpg";
      html += `
        <div class="animal-card" data-id="${animal.id_hewan}" data-breed="${animal.breed}" data-color="${animal.color}" data-age="${animal.age}" style="cursor: pointer;">
          <div class="animal-photo">
            <img src="${photo}" alt="${animal.namaHewan}" onerror="this.src='icon/default-pet.jpg'" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div class="animal-info">
            <div class="animal-name">${animal.namaHewan}</div>
            <div class="animal-description">${animal.breed} - ${animal.color}, ${animal.age}</div>
            <div class="animal-gender">${animal.gender}</div>
          </div>
        </div>
      `;
    });
    animalGrid.innerHTML = html;

    // Add click event listeners to animal cards
    document.querySelectorAll(".animal-card").forEach((card) => {
      card.addEventListener("click", function () {
        const animalId = this.getAttribute("data-id");
        // Navigate to animal profile page
        window.location.href = "animalprofile.php?id=" + animalId;
      });
    });
  }

  // Add event listeners to filter checkboxes
  filterCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      loadAnimals();
    });
  });

  // Add event listener to search form
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    loadAnimals();
  });

  // Add event listener to search input (live search)
  let searchTimeout;
  searchInput.addEventListener("input", function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      loadAnimals();
    }, 500); // Wait 500ms after user stops typing
  });

  // Reset filters
  resetButton.addEventListener("click", function () {
    // Uncheck all filters
    filterCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    // Clear search
    searchInput.value = "";

    // Reload all animals
    loadAnimals();
  });

  // Filter toggle functionality
  document.querySelectorAll(".filter-toggle").forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const filterGroup = this.closest(".filter-group");
      const filterOptions = filterGroup.querySelector(".filter-options");
      const isExpanded = this.getAttribute("aria-expanded") === "true";

      this.setAttribute("aria-expanded", !isExpanded);
      filterOptions.style.display = isExpanded ? "none" : "block";

      // Rotate icon
      const icon = this.querySelector("i");
      icon.style.transform = isExpanded ? "rotate(-90deg)" : "rotate(0deg)";
    });
  });

  // Load animals on page load
  loadAnimals();
});
