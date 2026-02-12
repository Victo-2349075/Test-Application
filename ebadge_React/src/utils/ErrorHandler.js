/**
 * Outils de gestion d'erreurs pour harmoniser les messages
 * provenant d'Axios, de l'API Laravel et des erreurs JS locales.
 *
 * @author Philippe-Vu Beaulieu
 */

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
    const apiMessage = error?.response?.data?.message;

    if (typeof apiMessage === "string" && apiMessage.trim() !== "") {
      return apiMessage;
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
