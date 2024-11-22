const surLinux = undefined;
const surMac = undefined;
const surWindows = undefined;
const plateforme = undefined;

const requêteHttp = async () => {
  throw new Error(
    "Fonction `requêteHttp` non disponible sur la version navigateur de l'IUG. Utiliser uniquement si `isElectronRenderer === true`.",
  );
};

const choisirDossier = async () => {
  throw new Error(
    "Fonction `choisirDossier` non disponible sur la version navigateur de l'IUG. Utiliser uniquement si `isElectronRenderer === true`.",
  );
};

const demanderAccèsMédia = async () => {
  throw new Error(
    "Fonction `demanderAccèsMédia` non disponible sur la version navigateur de l'IUG. Utiliser uniquement si `isElectronRenderer === true`.",
  );
};

const redémarrer = async () => {
  window.location.reload();
};

export {choisirDossier, demanderAccèsMédia, plateforme, redémarrer, requêteHttp, surLinux, surMac, surWindows};
