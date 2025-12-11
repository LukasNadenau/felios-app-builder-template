import {
  fertObjektService,
  FertObjekt,
} from "./fertObjektService";
import {
  arbeitsgangService,
  Arbeitsgang,
} from "./arbeitsgangService";
import {
  anOrdBezService,
  AnOrdBez,
} from "./anOrdBezService";

export interface ProjektStrukturArbeitsgang extends Arbeitsgang {
  nachfolger: AnOrdBez[];
  vorgaenger: AnOrdBez[];
}

export interface ProjektStrukturFertigungsauftrag extends FertObjekt {
  children: ProjektStrukturArbeitsgang[];
}

export interface ProjektStrukturUnternetzplan extends FertObjekt {
  children: ProjektStrukturFertigungsauftrag[];
}

export interface ProjektStrukturNetzplan extends FertObjekt {
  children: ProjektStrukturUnternetzplan[];
}

export interface ProjektStruktur extends FertObjekt {
  children: ProjektStrukturNetzplan[];
}

export const projektStrukturService = {
  getAll: async (): Promise<ProjektStruktur[]> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const allFertObjekte = await fertObjektService.getAll();
        const allArbeitsgaenge = await arbeitsgangService.getAll();
        const allAnOrdBez = await anOrdBezService.getAll();

        const fertObjektsByParent = new Map<number, FertObjekt[]>();
        allFertObjekte.forEach((obj) => {
          const parentId = obj.parentFertObjektId;
          if (!fertObjektsByParent.has(parentId)) {
            fertObjektsByParent.set(parentId, []);
          }
          fertObjektsByParent.get(parentId)!.push(obj);
        });

        const arbeitsgaengeByParent = new Map<number, Arbeitsgang[]>();
        allArbeitsgaenge.forEach((ag) => {
          const parentId = ag.parentFertObjId;
          if (!arbeitsgaengeByParent.has(parentId)) {
            arbeitsgaengeByParent.set(parentId, []);
          }
          arbeitsgaengeByParent.get(parentId)!.push(ag);
        });

        const anOrdBezByQuelle = new Map<number, AnOrdBez[]>();
        const anOrdBezByZiel = new Map<number, AnOrdBez[]>();
        allAnOrdBez.forEach((bez) => {
          if (!anOrdBezByQuelle.has(bez.quelleId)) {
            anOrdBezByQuelle.set(bez.quelleId, []);
          }
          anOrdBezByQuelle.get(bez.quelleId)!.push(bez);

          if (!anOrdBezByZiel.has(bez.zielId)) {
            anOrdBezByZiel.set(bez.zielId, []);
          }
          anOrdBezByZiel.get(bez.zielId)!.push(bez);
        });

        const buildArbeitsgang = (
          arbeitsgang: Arbeitsgang
        ): ProjektStrukturArbeitsgang => {
          return {
            ...arbeitsgang,
            nachfolger: anOrdBezByQuelle.get(arbeitsgang.id) || [],
            vorgaenger: anOrdBezByZiel.get(arbeitsgang.id) || [],
          };
        };

        const buildFertigungsauftrag = (
          fertObjekt: FertObjekt
        ): ProjektStrukturFertigungsauftrag => {
          const arbeitsgaenge = arbeitsgaengeByParent.get(fertObjekt.id) || [];

          return {
            ...fertObjekt,
            children: arbeitsgaenge.map(buildArbeitsgang),
          };
        };

        const buildUnternetzplan = (
          fertObjekt: FertObjekt
        ): ProjektStrukturUnternetzplan => {
          const fertigungsauftraege = (
            fertObjektsByParent.get(fertObjekt.id) || []
          ).filter(
            (obj) =>
              obj.typ === "Fertigungsauftrag" || obj.typ === "Montageauftrag"
          );

          return {
            ...fertObjekt,
            children: fertigungsauftraege.map(buildFertigungsauftrag),
          };
        };

        const buildNetzplan = (
          fertObjekt: FertObjekt
        ): ProjektStrukturNetzplan => {
          const unternetzplaene = (
            fertObjektsByParent.get(fertObjekt.id) || []
          ).filter((obj) => obj.typ === "Unternetzplan");

          return {
            ...fertObjekt,
            children: unternetzplaene.map(buildUnternetzplan),
          };
        };

        const buildProjekt = (fertObjekt: FertObjekt): ProjektStruktur => {
          const netzplaene = (
            fertObjektsByParent.get(fertObjekt.id) || []
          ).filter((obj) => obj.typ === "Netzplan");

          return {
            ...fertObjekt,
            children: netzplaene.map(buildNetzplan),
          };
        };

        const projekte = allFertObjekte.filter(
          (obj) => obj.typ === "Projekt" && obj.parentFertObjektId === -1
        );

        resolve(projekte.map(buildProjekt));
      }, 100);
    });
  },

  getByProjektId: async (
    projektId: number
  ): Promise<ProjektStruktur | undefined> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const allFertObjekte = await fertObjektService.getAll();
        const projektFertObjekt = allFertObjekte.find(
          (obj) =>
            obj.id === projektId &&
            obj.typ === "Projekt" &&
            obj.parentFertObjektId === -1
        );

        if (!projektFertObjekt) {
          resolve(undefined);
          return;
        }

        const allArbeitsgaenge = await arbeitsgangService.getAll();
        const allAnOrdBez = await anOrdBezService.getAll();

        const fertObjektsByParent = new Map<number, FertObjekt[]>();
        allFertObjekte.forEach((obj) => {
          const parentId = obj.parentFertObjektId;
          if (!fertObjektsByParent.has(parentId)) {
            fertObjektsByParent.set(parentId, []);
          }
          fertObjektsByParent.get(parentId)!.push(obj);
        });

        const arbeitsgaengeByParent = new Map<number, Arbeitsgang[]>();
        allArbeitsgaenge.forEach((ag) => {
          const parentId = ag.parentFertObjId;
          if (!arbeitsgaengeByParent.has(parentId)) {
            arbeitsgaengeByParent.set(parentId, []);
          }
          arbeitsgaengeByParent.get(parentId)!.push(ag);
        });

        const anOrdBezByQuelle = new Map<number, AnOrdBez[]>();
        const anOrdBezByZiel = new Map<number, AnOrdBez[]>();
        allAnOrdBez.forEach((bez) => {
          if (!anOrdBezByQuelle.has(bez.quelleId)) {
            anOrdBezByQuelle.set(bez.quelleId, []);
          }
          anOrdBezByQuelle.get(bez.quelleId)!.push(bez);

          if (!anOrdBezByZiel.has(bez.zielId)) {
            anOrdBezByZiel.set(bez.zielId, []);
          }
          anOrdBezByZiel.get(bez.zielId)!.push(bez);
        });

        const buildArbeitsgang = (
          arbeitsgang: Arbeitsgang
        ): ProjektStrukturArbeitsgang => {
          return {
            ...arbeitsgang,
            nachfolger: anOrdBezByQuelle.get(arbeitsgang.id) || [],
            vorgaenger: anOrdBezByZiel.get(arbeitsgang.id) || [],
          };
        };

        const buildFertigungsauftrag = (
          fertObjekt: FertObjekt
        ): ProjektStrukturFertigungsauftrag => {
          const arbeitsgaenge = arbeitsgaengeByParent.get(fertObjekt.id) || [];

          return {
            ...fertObjekt,
            children: arbeitsgaenge.map(buildArbeitsgang),
          };
        };

        const buildUnternetzplan = (
          fertObjekt: FertObjekt
        ): ProjektStrukturUnternetzplan => {
          const fertigungsauftraege = (
            fertObjektsByParent.get(fertObjekt.id) || []
          ).filter(
            (obj) =>
              obj.typ === "Fertigungsauftrag" || obj.typ === "Montageauftrag"
          );

          return {
            ...fertObjekt,
            children: fertigungsauftraege.map(buildFertigungsauftrag),
          };
        };

        const buildNetzplan = (
          fertObjekt: FertObjekt
        ): ProjektStrukturNetzplan => {
          const unternetzplaene = (
            fertObjektsByParent.get(fertObjekt.id) || []
          ).filter((obj) => obj.typ === "Unternetzplan");

          return {
            ...fertObjekt,
            children: unternetzplaene.map(buildUnternetzplan),
          };
        };

        const buildProjekt = (fertObjekt: FertObjekt): ProjektStruktur => {
          const netzplaene = (
            fertObjektsByParent.get(fertObjekt.id) || []
          ).filter((obj) => obj.typ === "Netzplan");

          return {
            ...fertObjekt,
            children: netzplaene.map(buildNetzplan),
          };
        };

        resolve(buildProjekt(projektFertObjekt));
      }, 100);
    });
  },

  getArbeitsgaengeByFertigungsauftrag: async (
    fertigungsauftragId: number
  ): Promise<ProjektStrukturArbeitsgang[]> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const allArbeitsgaenge = await arbeitsgangService.getAll();
        const allAnOrdBez = await anOrdBezService.getAll();

        const anOrdBezByQuelle = new Map<number, AnOrdBez[]>();
        const anOrdBezByZiel = new Map<number, AnOrdBez[]>();
        allAnOrdBez.forEach((bez) => {
          if (!anOrdBezByQuelle.has(bez.quelleId)) {
            anOrdBezByQuelle.set(bez.quelleId, []);
          }
          anOrdBezByQuelle.get(bez.quelleId)!.push(bez);

          if (!anOrdBezByZiel.has(bez.zielId)) {
            anOrdBezByZiel.set(bez.zielId, []);
          }
          anOrdBezByZiel.get(bez.zielId)!.push(bez);
        });

        const arbeitsgaenge = allArbeitsgaenge.filter(
          (ag) => ag.parentFertObjId === fertigungsauftragId
        );

        const result = arbeitsgaenge.map((ag) => ({
          ...ag,
          nachfolger: anOrdBezByQuelle.get(ag.id) || [],
          vorgaenger: anOrdBezByZiel.get(ag.id) || [],
        }));

        resolve(result);
      }, 100);
    });
  },
};
