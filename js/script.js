// Apply filter function
function applyFilters() {
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

    // Cek animal type (normalize to lowercase)
    if (checkedFilters.animal.length > 0) {
      const cardAnimal = (card.dataset.animal || "").toLowerCase();
      const selectedAnimals = checkedFilters.animal.map((a) => a.toLowerCase());
      if (!selectedAnimals.includes(cardAnimal)) {
        shouldShow = false;
      }
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
}

// Filter collapse/expand functionality
function setupFilterCollapse() {
  const filterToggles = document.querySelectorAll(".filter-toggle");
  const allOptions = document.querySelectorAll(".filter-options");

  // Initialize: ensure open groups have a usable max-height
  allOptions.forEach((opts) => {
    const header = opts.previousElementSibling;
    const toggle = header ? header.querySelector(".filter-toggle") : null;
    const isExpanded =
      toggle && toggle.getAttribute("aria-expanded") === "true";
    if (isExpanded && !opts.classList.contains("collapsed")) {
      opts.style.maxHeight = "2000px";
    }
  });

  filterToggles.forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      const filterGroup = this.closest(".filter-group");
      const filterOptions = filterGroup
        ? filterGroup.querySelector(".filter-options")
        : null;

      if (!filterOptions) return;

      const isCollapsed = filterOptions.classList.contains("collapsed");

      if (isCollapsed) {
        // Expanding: remove collapsed, set to large max-height
        filterOptions.classList.remove("collapsed");
        filterOptions.style.maxHeight = "2000px";
        this.setAttribute("aria-expanded", "true");
      } else {
        // Collapsing: set to exact current height, then animate to 0
        const currentHeight = filterOptions.scrollHeight;
        filterOptions.style.maxHeight = currentHeight + "px";
        // Force reflow
        filterOptions.offsetHeight;
        requestAnimationFrame(() => {
          filterOptions.style.maxHeight = "0px";
        });
        const onCollapseEnd = (evt) => {
          if (evt.propertyName === "max-height") {
            filterOptions.classList.add("collapsed");
            filterOptions.removeEventListener("transitionend", onCollapseEnd);
          }
        };
        filterOptions.addEventListener("transitionend", onCollapseEnd);
        this.setAttribute("aria-expanded", "false");
      }
    });
  });
}

// Set active navbar link based on current page
function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".navbar-nav a");

  console.log("Current page:", currentPage); // Debug
  console.log("Current path:", currentPath); // Debug

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    const linkText = link.textContent.trim();

    link.classList.remove("active");

    // Match logic based on current page
    if (
      currentPage === "index.html" ||
      currentPage === "" ||
      currentPage === "PetResQ"
    ) {
      // Home page - but exclude sistemadopt
      if (!currentPath.includes("sistemadopt") && linkText === "Home") {
        link.classList.add("active");
        console.log("Set active: Home"); // Debug
      }
    } else if (currentPage === "adopt.html" || currentPage === "adopt.php") {
      // Adopt page
      if (linkText === "Adopt") {
        link.classList.add("active");
        console.log("Set active: Adopt"); // Debug
      }
    } else if (
      currentPage === "animalprofile.html" ||
      currentPage === "animalprofile.php"
    ) {
      // Animal profile page - also highlight Adopt
      if (linkText === "Adopt") {
        link.classList.add("active");
        console.log("Set active: Adopt (from profile)"); // Debug
      }
    } else if (currentPath.includes("sistemadopt")) {
      // Sistem adopt page - highlight Adopt
      if (linkText === "Adopt") {
        link.classList.add("active");
        console.log("Set active: Adopt (from sistemadopt)"); // Debug
      }
    }
  });
}

// Real-time filter on checkbox change
document.addEventListener("DOMContentLoaded", function () {
  const filterCheckboxes = document.querySelectorAll(
    '.filter-option input[type="checkbox"]'
  );

  filterCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", applyFilters);
  });

  // Setup filter collapse
  setupFilterCollapse();

  // Set active navbar link
  setActiveNavLink();
});

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

// Hide Apply Filter Button (no longer needed)
const applyFilterBtn = document.querySelector(".apply-filter-btn");
if (applyFilterBtn) {
  applyFilterBtn.style.display = "none";
}

// Function to setup modal event listeners (called on DOMContentLoaded)
function setupModalListeners() {
  const modal = document.getElementById("auth-modal");
  const closeModalBtn = document.getElementById("close-modal");
  const switchTabLinks = document.querySelectorAll(".switch-tab");
  const loginImage = document.querySelector(".modal-image-login");
  const registerImage = document.querySelector(".modal-image-register");
  const modalTitle = document.getElementById("modal-title");

  // Close modal when clicking close button
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", function () {
      if (modal) {
        modal.classList.remove("active");
      }
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
      const targetTab = document.getElementById(tabName + "-tab");
      if (targetTab) {
        targetTab.classList.add("active");
      }

      // Clear error message
      const errorDiv = document.getElementById("form-error");
      if (errorDiv) {
        errorDiv.style.display = "none";
        errorDiv.textContent = "";
      }

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
}

// Check user login status on page load
function checkUserLogin() {
  const sessionPath = getPhpPath("check_session.php");
  fetch(sessionPath)
    .then((response) => response.json())
    .then((data) => {
      // Expose a simple flag for gating navigation
      window.isLoggedIn = !!data.is_logged_in;
      if (data.is_logged_in) {
        displayUserProfile(data.user_name, data.user_email);
        // If admin, inject Admin link into navbar; otherwise ensure it's hidden
        if (data.role === "admin") {
          addAdminNavLink();
        } else {
          removeAdminNavLink();
        }
        // For logged-in users, add My Submissions link to account dropdown
        addUserSubmissionsDropdownItem();
      } else {
        displayLoginButton();
        // Not logged in: ensure Admin link isn't shown
        removeAdminNavLink();
      }
    })
    .catch((error) => console.error("Error checking login:", error));
}

// Display user profile with initials
function displayUserProfile(userName, userEmail) {
  const userProfile = document.getElementById("user-profile");
  const userName_span = userProfile.querySelector(".user-name");
  const userInitial = userProfile.querySelector(".user-initial");
  const profileIcon = userProfile.querySelector(".profile-icon");

  // Hide icon and "LOGIN" text
  if (profileIcon) profileIcon.style.display = "none";
  if (userName_span) userName_span.style.display = "none";

  // Show user name
  if (userInitial) {
    userInitial.textContent = userName;
    userInitial.style.display = "inline-block";
  }

  // Update dropdown menu with user info
  const dropdownName = document.getElementById("dropdown-name");
  const dropdownEmail = document.getElementById("dropdown-email");
  if (dropdownName) dropdownName.textContent = userName;
  if (dropdownEmail) dropdownEmail.textContent = userEmail;

  // Close modal if open
  const modal = document.getElementById("auth-modal");
  if (modal) {
    modal.classList.remove("active");
  }

  // Replace element to remove old event listeners
  const newUserProfile = userProfile.cloneNode(true);
  userProfile.parentNode.replaceChild(newUserProfile, userProfile);

  // Add event listener for dropdown toggle
  newUserProfile.addEventListener("click", toggleProfileMenu);
}

// Display login button
function displayLoginButton() {
  const userProfile = document.getElementById("user-profile");
  const userName_span = userProfile.querySelector(".user-name");
  const userInitial = userProfile.querySelector(".user-initial");
  const profileIcon = userProfile.querySelector(".profile-icon");

  // Show icon and "LOGIN" text
  if (profileIcon) profileIcon.style.display = "block";
  if (userName_span) userName_span.style.display = "inline";

  // Hide initials
  if (userInitial) {
    userInitial.style.display = "none";
  }

  // Close dropdown
  const dropdown = document.getElementById("profile-dropdown");
  if (dropdown) {
    dropdown.classList.remove("active");
  }

  // Remove all previous event listeners and add fresh one for login
  userProfile.replaceWith(userProfile.cloneNode(true));
  const newUserProfile = document.getElementById("user-profile");
  newUserProfile.addEventListener("click", openLoginModal);
}

// Open login modal
function openLoginModal(e) {
  e.stopPropagation();
  const modal = document.getElementById("auth-modal");
  if (modal) {
    modal.classList.add("active");
  }
}

// Toggle profile dropdown menu
function toggleProfileMenu(e) {
  e.stopPropagation();
  const dropdown = document.getElementById("profile-dropdown");
  if (dropdown) {
    dropdown.classList.toggle("active");
  }
}

// Close dropdown when clicking outside
document.addEventListener("click", function (e) {
  const dropdown = document.getElementById("profile-dropdown");
  const userProfile = document.getElementById("user-profile");

  if (
    dropdown &&
    userProfile &&
    !userProfile.contains(e.target) &&
    !dropdown.contains(e.target)
  ) {
    dropdown.classList.remove("active");
  }
});

// Get the correct path to PHP files based on current location
function getPhpPath(phpFile) {
  // Check if we're in a subdirectory by looking at the current pathname
  const pathSegments = window.location.pathname.split("/");

  // If the current page is in a subdirectory (like /adopt/adopt.html)
  // we need to go up one level to reach the PHP files
  if (pathSegments.length > 3) {
    // We're in a subdirectory
    return `../${phpFile}`;
  }
  // We're in the root directory
  return phpFile;
}

// Handle form submissions with AJAX
function handleFormSubmit(formId, phpFile) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const errorDiv = document.getElementById("form-error");
    const correctPath = getPhpPath(phpFile);

    fetch(correctPath, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Success - reload to check login status
          setTimeout(() => {
            location.reload();
          }, 500);
        } else {
          // Show error message
          if (errorDiv) {
            errorDiv.textContent = data.message;
            errorDiv.style.display = "block";
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        if (errorDiv) {
          errorDiv.textContent = "An error occurred. Please try again.";
          errorDiv.style.display = "block";
        }
      });
  });
}

// Animal card click handler
function setupAnimalCardListeners() {
  const animalCards = document.querySelectorAll(".animal-card");

  animalCards.forEach((card, index) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", function () {
      // Use index as animal ID (1-based)
      const animalId = index + 1;
      // Navigate to animal profile with ID
      window.location.href = `animalprofile.php?id=${animalId}`;
    });

    // Add hover effect
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)";
      this.style.transition = "transform 0.3s ease";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  // Setup modal listeners
  setupModalListeners();

  // Check login status
  checkUserLogin();

  // Setup form submissions
  handleFormSubmit("login-tab", "login.php");
  handleFormSubmit("register-tab", "register.php");

  // Setup animal card listeners (only on adopt.html)
  setupAnimalCardListeners();

  // Setup logout button
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const logoutPath = getPhpPath("logout.php");
      window.location.href = logoutPath;
    });
  }

  // Close dropdown when clicking navbar links
  const navbarLinks = document.querySelectorAll(".navbar-nav a");
  navbarLinks.forEach((link) => {
    link.addEventListener("click", function () {
      const dropdown = document.getElementById("profile-dropdown");
      if (dropdown) {
        dropdown.classList.remove("active");
      }
    });
  });

  // Close modal and dropdown when navigating
  const notification = document.getElementById("notification");
  if (notification) {
    notification.addEventListener("click", function () {
      const modal = document.getElementById("auth-modal");
      const dropdown = document.getElementById("profile-dropdown");
      if (modal) modal.classList.remove("active");
      if (dropdown) dropdown.classList.remove("active");
    });
  }

  // Gate Rehome navigation for non-logged-in users
  document.addEventListener(
    "click",
    function (e) {
      const anchor = e.target.closest("a");
      if (!anchor) return;
      const rawHref = anchor.getAttribute("href") || "";
      let isRehome = false;
      try {
        const url = new URL(rawHref, window.location.href);
        const path = url.pathname.toLowerCase();
        isRehome = path.includes("/rehome/rehome");
      } catch (_) {
        isRehome = /rehome\/rehome\.(html|php)$/i.test(rawHref);
      }
      if (isRehome && !window.isLoggedIn) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        const modal = document.getElementById("auth-modal");
        if (modal) {
          // Ensure login tab is active
          const loginTab = document.getElementById("login-tab");
          const registerTab = document.getElementById("register-tab");
          const modalTitle = document.getElementById("modal-title");
          if (loginTab && registerTab) {
            loginTab.classList.add("active");
            registerTab.classList.remove("active");
          }
          const imgLogin = document.querySelector(".modal-image-login");
          const imgRegister = document.querySelector(".modal-image-register");
          if (imgLogin) imgLogin.classList.add("active");
          if (imgRegister) imgRegister.classList.remove("active");
          if (modalTitle) modalTitle.textContent = "Login";
          modal.classList.add("active");
        }
      }
    },
    true
  );
});

// Adds an Admin link to the navbar if not already present
function addAdminNavLink() {
  const nav = document.querySelector(".navbar-nav");
  if (!nav) return;
  // Avoid duplicating the link
  const existing = Array.from(nav.querySelectorAll("a")).find(
    (a) => a.textContent.trim().toLowerCase() === "admin"
  );
  if (existing) return;

  const link = document.createElement("a");
  // Point to guarded Admin panel entry
  link.href = getPhpPath("Admin PetResQ/index.php");
  link.textContent = "Admin";
  nav.appendChild(link);
}

// Removes Admin link if present (for non-admin users)
function removeAdminNavLink() {
  const nav = document.querySelector(".navbar-nav");
  if (!nav) return;
  const adminLink = Array.from(nav.querySelectorAll("a")).find(
    (a) => a.textContent.trim().toLowerCase() === "admin"
  );
  if (adminLink) {
    adminLink.remove();
  }
}

// Adds a My Submissions link for logged-in users
function addUserSubmissionsDropdownItem() {
  const dropdown = document.getElementById("profile-dropdown");
  if (!dropdown) return;
  // Avoid duplicate by checking existing items
  const exists = Array.from(dropdown.querySelectorAll(".dropdown-item")).find(
    (a) => a.textContent.trim().toLowerCase() === "my submissions"
  );
  if (exists) return;

  // Insert before the logout item
  const logoutItem = document.getElementById("logout-btn");
  const item = document.createElement("a");
  item.href = getPhpPath("user/submissions.php");
  item.className = "dropdown-item";
  item.textContent = "My Submissions";
  if (logoutItem && logoutItem.parentNode === dropdown) {
    dropdown.insertBefore(item, logoutItem);
    // Add divider between My Submissions and Logout
    const divider = document.createElement("hr");
    divider.className = "dropdown-divider";
    dropdown.insertBefore(divider, logoutItem);
  } else {
    dropdown.appendChild(item);
  }
}
