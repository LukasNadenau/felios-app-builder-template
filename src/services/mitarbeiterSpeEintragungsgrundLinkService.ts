import data from '../data/MitarbeiterSpeEintragungsgrundLink.json';

export interface MitarbeiterSpeEintragungsgrundLink {
  mitarbeiterId: number;
  schichtmodellId: number;
  tag: number;
}

export const mitarbeiterSpeEintragungsgrundLinkService = {
  getAll: async (): Promise<MitarbeiterSpeEintragungsgrundLink[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data as MitarbeiterSpeEintragungsgrundLink[]), 100);
    });
  },

  getBySchichtmodell: async (schichtmodellId: number): Promise<MitarbeiterSpeEintragungsgrundLink[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = data.filter((item) => item.schichtmodellId === schichtmodellId);
        resolve(items as MitarbeiterSpeEintragungsgrundLink[]);
      }, 100);
    });
  },

  getByMitarbeiter: async (mitarbeiterId: number): Promise<MitarbeiterSpeEintragungsgrundLink[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = data.filter((item) => item.mitarbeiterId === mitarbeiterId);
        resolve(items as MitarbeiterSpeEintragungsgrundLink[]);
      }, 100);
    });
  },
};
