// Reset Filter Button
const resetBtn = document.querySelector(".reset-filters");

if (resetBtn) {
  resetBtn.addEventListener("click", function () {
    // Ambil semua checkbox di filter
    const checkboxes = document.querySelectorAll(
      '.filter-option input[type="checkbox"]'
    );

    // Uncheck semua checkbox
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    // Tampilkan semua animal cards
    const allCards = document.querySelectorAll(".animal-card");
    allCards.forEach((card) => {
      card.style.display = "block";
    });

    console.log("Semua filter telah direset!");
  });
}

// Filter Functionality
const applyFilterBtn = document.querySelector(".apply-filter-btn");

if (applyFilterBtn) {
  applyFilterBtn.addEventListener("click", function () {
    // Ambil semua checkbox yang dicek
    const checkedFilters = {
      animal: [],
      breed: [],
      color: [],
      age: [],
    };

    // Kumpulkan nilai checkbox yang dicek
    document
      .querySelectorAll('.filter-option input[type="checkbox"]:checked')
      .forEach((checkbox) => {
        const filterType = checkbox.name;
        const filterValue = checkbox.value;
        if (checkedFilters[filterType]) {
          checkedFilters[filterType].push(filterValue);
        }
      });

    // Ambil semua animal cards
    const allCards = document.querySelectorAll(".animal-card");

    // Filter animal cards
    allCards.forEach((card) => {
      let shouldShow = true;

      // Cek animal type
      if (
        checkedFilters.animal.length > 0 &&
        !checkedFilters.animal.includes(card.dataset.animal)
      ) {
        shouldShow = false;
      }

      // Cek breed
      if (
        shouldShow &&
        checkedFilters.breed.length > 0 &&
        !checkedFilters.breed.includes(card.dataset.breed)
      ) {
        shouldShow = false;
      }

      // Cek color
      if (
        shouldShow &&
        checkedFilters.color.length > 0 &&
        !checkedFilters.color.includes(card.dataset.color)
      ) {
        shouldShow = false;
      }

      // Cek age
      if (
        shouldShow &&
        checkedFilters.age.length > 0 &&
        !checkedFilters.age.includes(card.dataset.age)
      ) {
        shouldShow = false;
      }

      // Tampilkan atau sembunyikan card
      card.style.display = shouldShow ? "block" : "none";
    });

    console.log("Filter diterapkan:", checkedFilters);
  });
}

// Login/Register Modal
const modal = document.getElementById("auth-modal");
const userProfileBtn = document.getElementById("user-profile");
const closeModalBtn = document.getElementById("close-modal");
const switchTabLinks = document.querySelectorAll(".switch-tab");
const loginImage = document.querySelector(".modal-image-login");
const registerImage = document.querySelector(".modal-image-register");
const modalTitle = document.getElementById("modal-title");

// Open modal when clicking profile button
if (userProfileBtn && modal) {
  userProfileBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    modal.classList.add("active");
  });
}

// Close modal when clicking close button
if (closeModalBtn) {
  closeModalBtn.addEventListener("click", function () {
    modal.classList.remove("active");
  });
}

// Close modal when clicking outside
if (modal) {
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });
}

// Switch tab via link
switchTabLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const tabName = this.getAttribute("data-tab");

    // Get all tab contents
    const tabContents = document.querySelectorAll(".tab-content");

    // Remove active class from all contents
    tabContents.forEach((content) => content.classList.remove("active"));

    // Add active class to target content
    document.getElementById(tabName + "-tab").classList.add("active");

    // Switch images
    if (tabName === "login") {
      if (loginImage) loginImage.classList.add("active");
      if (registerImage) registerImage.classList.remove("active");
      // Update title
      if (modalTitle) modalTitle.textContent = "Login";
    } else if (tabName === "register") {
      if (loginImage) loginImage.classList.remove("active");
      if (registerImage) registerImage.classList.add("active");
      // Update title
      if (modalTitle) modalTitle.textContent = "Register";
    }
  });
});

// Prevent closing modal when clicking inside content
if (modal) {
  const modalContent = modal.querySelector(".modal-content");
  if (modalContent) {
    modalContent.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }
}

// Reinitialize Feather Icons after DOM changes
if (typeof feather !== "undefined") {
  feather.replace();
}
