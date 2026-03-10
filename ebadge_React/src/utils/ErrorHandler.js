/**
 * Outils de gestion d'erreurs pour harmoniser les messages
 * provenant d'Axios, de l'API Laravel et des erreurs JS locales.
 *
 * @author Philippe-Vu Beaulieu
 */

/**
 * Extrait le premier message de validation Laravel lorsqu'il existe.
 *
 * @author Philippe-Vu Beaulieu
 * @param {unknown} errors Objet "errors" Laravel
 * @returns {string} Message brut ou chaîne vide
 */
function getFirstValidationError(errors) {
  if (!errors || typeof errors !== "object") {
    return "";
  }

  const firstFieldErrors = Object.values(errors).find((value) => Array.isArray(value) && value.length > 0);

  return typeof firstFieldErrors?.[0] === "string" ? firstFieldErrors[0] : "";
}

/**
 * Normalise les messages techniques les plus fréquents en message utilisateur.
 *
 * @author Philippe-Vu Beaulieu
 * @param {string} message Message brut reçu de l'API
 * @returns {string} Message utilisateur normalisé
 */
function normalizeValidationMessage(message) {
  if (typeof message !== "string" || message.trim() === "") {
    return "";
  }

  if (/(teacher[_\s]?code|code enseignant)/i.test(message) && /(selected is invalid|sélectionné est invalide|invalid|invalide)/i.test(message)) {
    return "Le code enseignant est invalide, expiré ou déjà utilisé.";
  }

  return message;
}

/**
 * Détermine si une erreur provient d'une réponse HTTP Axios.
 *
 * @author Philippe-Vu Beaulieu
 * @param {any} error Objet erreur
 * @returns {boolean}
 */
export function isAxiosHttpError(error) {
  return Boolean(error && error.response && typeof error.response.status === "number");
}

/**
 * Construit un message utilisateur à partir d'une erreur technique.
 *
 * @author Philippe-Vu Beaulieu
 * @param {any} error Objet erreur
 * @returns {string} Message lisible par l'utilisateur
 */
export function getUserFriendlyErrorMessage(error) {
  if (isAxiosHttpError(error)) {
    const validationMessage = getFirstValidationError(error?.response?.data?.errors);
    if (validationMessage) {
      return normalizeValidationMessage(validationMessage);
    }

    const apiMessage = error?.response?.data?.message;
    if (typeof apiMessage === "string" && apiMessage.trim() !== "") {
      return normalizeValidationMessage(apiMessage);
    }

    if (error.response.status >= 500) {
      return "Une erreur serveur est survenue. Veuillez réessayer plus tard.";
    }

    return "La requête n'a pas pu être traitée.";
  }

  if (error?.request) {
    return "Impossible de joindre l'API. Vérifiez la connexion API/React.";
  }

  if (typeof error?.message === "string" && error.message.trim() !== "") {
    return error.message;
  }

  return "Une erreur inattendue est survenue.";
}
