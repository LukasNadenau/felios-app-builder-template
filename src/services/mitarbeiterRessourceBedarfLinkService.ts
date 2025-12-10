import data from '../data/MitarbeiterRessourceBedarfLink.json';

export interface MitarbeiterRessourceBedarfLink {
  mitarbeiterId: number;
  arbeitsgangId: number;
  tag: number;
  minuten: number;
}

export const mitarbeiterRessourceBedarfLinkService = {
  getAll: async (): Promise<MitarbeiterRessourceBedarfLink[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data as MitarbeiterRessourceBedarfLink[]), 100);
    });
  },

  getByMitarbeiterAndArbeitsgang: async (mitarbeiterId: number, arbeitsgangId: number): Promise<MitarbeiterRessourceBedarfLink[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = data.filter((item) => item.mitarbeiterId === mitarbeiterId && item.arbeitsgangId === arbeitsgangId);
        resolve(items as MitarbeiterRessourceBedarfLink[]);
      }, 100);
    });
  },

  getByMitarbeiter: async (mitarbeiterId: number): Promise<MitarbeiterRessourceBedarfLink[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = data.filter((item) => item.mitarbeiterId === mitarbeiterId);
        resolve(items as MitarbeiterRessourceBedarfLink[]);
      }, 100);
    });
  },

  getByArbeitsgang: async (arbeitsgangId: number): Promise<MitarbeiterRessourceBedarfLink[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = data.filter((item) => item.arbeitsgangId === arbeitsgangId);
        resolve(items as MitarbeiterRessourceBedarfLink[]);
      }, 100);
    });
  },
};
