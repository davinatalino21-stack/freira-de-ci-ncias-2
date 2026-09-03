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

const saveUserData = async (updatedUser) => {
  localStorage.setItem(userStorageKey, JSON.stringify(updatedUser));
};

const getInitials = (name) => {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const escapeHtml = (value) => {
  const p = document.createElement("p");
  p.textContent = value;
  return p.innerHTML;
};

const buildAvatar = (user) => {
  if (user.foto) {
    return `<img src="${escapeHtml(user.foto)}" alt="Avatar do usuário" />`;
  }
  return `<span>${getInitials(user.nome)}</span>`;
};

const updateNavbarAvatar = (user) => {
  const navbarIcon = document.getElementById("userMenuIcon");
  if (!navbarIcon) return;
  navbarIcon.innerHTML = buildAvatar(user);
};

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
    if (toast.parentNode === container) {
      container.removeChild(toast);
    }
  }, 2800);
};

const populateProfile = () => {
  const user = getUserData();
  if (!user) {
    window.location.href = "Login/login.html";
    return;
  }

  const profileAvatar = document.getElementById("profileAvatar");
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const profileLoginMethod = document.getElementById("profileLoginMethod");
  const profileCreatedAt = document.getElementById("profileCreatedAt");
  const profileId = document.getElementById("profileId");
  const securityText = document.getElementById("securityText");
  const profileAvatarUrl = document.getElementById("editAvatarUrl");
  const avatarFieldNote = document.getElementById("avatarFieldNote");

  const loginMethod = user.loginMethod || (user.foto ? "Google" : "Conta SFAI");
  const createdAt = user.createdAt || "Não disponível";
  const isGoogleAccount = loginMethod === "Google";

  if (profileAvatar) profileAvatar.innerHTML = buildAvatar(user);
  if (profileName) profileName.textContent = user.nome || "Usuário";
  if (profileEmail) profileEmail.textContent = user.email || "";
  if (profileLoginMethod) profileLoginMethod.textContent = loginMethod;
  if (profileCreatedAt) profileCreatedAt.textContent = createdAt;
  if (profileId) profileId.textContent = user.id || "-";
  if (securityText) {
    securityText.textContent = isGoogleAccount
      ? "Conta vinculada ao Google"
      : "Conta protegida por senha";
  }

  if (profileAvatarUrl) {
    profileAvatarUrl.value = isGoogleAccount ? "" : user.foto || "";
    profileAvatarUrl.disabled = isGoogleAccount;
    avatarFieldNote.textContent = isGoogleAccount
      ? "Contas Google não podem alterar a foto por aqui."
      : "Envie o link de uma imagem válida para seu avatar.";
  }

  updateNavbarAvatar(user);
};

const openEditModal = () => {
  const user = getUserData();
  if (!user) {
    window.location.href = "Login/login.html";
    return;
  }

  const editName = document.getElementById("editName");
  const editAvatarUrl = document.getElementById("editAvatarUrl");
  const modal = document.getElementById("editProfileModal");
  const loginMethod = user.loginMethod || (user.foto ? "Google" : "Conta SFAI");

  if (editName) editName.value = user.nome || "";
  if (editAvatarUrl)
    editAvatarUrl.value = loginMethod === "Google" ? "" : user.foto || "";
  if (editAvatarUrl) editAvatarUrl.disabled = loginMethod === "Google";

  if (modal) {
    modal.classList.remove("hidden");
  }
};

const closeEditModal = () => {
  const modal = document.getElementById("editProfileModal");
  if (modal) modal.classList.add("hidden");
};

const submitProfileUpdate = async (event) => {
  event.preventDefault();

  const user = getUserData();
  if (!user) return;

  const editName = document.getElementById("editName");
  const editAvatarUrl = document.getElementById("editAvatarUrl");
  if (!editName || !editAvatarUrl) return;

  const loginMethod = user.loginMethod || (user.foto ? "Google" : "Conta SFAI");
  const updatedUser = {
    ...user,
    nome: editName.value.trim() || user.nome,
    foto:
      loginMethod === "Google"
        ? user.foto
        : editAvatarUrl.value.trim() || user.foto,
  };

  const API_BASE_URL =
    "https://davidumbproxmax-classificador-mostratec.hf.space";

  try {
    const response = await fetch(`${API_BASE_URL}/usuario/atualizar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem(tokenStorageKey)}`,
      },
      body: JSON.stringify(updatedUser),
    });

    if (!response.ok) {
      throw new Error("Não foi possível atualizar o perfil no servidor.");
    }

    const result = await response.json().catch(() => null);
    const finalUser = result?.usuario || updatedUser;
    await saveUserData(finalUser);
  } catch (error) {
    await saveUserData(updatedUser);
  } finally {
    populateProfile();
    closeEditModal();
    showToast("Perfil atualizado com sucesso");
  }
};

const initProfilePage = () => {
  const token = localStorage.getItem(tokenStorageKey);
  if (!token) {
    window.location.href = "Login/login.html";
    return;
  }

  const backButton = document.getElementById("backButton");
  const editProfileButton = document.getElementById("editProfileButton");
  const logoutButton = document.getElementById("logoutFromProfile");
  const closeModalButton = document.getElementById("closeModalButton");
  const cancelEditButton = document.getElementById("cancelEditButton");
  const editProfileForm = document.getElementById("editProfileForm");
  const modal = document.getElementById("editProfileModal");

  populateProfile();

  if (backButton) {
    backButton.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  if (editProfileButton) {
    editProfileButton.addEventListener("click", openEditModal);
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem(tokenStorageKey);
      localStorage.removeItem(userStorageKey);
      window.location.href = "Login/login.html";
    });
  }

  if (closeModalButton) {
    closeModalButton.addEventListener("click", closeEditModal);
  }

  if (cancelEditButton) {
    cancelEditButton.addEventListener("click", closeEditModal);
  }

  if (editProfileForm) {
    editProfileForm.addEventListener("submit", submitProfileUpdate);
  }

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeEditModal();
      }
    });
  }
};

window.addEventListener("DOMContentLoaded", initProfilePage);
