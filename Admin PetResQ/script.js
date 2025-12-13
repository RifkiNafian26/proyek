// =========================================================
// --- LOGIN SYSTEM FUNCTIONS ---
// =========================================================

function setupModalListeners() {
  const modal = document.getElementById("auth-modal");
  const closeBtn = document.getElementById("close-modal");
  const userProfile = document.getElementById("user-profile");
  const switchTabs = document.querySelectorAll(".switch-tab");

  if (userProfile) {
    userProfile.addEventListener("click", () => {
      const profileDropdown = document.getElementById("profile-dropdown");
      if (profileDropdown && profileDropdown.classList.contains("active")) {
        profileDropdown.classList.remove("active");
      } else {
        modal.classList.add("active");
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active");
    });
  }

  switchTabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      const targetTab = tab.getAttribute("data-tab");
      const loginTab = document.getElementById("login-tab");
      const registerTab = document.getElementById("register-tab");
      const modalTitle = document.getElementById("modal-title");

      if (targetTab === "login") {
        loginTab.classList.add("active");
        registerTab.classList.remove("active");
        document.querySelector(".modal-image-login").classList.add("active");
        document
          .querySelector(".modal-image-register")
          .classList.remove("active");
        modalTitle.textContent = "Login";
      } else {
        registerTab.classList.add("active");
        loginTab.classList.remove("active");
        document.querySelector(".modal-image-register").classList.add("active");
        document.querySelector(".modal-image-login").classList.remove("active");
        modalTitle.textContent = "Register";
      }
    });
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });
}

function handleFormSubmit(formId, phpFile) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const errorDiv = document.getElementById("form-error");

    fetch("../" + phpFile, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setTimeout(() => {
            location.reload();
          }, 500);
        } else {
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

function checkUserLogin() {
  fetch("../check_session.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.is_logged_in) {
        displayUserProfile(data.user_name, data.user_email);
        if (data.role === "admin") {
          initializeDashboard();
        } else {
          document.body.innerHTML = "<h1>Access Denied: Admin only</h1>";
        }
      } else {
        displayLoginButton();
      }
    })
    .catch((error) => console.error("Error checking login:", error));
}

function displayUserProfile(userName, userEmail) {
  const userProfile = document.getElementById("user-profile");
  if (!userProfile) return;

  const userName_span = userProfile.querySelector(".user-name");
  const userInitial = userProfile.querySelector(".user-initial");
  const profileIcon = userProfile.querySelector(".profile-icon");

  if (profileIcon) profileIcon.style.display = "none";
  if (userName_span) userName_span.style.display = "none";

  if (userInitial) {
    userInitial.textContent = userName;
    userInitial.style.display = "inline-block";
  }

  const dropdownName = document.getElementById("dropdown-name");
  const dropdownEmail = document.getElementById("dropdown-email");
  if (dropdownName) dropdownName.textContent = userName;
  if (dropdownEmail) dropdownEmail.textContent = userEmail;

  const modal = document.getElementById("auth-modal");
  if (modal) {
    modal.classList.remove("active");
  }

  const newUserProfile = userProfile.cloneNode(true);
  userProfile.parentNode.replaceChild(newUserProfile, userProfile);

  newUserProfile.addEventListener("click", () => {
    const profileDropdown = document.getElementById("profile-dropdown");
    if (profileDropdown) {
      profileDropdown.classList.toggle("active");
    }
  });
}

function displayLoginButton() {
  const userProfile = document.getElementById("user-profile");
  if (!userProfile) return;

  const userName_span = userProfile.querySelector(".user-name");
  const userInitial = userProfile.querySelector(".user-initial");
  const profileIcon = userProfile.querySelector(".profile-icon");

  if (profileIcon) profileIcon.style.display = "block";
  if (userName_span) userName_span.style.display = "inline";

  if (userInitial) {
    userInitial.style.display = "none";
  }

  const userProfile_new = userProfile.cloneNode(true);
  userProfile.parentNode.replaceChild(userProfile_new, userProfile);

  userProfile_new.addEventListener("click", () => {
    const modal = document.getElementById("auth-modal");
    if (modal) {
      modal.classList.add("active");
    }
  });
}

// =========================================================
// --- INITIAL DUMMY DATA (DIKOSONGKAN) ---
// =========================================================
let mockReports = [];
let mockUsers = [];
let mockAnimals = [];
let mockSubmissions = [];

// =========================================================
// --- FUNGSI UTAMA DASHBOARD ---
// =========================================================
function initializeDashboard() {
  const today = new Date();
  let currentDate = today;

  const pageContent = document.getElementById("page-content");
  const navItems = document.querySelectorAll(".nav-menu li");
  const createReportModal = document.getElementById("create-report-modal");
  const reportDetailModal = document.getElementById("report-detail-modal");
  const submissionDetailModal = document.getElementById(
    "submission-detail-modal"
  );
  const logoutBtn = document.getElementById("logout-btn");
  const logoutModal = document.getElementById("logout-modal");
  const reportForm = document.getElementById("report-form");

  // Navbar logout button
  const navbarLogoutBtn = document.getElementById("navbar-logout-btn");
  if (navbarLogoutBtn) {
    navbarLogoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const logoutPath = "../logout.php";
      window.location.href = logoutPath;
    });
  }

  // User profile dropdown - already handled in checkUserLogin
  const profileDropdown = document.getElementById("profile-dropdown");
  document.addEventListener("click", (e) => {
    if (
      profileDropdown &&
      !document.getElementById("user-profile")?.contains(e.target) &&
      !profileDropdown.contains(e.target)
    ) {
      profileDropdown.classList.remove("active");
    }
  });

  // Feather icons
  feather.replace();

  // Klik Logo PetResQ kembali ke dashboard
  document.querySelector(".logo").addEventListener("click", () => {
    navigateTo("dashboard");
  });

  // Setup listener untuk modal
  const modals = document.querySelectorAll(".modal:not(#auth-modal)");
  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("modal-cancel") ||
        e.target.classList.contains("modal-close") ||
        e.target.classList.contains("modal")
      ) {
        modal.style.display = "none";
      }
    });
  });

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      logoutModal.style.display = "flex";
    });
  }

  // Logout confirmation
  const confirmLogoutBtn = document.getElementById("confirm-logout");
  if (confirmLogoutBtn) {
    confirmLogoutBtn.addEventListener("click", function () {
      if (logoutModal) logoutModal.style.display = "none";
      const logoutPath = "../logout.php";
      window.location.href = logoutPath;
    });
  }

  // --- LOGIKA FORM LAPORAN BARU ---
  if (reportForm) {
    reportForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const startDate = document.getElementById("report-start-date").value;
      const endDate = document.getElementById("report-end-date").value;
      const reportType = document.getElementById("report-type").value;
      const description = document.getElementById("report-description").value;

      const reportDateString = `${currentDate.getFullYear()}-${(
        currentDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${currentDate
        .getDate()
        .toString()
        .padStart(2, "0")}`;

      const newId =
        mockReports.length > 0
          ? Math.max(...mockReports.map((r) => r.id)) + 1
          : 1;

      mockReports.push({
        id: newId,
        date: reportDateString,
        type: reportType,
        range: `${startDate} to ${endDate}`,
        desc: description,
        status: "Pending",
      });

      alert(
        `Report ID ${newId
          .toString()
          .padStart(3, "0")} (${reportType}) berhasil dibuat!`
      );

      createReportModal.style.display = "none";
      reportForm.reset();

      if (document.getElementById("reports-body")) {
        updateReportsView(
          currentDate.getDate(),
          currentDate.getMonth(),
          currentDate.getFullYear()
        );
        renderCalendar(currentDate);
      }
    });
  }
  // --- FUNGSI KLIK ROW REPORT (MENAMPILKAN DETAIL) ---
  function showReportDetail(reportId) {
    const report = mockReports.find((r) => r.id === reportId);
    if (!report) return;

    const reportCreationDate = new Date(report.date);

    document.getElementById("detail-report-id").textContent = `(ID: ${report.id
      .toString()
      .padStart(3, "0")})`;
    document.getElementById("detail-type").textContent = report.type;
    document.getElementById("detail-range").textContent = report.range;
    document.getElementById("detail-created-date").textContent =
      reportCreationDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    document.getElementById("detail-status").textContent = report.status;
    document.getElementById("detail-description").value = report.desc;

    reportDetailModal.style.display = "flex";
  }

  window.showReportDetail = showReportDetail;

  // --- FUNGSI HAPUS LAPORAN ---
  window.deleteReport = function (reportId) {
    if (
      confirm(
        `Are you sure you want to delete Report ID ${reportId
          .toString()
          .padStart(3, "0")}?`
      )
    ) {
      mockReports = mockReports.filter((r) => r.id !== reportId);
      alert(`Report ID ${reportId.toString().padStart(3, "0")} deleted.`);
      updateReportsView(
        currentDate.getDate(),
        currentDate.getMonth(),
        currentDate.getFullYear()
      );
      renderCalendar(currentDate);
      navigateTo("system-reports");
    }
  };
  // --- FUNGSI EDIT LAPORAN ---
  window.editReport = function (reportId) {
    const report = mockReports.find((r) => r.id === reportId);
    if (!report) return;

    const newDesc = prompt(
      `Edit Description for Report ID ${report.id
        .toString()
        .padStart(3, "0")}:`,
      report.desc
    );
    if (newDesc !== null) {
      report.desc = newDesc;

      let validStatus = ["Done", "Pending", "Recap", "Cancelled"];
      let newStatus = prompt(
        `Edit Status (${validStatus.join(", ")}) for Report ID ${report.id
          .toString()
          .padStart(3, "0")}:`,
        report.status
      );

      if (newStatus !== null && validStatus.includes(newStatus)) {
        report.status = newStatus;
      } else if (newStatus !== null) {
        alert("Status tidak valid. Menggunakan status lama.");
      }

      alert(`Report ID ${report.id.toString().padStart(3, "0")} updated.`);
      updateReportsView(
        currentDate.getDate(),
        currentDate.getMonth(),
        currentDate.getFullYear()
      );
      navigateTo("system-reports");
    }
  };

  // --- FUNGSI SUBMISSION ---
  window.showSubmissionDetail = function (submissionId) {
    try {
      const submission = mockSubmissions.find((s) => s.id === submissionId);
      if (!submission) {
        console.warn("Submission not found:", submissionId);
        return;
      }

      const modalEl = document.getElementById("submission-detail-modal");
      if (!modalEl) {
        console.error("Submission detail modal not found in DOM");
        return;
      }

      document.getElementById(
        "submission-detail-id"
      ).textContent = `#${submission.id.toString().padStart(3, "0")}`;
      document.getElementById("submission-adopter-name").textContent =
        submission.adopterName || "-";
      document.getElementById("submission-adopter-email").textContent =
        submission.adopterEmail || "-";
      document.getElementById("submission-adopter-phone").textContent =
        submission.adopterPhone || "-";
      document.getElementById("submission-animal-name").textContent =
        submission.animalName || "-";

      const addrEl = document.getElementById("submission-address");
      if (addrEl) {
        addrEl.textContent = `${submission.address || ""}${
          submission.postcode ? " (" + submission.postcode + ")" : ""
        }`;
      }

      document.getElementById("submission-date").textContent = submission.date
        ? new Date(submission.date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "-";

      const statusSpan = document.getElementById("submission-status-display");
      statusSpan.textContent = submission.status || "Pending";
      statusSpan.className =
        submission.status === "Approved"
          ? "status-approved"
          : submission.status === "Rejected"
          ? "status-rejected"
          : "status-pending";

      const reasonEl = document.getElementById("submission-reason");
      if (reasonEl) reasonEl.value = submission.reason || "";

      const gardenEl = document.getElementById("submission-garden");
      if (gardenEl) gardenEl.textContent = submission.hasGarden ? "Yes" : "No";
      const livingEl = document.getElementById("submission-living");
      if (livingEl) livingEl.textContent = submission.living || "-";

      const extraBox = document.getElementById("submission-extra-details");
      if (extraBox) {
        extraBox.innerHTML = "";
        const details = submission.details || {};
        const keys = Object.keys(details);
        if (keys.length === 0) {
          extraBox.textContent = "No additional details.";
        } else {
          const rows = keys
            .map((k) => {
              const val = details[k];
              const label = k.replace(/_/g, " ");
              return `<div><strong>${label}:</strong> ${String(val)}</div>`;
            })
            .join("");
          extraBox.innerHTML = rows;
        }
      }

      // Ensure modal renders above everything and is visible
      modalEl.style.display = "flex";
      modalEl.style.zIndex = 1000;
      modalEl.classList.add("active");
      // Focus the modal for accessibility
      if (modalEl.focus) modalEl.focus();
    } catch (err) {
      console.error("showSubmissionDetail error:", err);
    }
  };

  // Global ESC to close any open modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal").forEach((m) => {
        if (m.style.display === "flex") {
          m.style.display = "none";
          m.classList.remove("active");
        }
      });
    }
  });

  window.approveSubmission = function (submissionId) {
    const submission = mockSubmissions.find((s) => s.id === submissionId);
    if (!submission) return;

    if (
      confirm(
        `Approve submission from ${submission.adopterName} for ${submission.animalName}?`
      )
    ) {
      fetch("/PetResQ/admin/submissions_update.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ id: submissionId, action: "approve" }),
      })
        .then((r) => r.json())
        .then((json) => {
          if (json.success) {
            submission.status = "Approved";
            alert("Submission approved and saved.");
            loadSubmissionsFromBackend().then(() =>
              renderSubmissions(currentSubmissionFilter)
            );
          } else {
            alert("Failed to approve: " + (json.message || "Unknown error"));
          }
        })
        .catch((err) => {
          console.warn("Approve error:", err);
          alert("Network/Server error while approving submission");
        });
    }
  };

  window.rejectSubmission = function (submissionId) {
    const submission = mockSubmissions.find((s) => s.id === submissionId);
    if (!submission) return;

    if (confirm(`Reject submission from ${submission.adopterName}?`)) {
      fetch("/PetResQ/admin/submissions_update.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ id: submissionId, action: "reject" }),
      })
        .then((r) => r.json())
        .then((json) => {
          if (json.success) {
            submission.status = "Rejected";
            alert("Submission rejected and saved.");
            loadSubmissionsFromBackend().then(() =>
              renderSubmissions(currentSubmissionFilter)
            );
          } else {
            alert("Failed to reject: " + (json.message || "Unknown error"));
          }
        })
        .catch((err) => {
          console.warn("Reject error:", err);
          alert("Network/Server error while rejecting submission");
        });
    }
  };

  let currentSubmissionFilter = "all";

  function renderSubmissions(filter = "all") {
    currentSubmissionFilter = filter;
    const grid = document.getElementById("submissions-grid");
    if (!grid) return;

    let filtered = mockSubmissions;
    if (filter === "pending") {
      filtered = mockSubmissions.filter((s) => s.status === "Pending");
    } else if (filter === "approved") {
      filtered = mockSubmissions.filter((s) => s.status === "Approved");
    } else if (filter === "rejected") {
      filtered = mockSubmissions.filter((s) => s.status === "Rejected");
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
                <div class="empty-submissions" style="grid-column: 1 / -1;">
                    <i class="fas fa-clipboard-list"></i>
                    <p style="font-size: 1.1em;">No submissions found for "${filter}" filter.</p>
                    <p style="margin-top: 10px; color: #aaa;">Submission forms akan muncul di sini setelah koneksi database.</p>
                </div>
            `;
      return;
    }

    grid.innerHTML = filtered
      .map((submission) => {
        let statusClass =
          submission.status === "Approved"
            ? "status-approved"
            : submission.status === "Rejected"
            ? "status-rejected"
            : "status-pending";
        let actionButtons = "";

        if (submission.status === "Pending") {
          actionButtons = `
                    <div class="submission-actions">
                        <button class="action-btn btn-approve" onclick="approveSubmission(${submission.id})">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button class="action-btn btn-reject" onclick="rejectSubmission(${submission.id})">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    </div>
                `;
        }

        return `
          <div class="submission-card" style="cursor:pointer;" onclick="showSubmissionDetail(${
            submission.id
          })">
                    <div class="submission-card-header">
                        <div class="submission-id">#${submission.id
                          .toString()
                          .padStart(3, "0")}</div>
                        <span class="${statusClass}">${submission.status}</span>
                    </div>
                    <div class="submission-card-body">
                        <div class="submission-info">
                            <i class="fas fa-user"></i>
                            <span>${submission.adopterName}</span>
                        </div>
                        <div class="submission-info">
                            <i class="fas fa-paw"></i>
                            <span>${submission.animalName}</span>
                        </div>
                        <div class="submission-info">
                          <i class="fas fa-envelope"></i>
                          <span>${submission.adopterEmail}</span>
                        </div>
                        
                    </div>
                    <div class="submission-card-footer">
                        <div class="submission-date">
                            <i class="fas fa-calendar"></i> ${new Date(
                              submission.date
                            ).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                        </div>
                        ${actionButtons}
                    </div>
                </div>
            `;
      })
      .join("");

    // Update filter tabs
    document.querySelectorAll(".filter-tab").forEach((tab) => {
      tab.classList.remove("active");
      if (tab.dataset.filter === filter) {
        tab.classList.add("active");
      }
    });
  }

  window.renderSubmissions = renderSubmissions;

  // --- TEMPLATE KONTEN UNTUK SETIAP HALAMAN ---
  const pageTemplates = {
    dashboard: `
            <div class="metrics-row">
                <div class="metric-box total-users-box">
                    <i class="fas fa-users"></i>
                    <span class="metric-value">${mockUsers.length}</span>
                    <span class="metric-label">Total Users</span>
                </div>
                <div class="metric-box total-animals-box">
                    <i class="fas fa-paw"></i>
                    <span class="metric-value">${mockAnimals.length}</span>
                    <span class="metric-label">Total Animals</span>
                </div>
                <div class="metric-box pending-reports-box">
                    <i class="fas fa-file-alt"></i>
                    <span class="metric-value">${
                      mockReports.filter((r) => r.status === "Pending").length
                    }</span>
                    <span class="metric-label">Pending Reports</span>
                </div>
            </div>
            
            <div class="content-row">
                <div class="recent-activity-box">
                    <h3>Recent Activity</h3>
                    <div class="placeholder-activity-text">
                        <i class="fas fa-chalkboard" style="font-size: 2em; margin-bottom: 10px; color: #aaa;"></i>
                        <p>Aktivitas log akan muncul di sini setelah koneksi dengan Backend/Database.</p>
                    </div>
                </div>

                <div class="insights-chart-box">
                    <h3>Insights Chart</h3>
                    <div class="insights-chart-placeholder" aria-hidden="true">
                        <svg width="120" height="120" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                            <circle r="16" cx="16" cy="16" fill="var(--color-background-light)" />
                        </svg>
                    </div>
                    <div class="insights-chart-legend">
                        <div class="legend-item"><span class="legend-swatch" style="background: var(--metric-brown-dark);"></span> New Users</div>
                        <div class="legend-item"><span class="legend-swatch" style="background: var(--color-secondary-brown);"></span> New Animals</div>
                        <div class="legend-item"><span class="legend-swatch" style="background: var(--color-accent-green);"></span> System Reports</div>
                    </div>
                </div>
            </div>
        `,
    "manage-users": `
            <h3>Manage Users</h3>
            <div style="margin-bottom: 12px; color: #444;">Showing ${
              mockUsers.length
            } of ${mockUsers.length} users</div>
            
            <div class="content-body">
                <div class="user-table-section">
                    <div class="manage-users-panel">
                        <div class="table-chips" role="list">
                            <span class="chip">Name</span>
                            <span class="chip">Email</span>
                            <span class="chip">Status</span>
                            <span class="chip">Action</span>
                        </div>
                        
                        <div class="manage-users-inner">
                            <div class="table-box">
                                <div class="table-container" style="padding: 0; box-shadow: none; background: transparent;">
                                    <table class="data-table user-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Status</th>
                                                <th style="text-align:center;">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody id="users-table-body">
                                            <tr class="empty-row">
                          <td colspan="4" style="text-align: center; color: #888; padding: 40px; background: transparent; border-radius: 6px;">
                                                    <i class="fas fa-users" style="font-size: 2em; display: block; margin-bottom: 10px;"></i>
                                                    Data user akan dimuat di sini setelah koneksi database.
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        
                        <div class="pagination-pill">
                            <div class="pill">Showing 1-10 of ${
                              mockUsers.length
                            } users &nbsp;&nbsp; Prev 1 2 3 ...</div>
                        </div>
                    </div>
                </div>

                <div class="summary-panel">
                    <div class="small-summary-card first">
                        <div class="small-number">${mockUsers.length}</div>
                        <div class="small-label">Total Users</div>
                    </div>
                    <div class="small-summary-card">
                        <div class="small-number">${
                          mockUsers.filter((u) => u.role === "owner").length
                        }</div>
                        <div class="small-label">Total Owners</div>
                    </div>
                    <div class="small-summary-card">
                        <div class="small-number">${
                          mockUsers.filter((u) => u.role === "adopter").length
                        }</div>
                        <div class="small-label">Total Adopters</div>
                    </div>
                </div>
            </div>
        `,
    "manage-animals": `
            <h3>Manage Animals</h3>
            <div style="margin-bottom: 12px; color: #444;">Showing ${
              mockAnimals.length
            } of ${mockAnimals.length} animals</div>
            
            <div class="content-body">
                <div class="user-table-section">
                    <div class="manage-users-panel">
                        <div class="table-chips" role="list">
                            <span class="chip">Photo</span>
                            <span class="chip">Animal Name</span>
                            <span class="chip">Category</span>
                            <span class="chip">Upload By</span>
                            <span class="chip">Action</span>
                        </div>
                        
                        <div class="manage-users-inner">
                            <div class="table-box">
                                <div class="table-container" style="padding: 0; box-shadow: none; background: transparent;">
                                    <table class="data-table user-table">
                                        <thead>
                                            <tr>
                                                <th>Photo</th>
                                                <th>Animal Name</th>
                                                <th>Category</th>
                                                <th>Upload By</th>
                                                <th style="text-align:center;">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody id="animals-table-body">
                                            <tr class="empty-row">
                                                <td colspan="5" style="text-align: center; color: #888; padding: 40px; background: transparent; border-radius: 6px;">
                                                    <i class="fas fa-paw" style="font-size: 2em; display: block; margin-bottom: 10px; color: var(--color-primary-dark);"></i>
                                                    Data hewan akan dimuat di sini setelah koneksi database.
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        
                        <div class="pagination-pill">
                            <div class="pill">Showing 1-5 of ${
                              mockAnimals.length
                            } animals &nbsp;&nbsp; Prev 1 2 3 ...</div>
                        </div>
                    </div>
                </div>

                <div class="summary-panel">
                    <div class="small-summary-card first">
                        <div class="small-number">${mockAnimals.length}</div>
                        <div class="small-label">Total Animals</div>
                    </div>
                    <div class="small-summary-card">
                        <div class="small-number">${
                          mockAnimals.filter((a) => a.category === "Dog").length
                        }</div>
                        <div class="small-label">Total Dogs</div>
                    </div>
                    <div class="small-summary-card">
                        <div class="small-number">${
                          mockAnimals.filter((a) => a.category === "Cat").length
                        }</div>
                        <div class="small-label">Total Cats</div>
                    </div>
                    <div class="small-summary-card">
                        <div class="small-number">${
                          mockAnimals.filter((a) => a.category === "Rabbit")
                            .length
                        }</div>
                        <div class="small-label">Total Rabbits</div>
                    </div>
                </div>
            </div>
        `,
    "system-reports": `
            <div class="metrics-row">
                <div class="metric-box" style="background-color: var(--color-primary-light);">
                    <i class="fas fa-file-alt"></i>
                    <span class="metric-value">${mockReports.length}</span>
                    <span class="metric-label">Total Reports</span>
                </div>
                <div class="metric-box" style="background-color: var(--color-primary-light);">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span class="metric-value">${
                      mockReports.filter((r) => r.type === "Error").length
                    }</span>
                    <span class="metric-label">Errors Logged</span>
                </div>
                <div class="metric-box" style="background-color: var(--color-primary-light);">
                    <i class="fas fa-clock"></i>
                    <span class="metric-value">N/A</span>
                    <span class="metric-label">Avg Resolution Time</span>
                </div>
            </div>

            <div class="reports-content-row">
                <div class="calendar-notes-box">
                    <div class="table-container">
                        <div class="calendar-header">
                            <i class="fas fa-chevron-left" id="prev-month" style="cursor: pointer;"></i> 
                            <span id="current-month-year" style="font-weight: bold;"></span>
                            <i class="fas fa-chevron-right" id="next-month" style="cursor: pointer;"></i>
                        </div>
                        <div class="calendar-grid" id="calendar-grid"></div>
                    </div>
                    <div class="table-container">
                        <h4 style="color: var(--color-primary-dark); font-size: 1em;">Notes</h4>
                        <textarea style="width: 100%; min-height: 120px; padding: 10px; border: 1px solid var(--color-border); border-radius: 8px;" placeholder="Tulis catatan penting tentang laporan di sini..."></textarea>
                    </div>
                </div>

                <div class="reports-list-box">
                    <div class="reports-list-header">
                        <h3 id="reports-header-title">Reports on ${currentDate.toLocaleDateString(
                          "en-US",
                          { day: "numeric", month: "long", year: "numeric" }
                        )}</h3>
                        <button class="btn btn-submit" id="create-report-btn">+ Create Report</button> 
                    </div>
                    <div id="reports-table-container">
                        <table class="reports-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Report Type</th>
                                    <th>Date Range</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Action</th> 
                                </tr>
                            </thead>
                            <tbody id="reports-body"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        `,
    submissions: `
            <div class="submissions-header">
                <h3>Adoption Submissions</h3>
                <div class="filter-tabs">
                    <button class="filter-tab active" data-filter="all" onclick="renderSubmissions('all')">
                        <i class="fas fa-list"></i> All
                    </button>
                    <button class="filter-tab" data-filter="pending" onclick="renderSubmissions('pending')">
                        <i class="fas fa-clock"></i> Pending
                    </button>
                    <button class="filter-tab" data-filter="approved" onclick="renderSubmissions('approved')">
                        <i class="fas fa-check-circle"></i> Approved
                    </button>
                    <button class="filter-tab" data-filter="rejected" onclick="renderSubmissions('rejected')">
                        <i class="fas fa-times-circle"></i> Rejected
                    </button>
                </div>
            </div>
            <div class="submissions-grid" id="submissions-grid"></div>
        `,
    "rehome-submissions": `
            <div class="submissions-header">
                <h3>Rehome Submissions</h3>
                <div class="filter-tabs">
                    <button class="filter-tab active" data-filter="all" onclick="renderRehomeSubmissions('all')">
                        <i class="fas fa-list"></i> All
                    </button>
                    <button class="filter-tab" data-filter="submitted" onclick="renderRehomeSubmissions('submitted')">
                        <i class="fas fa-hourglass-start"></i> Pending
                    </button>
                    <button class="filter-tab" data-filter="approved" onclick="renderRehomeSubmissions('approved')">
                        <i class="fas fa-check-circle"></i> Approved
                    </button>
                    <button class="filter-tab" data-filter="rejected" onclick="renderRehomeSubmissions('rejected')">
                        <i class="fas fa-times-circle"></i> Rejected
                    </button>
                </div>
            </div>
            <div class="submissions-grid" id="rehome-submissions-grid"></div>
        `,
  };

  // --- FUNGSI NAVIGASI UTAMA ---
  function navigateTo(pageId) {
    pageContent.innerHTML = pageTemplates[pageId];

    navItems.forEach((li) => li.classList.remove("active"));
    const activeItem = document.querySelector(
      `.nav-menu li[data-page="${pageId}"]`
    );
    if (activeItem) {
      activeItem.classList.add("active");
    }

    if (pageId === "system-reports") {
      const dynamicCreateReportBtn =
        document.getElementById("create-report-btn");
      const calendarGrid = document.getElementById("calendar-grid");
      const prevMonthBtn = document.getElementById("prev-month");
      const nextMonthBtn = document.getElementById("next-month");

      if (prevMonthBtn)
        prevMonthBtn.addEventListener("click", () => changeMonth(-1));
      if (nextMonthBtn)
        nextMonthBtn.addEventListener("click", () => changeMonth(1));
      if (calendarGrid) calendarGrid.addEventListener("click", handleDateClick);

      renderCalendar(currentDate);
      updateReportsView(
        currentDate.getDate(),
        currentDate.getMonth(),
        currentDate.getFullYear()
      );

      if (dynamicCreateReportBtn) {
        dynamicCreateReportBtn.addEventListener("click", () => {
          createReportModal.style.display = "flex";
          const formattedDate = `${currentDate.getFullYear()}-${(
            currentDate.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${currentDate
            .getDate()
            .toString()
            .padStart(2, "0")}`;
          document.getElementById("report-start-date").value = formattedDate;
          document.getElementById("report-end-date").value = formattedDate;
        });
      }

      const reportsBody = document.getElementById("reports-body");
      if (reportsBody) {
        reportsBody.addEventListener("click", (e) => {
          const row = e.target.closest("tr");
          const actionButton = e.target.closest(".report-action-btn");

          if (row && !actionButton) {
            const reportId = parseInt(row.getAttribute("data-report-id"));
            if (reportId) {
              showReportDetail(reportId);
            }
          }
        });
      }
    }

    if (pageId === "submissions") {
      // Load submissions from backend before rendering
      const grid = document.getElementById("submissions-grid");
      if (grid) {
        grid.innerHTML =
          '<div style="grid-column:1 / -1; text-align:center; color:#777; padding:16px;"><i class="fas fa-spinner fa-spin"></i> Loading submissions...</div>';
      }
      loadSubmissionsFromBackend()
        .then(() => {
          if (!mockSubmissions || mockSubmissions.length === 0) {
            if (grid) {
              grid.innerHTML =
                '<div class="empty-submissions" style="grid-column: 1 / -1; text-align:center; color:#888; padding:16px;"><i class="fas fa-clipboard-list"></i> No submissions found. If you expect data, verify the API and database.</div>';
            }
          }
          renderSubmissions("all");
        })
        .catch((err) => {
          console.warn("Failed to load submissions:", err);
          // Fallback to current mock state if API fails
          renderSubmissions("all");
        });
    }

    if (pageId === "rehome-submissions") {
      // Load rehome submissions from backend before rendering
      const grid = document.getElementById("rehome-submissions-grid");
      if (grid) {
        grid.innerHTML =
          '<div style="grid-column:1 / -1; text-align:center; color:#777; padding:16px;"><i class="fas fa-spinner fa-spin"></i> Loading rehome submissions...</div>';
      }
      loadRehomeSubmissionsFromBackend()
        .then(() => {
          if (!mockRehomeSubmissions || mockRehomeSubmissions.length === 0) {
            if (grid) {
              grid.innerHTML =
                '<div class="empty-submissions" style="grid-column: 1 / -1; text-align:center; color:#888; padding:16px;"><i class="fas fa-clipboard-list"></i> No rehome submissions found. If you expect data, verify the API and database.</div>';
            }
          }
          renderRehomeSubmissions("all");
        })
        .catch((err) => {
          console.warn("Failed to load rehome submissions:", err);
          // Fallback to current mock state if API fails
          renderRehomeSubmissions("all");
        });
    }

    if (pageId === "manage-users") {
      const tbody = document.getElementById("users-table-body");
      if (tbody) {
        tbody.innerHTML = `
          <tr class="empty-row">
            <td colspan="5" style="text-align:center; color:#888; padding:20px;">
              <i class="fas fa-spinner fa-spin"></i> Loading users...
            </td>
          </tr>`;
      }
      loadUsersFromBackend()
        .then(() => {
          renderManageUsers();
        })
        .catch((err) => {
          console.warn("Failed to load users:", err);
          renderManageUsers(); // Render any existing mockUsers (possibly empty)
        });
    }
  }

  // --- LOGIKA PERUBAHAN BULAN ---
  function changeMonth(step) {
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const newMonth = currentMonth + step;

    let newDate = new Date(currentDate.getFullYear(), newMonth, currentDay);

    if (newDate.getMonth() !== ((newMonth % 12) + 12) % 12) {
      newDate = new Date(currentDate.getFullYear(), newMonth + 1, 0);
    }

    currentDate = newDate;

    renderCalendar(currentDate);
    updateReportsView(
      currentDate.getDate(),
      currentDate.getMonth(),
      currentDate.getFullYear()
    );
  }

  // --- LOGIKA KLIK TANGGAL ---
  function handleDateClick(e) {
    const targetCell = e.target.closest(".date-cell");
    if (targetCell && !targetCell.classList.contains("empty-cell")) {
      document
        .querySelectorAll(".date-cell")
        .forEach((cell) => cell.classList.remove("selected-day"));

      const selectedDay = parseInt(targetCell.textContent);
      currentDate.setDate(selectedDay);
      targetCell.classList.add("selected-day");

      updateReportsView(
        currentDate.getDate(),
        currentDate.getMonth(),
        currentDate.getFullYear()
      );
    }
  }

  // --- LOGIKA UPDATE TAMPILAN LAPORAN ---
  function updateReportsView(day, monthIndex, year) {
    const headerTitle = document.getElementById("reports-header-title");
    const reportsBody = document.getElementById("reports-body");

    if (!headerTitle || !reportsBody) return;

    const month = new Date(year, monthIndex).toLocaleString("en-US", {
      month: "long",
    });
    headerTitle.textContent = `Reports on ${day} ${month} ${year}`;

    const targetDateString = `${year}-${(monthIndex + 1)
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

    const reportsForDate = mockReports.filter((report) => {
      return report.date === targetDateString;
    });

    if (reportsForDate.length > 0) {
      reportsBody.innerHTML = reportsForDate
        .map((report) => {
          const shortDesc =
            report.desc.substring(0, 50) +
            (report.desc.length > 50 ? "..." : "");

          let statusClass = "";
          if (report.status === "Done") {
            statusClass = "status-done";
          } else if (report.status === "Pending") {
            statusClass = "status-pending";
          }

          return `
                <tr data-report-id="${report.id}" style="cursor: pointer;">
                    <td style="text-align: center;">${report.id
                      .toString()
                      .padStart(3, "0")}</td>
                    <td>${report.type}</td>
                    <td>${report.range}</td>
                    <td>${shortDesc}</td>
                    <td style="text-align: center;"><span class="${statusClass}">${
            report.status
          }</span></td>
                    <td style="text-align: center;">
                        <i class="fas fa-edit report-action-btn" onclick="editReport(${
                          report.id
                        })" title="Edit Report" style="cursor: pointer; color: var(--color-primary-dark);"></i>
                        <i class="fas fa-trash-alt report-action-btn" onclick="deleteReport(${
                          report.id
                        })" title="Delete Report" style="cursor: pointer; color: var(--color-danger); margin-left: 10px;"></i>
                    </td>
                </tr>
            `;
        })
        .join("");
    } else {
      reportsBody.innerHTML = `
                <tr><td colspan="6" style="text-align: center; color: #888; padding: 20px;">
                    <i class="fas fa-cat" style="font-size: 2em; display: block; margin-bottom: 10px;"></i>
                    No reports found on this date. Create a new report using the button above.
                </td></tr>
            `;
    }

    if (document.querySelector(".metrics-row")) {
      document.querySelector(
        ".metrics-row .metric-box:nth-child(1) .metric-value"
      ).textContent = mockReports.length;
      document.querySelector(
        ".metrics-row .metric-box:nth-child(2) .metric-value"
      ).textContent = mockReports.filter((r) => r.type === "Error").length;
    }
  }

  // --- LOGIKA KALENDER UTAMA ---
  function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const activeDay = date.getDate();

    const monthName = new Date(year, month).toLocaleString("en-US", {
      month: "long",
    });
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarGrid = document.getElementById("calendar-grid");
    const currentMonthYear = document.getElementById("current-month-year");

    if (!calendarGrid || !currentMonthYear) return;

    currentMonthYear.textContent = `${monthName} ${year}`;

    const dayHeaders = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    let html = '<table class="calendar-table"><thead><tr>';
    dayHeaders.forEach((day) => {
      html += `<th>${day}</th>`;
    });
    html += "</tr></thead><tbody><tr>";

    let dayOfMonth = 1;
    const startOffset = new Date(year, month, 1).getDay();

    for (let i = 0; i < startOffset; i++) {
      html += `<td class="empty-cell"></td>`;
    }

    const datesWithReports = mockReports
      .filter((r) =>
        r.date.startsWith(`${year}-${(month + 1).toString().padStart(2, "0")}`)
      )
      .map((r) => parseInt(r.date.substring(8, 10)));

    for (let i = startOffset; dayOfMonth <= daysInMonth; i++) {
      if (i % 7 === 0 && dayOfMonth > 1) {
        html += "</tr><tr>";
      }

      const isSelectedDay =
        dayOfMonth === activeDay && date.getMonth() === month;
      const hasReport = datesWithReports.includes(dayOfMonth);

      let className = "date-cell";
      if (isSelectedDay) {
        className += " selected-day";
      }
      if (hasReport) {
        className += " has-report";
      }

      html += `<td class="${className}">${dayOfMonth}</td>`;
      dayOfMonth++;
    }

    while ((dayOfMonth + startOffset - 1) % 7 !== 0) {
      html += `<td class="empty-cell"></td>`;
      dayOfMonth++;
    }

    html += "</tr></tbody></table>";
    calendarGrid.innerHTML = html;
  }

  // --- LISTENER SIDEBAR ---
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      const page = e.currentTarget.getAttribute("data-page");
      if (page && page !== "logout") {
        e.preventDefault();
        navigateTo(page);
      }
    });
  });

  // --- INISIALISASI AWAL DASHBOARD ---
  navigateTo("dashboard");
}

// =========================================================
// --- AUTO START DASHBOARD ---
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  setupModalListeners();
  handleFormSubmit("login-tab", "login.php");
  handleFormSubmit("register-tab", "register.php");
  checkUserLogin();
});

// =========================================================
// --- BACKEND INTEGRATION: LOAD SUBMISSIONS ---
// =========================================================
async function loadSubmissionsFromBackend() {
  try {
    const resp = await fetch("/PetResQ/admin/submissions_api.php", {
      credentials: "include",
    });
    if (!resp.ok) throw new Error("Failed to load submissions");
    const json = await resp.json();
    if (json && Array.isArray(json.data)) {
      mockSubmissions = json.data.map((it) => ({
        id: it.id,
        adopterName: it.adopterName,
        adopterEmail: it.adopterEmail,
        adopterPhone: it.adopterPhone,
        animalName: it.animalName,
        date: it.date,
        status: it.status,
        reason: it.reason,
        address: it.address,
        city: it.city,
        postcode: it.postcode,
        hasGarden: it.hasGarden,
        living: it.living,
        details: it.details || {},
      }));
      console.log("Loaded submissions:", mockSubmissions.length);
    }
  } catch (e) {
    console.warn("Submissions API error:", e);
    // Leave mockSubmissions as-is
  }
}

// =========================================================
// --- REHOME SUBMISSIONS ---
// =========================================================
let mockRehomeSubmissions = [];

async function loadRehomeSubmissionsFromBackend() {
  try {
    const resp = await fetch("/PetResQ/admin/rehome_submissions_api.php", {
      credentials: "include",
    });
    if (!resp.ok) throw new Error("Failed to load rehome submissions");
    const json = await resp.json();
    if (json && Array.isArray(json.data)) {
      mockRehomeSubmissions = json.data.map((it) => ({
        id: it.id,
        ownerName: it.nama_user,
        ownerEmail: it.email_user,
        petName: it.pet_name,
        petType: it.pet_type,
        age: it.age_years,
        breed: it.breed,
        gender: it.gender,
        city: it.city,
        postcode: it.postcode,
        date: it.submitted_at,
        status: it.status,
      }));
      console.log("Loaded rehome submissions:", mockRehomeSubmissions.length);
    }
  } catch (e) {
    console.warn("Rehome submissions API error:", e);
    // Leave mockRehomeSubmissions as-is
  }
}

function renderRehomeSubmissions(filter = "all") {
  const grid = document.getElementById("rehome-submissions-grid");
  if (!grid) return;

  let filtered = mockRehomeSubmissions;
  if (filter === "submitted") {
    filtered = mockRehomeSubmissions.filter((s) => s.status === "submitted");
  } else if (filter === "approved") {
    filtered = mockRehomeSubmissions.filter((s) => s.status === "approved");
  } else if (filter === "rejected") {
    filtered = mockRehomeSubmissions.filter((s) => s.status === "rejected");
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-submissions" style="grid-column: 1 / -1;">
        <i class="fas fa-clipboard-list"></i>
        <p style="font-size: 1.1em;">No rehome submissions found for "${filter}" filter.</p>
        <p style="margin-top: 10px; color: #aaa;">Rehome submission forms akan muncul di sini setelah koneksi database.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered
    .map((submission) => {
      let statusClass =
        submission.status === "approved"
          ? "status-approved"
          : submission.status === "rejected"
          ? "status-rejected"
          : "status-pending";

      return `
        <div class="submission-card" style="cursor:pointer;" onclick="openRehomeDetail(${
          submission.id
        })">
          <div class="submission-card-header">
            <div class="submission-id">#${submission.id
              .toString()
              .padStart(3, "0")}</div>
            <span class="${statusClass}">${submission.status.toUpperCase()}</span>
          </div>
          <div class="submission-card-body">
            <div class="submission-info">
              <i class="fas fa-user"></i>
              <span>${submission.ownerName}</span>
            </div>
            <div class="submission-info">
              <i class="fas fa-paw"></i>
              <span>${submission.petName} (${submission.petType})</span>
            </div>
            <div class="submission-info">
              <i class="fas fa-envelope"></i>
              <span>${submission.ownerEmail}</span>
            </div>
            <div class="submission-info">
              <i class="fas fa-map-marker-alt"></i>
              <span>${submission.city}</span>
            </div>
          </div>
          <div class="submission-card-footer">
            <div class="submission-date">
              <i class="fas fa-calendar"></i> ${new Date(
                submission.date
              ).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  // Update filter tabs
  document.querySelectorAll(".filter-tab").forEach((tab) => {
    tab.classList.remove("active");
    if (tab.dataset.filter === filter) {
      tab.classList.add("active");
    }
  });
}

window.renderRehomeSubmissions = renderRehomeSubmissions;

// Open rehome submission detail in admin detail page
window.openRehomeDetail = function (id) {
  if (!id) return;
  window.location.href =
    "/PetResQ/admin/rehome_detail.php?id=" + encodeURIComponent(id);
};

// =========================================================
// --- BACKEND INTEGRATION: LOAD & RENDER USERS ---
// =========================================================
async function loadUsersFromBackend() {
  try {
    const resp = await fetch("/PetResQ/admin/users_api.php", {
      credentials: "include",
    });
    if (!resp.ok) throw new Error("Failed to load users");
    const json = await resp.json();
    if (json && Array.isArray(json.data)) {
      mockUsers = json.data.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role || "user",
        status: u.status || "active",
        registered: u.registered || null,
      }));
      console.log("Loaded users:", mockUsers.length);
    }
  } catch (e) {
    console.warn("Users API error:", e);
    // Leave mockUsers as-is
  }
}

function renderManageUsers() {
  const tbody = document.getElementById("users-table-body");
  if (!tbody) return;

  if (!mockUsers || mockUsers.length === 0) {
    tbody.innerHTML = `
      <tr class="empty-row">
        <td colspan="5" style="text-align: center; color: #888; padding: 40px; background: transparent; border-radius: 6px;">
          <i class="fas fa-users" style="font-size: 2em; display: block; margin-bottom: 10px;"></i>
          Tidak ada data user.
        </td>
      </tr>`;
    return;
  }

  const rows = mockUsers
    .map((u) => {
      const statusClass =
        u.status === "inactive"
          ? "status-rejected"
          : u.role === "admin"
          ? "status-approved"
          : "status-pending"; // default visual

      return `
        <tr>
          <td>${u.name || "-"}</td>
          <td>${u.email || "-"}</td>
          <td><span class="${statusClass}">${
        u.role ? u.role.toUpperCase() : u.status.toUpperCase()
      }</span></td>
          <td style="text-align:center;">
            <button class="btn btn-submit" title="Delete Account" onclick="deleteUser(${
              u.id
            })">Delete Account</button>
          </td>
        </tr>`;
    })
    .join("");

  tbody.innerHTML = rows;

  // Update summary numbers if present
  const totalUsersEl = document.querySelector(
    ".small-summary-card.first .small-number"
  );
  if (totalUsersEl) totalUsersEl.textContent = mockUsers.length;
  const totalOwnersEl = document.querySelector(
    ".summary-panel .small-summary-card:nth-child(2) .small-number"
  );
  if (totalOwnersEl)
    totalOwnersEl.textContent = mockUsers.filter(
      (u) => u.role === "owner"
    ).length;
  const totalAdoptersEl = document.querySelector(
    ".summary-panel .small-summary-card:nth-child(3) .small-number"
  );
  if (totalAdoptersEl)
    totalAdoptersEl.textContent = mockUsers.filter(
      (u) => u.role === "adopter"
    ).length;
}

window.renderManageUsers = renderManageUsers;

// --- DELETE USER ---
window.deleteUser = function (userId) {
  if (!userId || isNaN(userId)) return;
  if (!confirm("Are you sure you want to delete this account?")) return;
  fetch("/PetResQ/admin/delete_user.php", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ id: userId }),
  })
    .then((r) => r.json())
    .then((json) => {
      if (json && json.success) {
        // Refresh list
        loadUsersFromBackend().then(() => {
          renderManageUsers();
          alert("Account deleted.");
        });
      } else {
        alert(json.message || "Failed to delete account");
      }
    })
    .catch((err) => {
      console.warn("Delete user error:", err);
      alert("Network/Server error while deleting account");
    });
};
