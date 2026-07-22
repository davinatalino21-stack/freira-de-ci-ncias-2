const settingsKey = "sai_settings";
const userStorageKey = "usuario";
const tokenStorageKey = "token";

const getUserData = () => {
  const rawUser = localStorage.getItem(userStorageKey);
  if (!rawUser) return null;
  try {
    return JSON.parse(rawUser);
  } catch (error) {
    console.error("Falha ao ler usuário do localStorage:", error);
    return null;
  }
};

const getSettings = () => {
  const rawSettings = localStorage.getItem(settingsKey);
  return rawSettings
    ? JSON.parse(rawSettings)
    : {
        theme: "light",
        typingAnimation: true,
        enterSend: true,
        autoSaveHistory: true,
      };
};

const saveSettings = async (settings) => {
  localStorage.setItem(settingsKey, JSON.stringify(settings));
};

// Theme is managed globally by theme.js. Use window.Theme API.

const showToast = (message) => {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
  }, 2400);

  setTimeout(() => {
    if (toast.parentNode) container.removeChild(toast);
  }, 2800);
};

const clearChatHistory = () => {
  localStorage.removeItem("chatMessages");
  localStorage.removeItem("historicoConversa");
  showToast("Histórico do chat limpo");
};

const applySettings = (settings) => {
  const themeToggle = document.getElementById("themeToggle");
  const typingAnimationToggle = document.getElementById(
    "typingAnimationToggle",
  );
  const enterSendToggle = document.getElementById("enterSendToggle");
  const autoSaveHistoryToggle = document.getElementById(
    "autoSaveHistoryToggle",
  );
  const settingsAccountName = document.getElementById("settingsAccountName");
  const settingsAccountEmail = document.getElementById("settingsAccountEmail");
  const settingsAccountMethod = document.getElementById(
    "settingsAccountMethod",
  );

  if (themeToggle) themeToggle.checked = settings.theme === "dark";
  if (typingAnimationToggle)
    typingAnimationToggle.checked = settings.typingAnimation;
  if (enterSendToggle) enterSendToggle.checked = settings.enterSend;
  if (autoSaveHistoryToggle)
    autoSaveHistoryToggle.checked = settings.autoSaveHistory;

  if (window.Theme && typeof window.Theme.apply === "function") {
    window.Theme.apply(settings.theme);
  } else {
    document.documentElement.setAttribute("data-theme", settings.theme);
  }

  const user = getUserData();
  if (settingsAccountName)
    settingsAccountName.textContent = user?.nome || "Usuário";
  if (settingsAccountEmail)
    settingsAccountEmail.textContent = user?.email || "email@exemplo.com";
  if (settingsAccountMethod)
    settingsAccountMethod.textContent =
      user?.loginMethod || (user?.foto ? "Google" : "Conta SFAI");
};

const initSettingsPage = () => {
  const backButton = document.getElementById("backButton");
  const themeToggle = document.getElementById("themeToggle");
  const typingAnimationToggle = document.getElementById(
    "typingAnimationToggle",
  );
  const enterSendToggle = document.getElementById("enterSendToggle");
  const autoSaveHistoryToggle = document.getElementById(
    "autoSaveHistoryToggle",
  );
  const clearHistoryButton = document.getElementById("clearHistoryButton");
  const changePasswordButton = document.getElementById("changePasswordButton");
  const linkGoogleButton = document.getElementById("linkGoogleButton");
  const unlinkGoogleButton = document.getElementById("unlinkGoogleButton");
  const deleteAccountButton = document.getElementById("deleteAccountButton");
  const logoutButton = document.getElementById("logoutButton");
  const logoutAllButton = document.getElementById("logoutAllButton");
  const cancelDeleteButton = document.getElementById("cancelDeleteButton");
  const confirmDeleteButton = document.getElementById("confirmDeleteButton");
  const closeDeleteModalButton = document.getElementById(
    "closeDeleteModalButton",
  );
  const modal = document.getElementById("confirmModal");

  const settings = getSettings();
  // migrate theme to single 'theme' key if present in settings but not stored
  const THEME_KEY = "theme";
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme) {
    settings.theme = storedTheme;
  } else if (settings.theme) {
    localStorage.setItem(THEME_KEY, settings.theme);
  }
  applySettings(settings);

  const user = getUserData();
  const isGoogleAccount = user?.loginMethod === "Google";

  if (backButton) {
    backButton.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener("change", async () => {
      settings.theme = themeToggle.checked ? "dark" : "light";
      await saveSettings(settings);
      // persist canonical theme key
      localStorage.setItem(THEME_KEY, settings.theme);
      if (window.Theme && typeof window.Theme.apply === "function") {
        window.Theme.apply(settings.theme);
      } else {
        document.documentElement.setAttribute("data-theme", settings.theme);
      }
      showToast("Tema atualizado");
    });
  }

  if (typingAnimationToggle) {
    typingAnimationToggle.addEventListener("change", async () => {
      settings.typingAnimation = typingAnimationToggle.checked;
      await saveSettings(settings);
    });
  }

  if (enterSendToggle) {
    enterSendToggle.addEventListener("change", async () => {
      settings.enterSend = enterSendToggle.checked;
      await saveSettings(settings);
    });
  }

  if (autoSaveHistoryToggle) {
    autoSaveHistoryToggle.addEventListener("change", async () => {
      settings.autoSaveHistory = autoSaveHistoryToggle.checked;
      await saveSettings(settings);
    });
  }

  if (clearHistoryButton) {
    clearHistoryButton.addEventListener("click", clearChatHistory);
  }

  if (changePasswordButton) {
    changePasswordButton.disabled = isGoogleAccount;
    changePasswordButton.addEventListener("click", () => {
      showToast("Função disponível para contas SFAI");
    });
  }

  if (linkGoogleButton) {
    linkGoogleButton.disabled = isGoogleAccount;
    linkGoogleButton.addEventListener("click", () => {
      showToast("Integração com Google preparada");
    });
  }

  if (unlinkGoogleButton) {
    unlinkGoogleButton.disabled = !isGoogleAccount;
    unlinkGoogleButton.addEventListener("click", () => {
      showToast("Desvinculação do Google preparada");
    });
  }

  if (deleteAccountButton) {
    deleteAccountButton.addEventListener("click", () => {
      if (modal) modal.classList.remove("hidden");
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem(tokenStorageKey);
      localStorage.removeItem(userStorageKey);
      window.location.href = "Login/login.html";
    });
  }

  if (logoutAllButton) {
    logoutAllButton.addEventListener("click", () => {
      showToast("Sair de todos os dispositivos preparado");
    });
  }

  if (cancelDeleteButton) {
    cancelDeleteButton.addEventListener("click", () => {
      if (modal) modal.classList.add("hidden");
    });
  }

  if (confirmDeleteButton) {
    confirmDeleteButton.addEventListener("click", () => {
      if (modal) modal.classList.add("hidden");
      showToast("Exclusão de conta preparada");
    });
  }

  if (closeDeleteModalButton) {
    closeDeleteModalButton.addEventListener("click", () => {
      if (modal) modal.classList.add("hidden");
    });
  }

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) modal.classList.add("hidden");
    });
  }
};

window.addEventListener("DOMContentLoaded", initSettingsPage);
