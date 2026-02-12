// Api.js
import axios from "axios";
import { getUserFriendlyErrorMessage } from "./ErrorHandler";

/**
 * Détermine l'URL de base pour l'API Laravel.
 *
 * - Utilise REACT_APP_LARAVEL_API_URL si fournie.
 * - Sinon, retombe sur "/api" pour faciliter l'exécution locale via proxy/reverse proxy.
 *
 * @author Philippe-Vu Beaulieu
 * @returns {string} URL de base pour Axios
 */
function getApiBaseUrl() {
  const configuredUrl = process.env.REACT_APP_LARAVEL_API_URL;

  if (typeof configuredUrl === "string" && configuredUrl.trim() !== "") {
    return configuredUrl;
  }

  return "/api";
}

let axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Avant d'exécuter une requête, on ajoute le token dans le header.
axiosInstance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    error.userFriendlyMessage = getUserFriendlyErrorMessage(error);

    return Promise.reject(error);
  }
);

// Après avoir reçu une réponse, on vérifie si le token est invalide
// sinon on redirige vers la page de login.
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const statusCode = error?.response?.status;
    const message = error?.response?.data?.message;

    // Cas où l'API indique explicitement un token expiré/invalide.
    if (statusCode === 401 && message === "Unauthenticated.") {
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
    }

    error.userFriendlyMessage = getUserFriendlyErrorMessage(error);

    return Promise.reject(error);
  }
);

/**
 * Fonction qui retourne le lien d'une image sur le serveur PHP.
 *
 * @author Vincent Houle
 * @author Philippe-Vu Beaulieu
 * @param {string} image Image dans les ressources
 * @returns {string|undefined} Le lien vers l'image
 */
export function getResource(image) {
  if (typeof image !== "string" || image.trim() === "") {
    return undefined;
  }

  const resourceBaseUrl = process.env.REACT_APP_LARAVEL_RESOURCE_URL;

  if (typeof resourceBaseUrl !== "string" || resourceBaseUrl.trim() === "") {
    return image;
  }

  return `${resourceBaseUrl}/${image}`;
}

export default axiosInstance;
