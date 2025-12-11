import { describe, it, expect } from "vitest";
import {
  projektStrukturService,
  ProjektStruktur,
  ProjektStrukturArbeitsgang,
  ProjektStrukturNode,
} from "./projektStrukturService";

function isNode(child: any): child is ProjektStrukturNode {
  return "children" in child && "typ" in child;
}

describe("projektStrukturService", () => {
  describe("getAll", () => {
    it("should return an array of projekt hierarchies", async () => {
      const result = await projektStrukturService.getAll();
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should return projekte with correct structure", async () => {
      const result = await projektStrukturService.getAll();
      const first = result[0];

      expect(first).toHaveProperty("id");
      expect(first).toHaveProperty("bezeichnung");
      expect(first).toHaveProperty("typ");
      expect(first.typ).toBe("Projekt");
      expect(first).toHaveProperty("children");
      expect(first.children).toBeInstanceOf(Array);
    });

    it("should nest Netzplaene under Projekt", async () => {
      const result = await projektStrukturService.getAll();
      const projekt = result[0];

      if (projekt.children.length > 0) {
        const netzplan = projekt.children[0];
        if (isNode(netzplan)) {
          expect(netzplan.typ).toBe("Netzplan");
          expect(netzplan).toHaveProperty("children");
        }
      }
    });

    it("should nest Unternetzplaene under Netzplan", async () => {
      const result = await projektStrukturService.getAll();
      const projekt = result[0];

      if (projekt.children.length > 0) {
        const netzplan = projekt.children[0];
        if (isNode(netzplan) && netzplan.children.length > 0) {
          const unternetzplan = netzplan.children[0];
          if (isNode(unternetzplan)) {
            expect(unternetzplan.typ).toBe("Unternetzplan");
            expect(unternetzplan).toHaveProperty("children");
          }
        }
      }
    });

    it("should nest Fertigungsauftraege under Unternetzplan", async () => {
      const result = await projektStrukturService.getAll();
      const projekt = result[0];

      const netzplan = projekt.children[0];
      if (netzplan && isNode(netzplan) && netzplan.children.length > 0) {
        const unternetzplan = netzplan.children[0];
        if (isNode(unternetzplan) && unternetzplan.children.length > 0) {
          const fertigungsauftrag = unternetzplan.children[0];
          if (isNode(fertigungsauftrag)) {
            expect(["Fertigungsauftrag", "Montageauftrag"]).toContain(
              fertigungsauftrag.typ
            );
            expect(fertigungsauftrag).toHaveProperty("children");
          }
        }
      }
    });

    it("should nest Arbeitsgaenge under Fertigungsauftrag", async () => {
      const result = await projektStrukturService.getAll();

      const projekt = result[0];
      const netzplan = projekt.children[0];
      if (!isNode(netzplan)) return;
      
      const unternetzplan = netzplan.children[0];
      if (!isNode(unternetzplan)) return;
      
      const fertigungsauftrag = unternetzplan.children[0];
      if (!isNode(fertigungsauftrag)) return;

      if (fertigungsauftrag.children.length > 0) {
        const arbeitsgang = fertigungsauftrag.children[0];
        expect(arbeitsgang).toHaveProperty("id");
        expect(arbeitsgang).toHaveProperty("bezeichnung");
        expect(arbeitsgang).toHaveProperty("nachfolger");
        expect(arbeitsgang).toHaveProperty("vorgaenger");
        if ("nachfolger" in arbeitsgang && "vorgaenger" in arbeitsgang) {
          expect(arbeitsgang.nachfolger).toBeInstanceOf(Array);
          expect(arbeitsgang.vorgaenger).toBeInstanceOf(Array);
        }
      }
    });

    it("should include AnOrdBez dependencies in Arbeitsgaenge", async () => {
      const result = await projektStrukturService.getAll();

      let foundWithDependencies = false;

      for (const projekt of result) {
        for (const netzplan of projekt.children) {
          if (!isNode(netzplan)) continue;
          for (const unternetzplan of netzplan.children) {
            if (!isNode(unternetzplan)) continue;
            for (const fertigungsauftrag of unternetzplan.children) {
              if (!isNode(fertigungsauftrag)) continue;
              for (const arbeitsgang of fertigungsauftrag.children) {
                if (!("nachfolger" in arbeitsgang)) continue;
                if (
                  arbeitsgang.nachfolger.length > 0 ||
                  arbeitsgang.vorgaenger.length > 0
                ) {
                  foundWithDependencies = true;

                  if (arbeitsgang.nachfolger.length > 0) {
                    const nachfolger = arbeitsgang.nachfolger[0];
                    expect(nachfolger).toHaveProperty("quelleId");
                    expect(nachfolger).toHaveProperty("zielId");
                    expect(nachfolger).toHaveProperty("typ");
                    expect(nachfolger.quelleId).toBe(arbeitsgang.id);
                  }

                  if (arbeitsgang.vorgaenger.length > 0) {
                    const vorgaenger = arbeitsgang.vorgaenger[0];
                    expect(vorgaenger).toHaveProperty("quelleId");
                    expect(vorgaenger).toHaveProperty("zielId");
                    expect(vorgaenger.zielId).toBe(arbeitsgang.id);
                  }

                  break;
                }
              }
              if (foundWithDependencies) break;
            }
            if (foundWithDependencies) break;
          }
          if (foundWithDependencies) break;
        }
        if (foundWithDependencies) break;
      }

      expect(foundWithDependencies).toBe(true);
    });
  });

  describe("getByProjektId", () => {
    it("should return a projekt hierarchy when given valid id", async () => {
      const all = await projektStrukturService.getAll();
      const firstProjekt = all[0];

      const result = await projektStrukturService.getByProjektId(
        firstProjekt.id
      );

      expect(result).toBeDefined();
      expect(result?.id).toBe(firstProjekt.id);
      expect(result?.children).toEqual(firstProjekt.children);
    });

    it("should return undefined when given invalid projekt id", async () => {
      const result = await projektStrukturService.getByProjektId(999999);
      expect(result).toBeUndefined();
    });

    it("should return undefined when given non-projekt id", async () => {
      const result = await projektStrukturService.getByProjektId(2);
      expect(result).toBeUndefined();
    });
  });

  describe("getArbeitsgaengeByFertigungsauftrag", () => {
    it("should return arbeitsgaenge for a valid fertigungsauftrag", async () => {
      const result =
        await projektStrukturService.getArbeitsgaengeByFertigungsauftrag(4);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);

      result.forEach((ag) => {
        expect(ag).toHaveProperty("nachfolger");
        expect(ag).toHaveProperty("vorgaenger");
        expect(ag.parentFertObjId).toBe(4);
      });
    });

    it("should return empty array for fertigungsauftrag with no arbeitsgaenge", async () => {
      const result =
        await projektStrukturService.getArbeitsgaengeByFertigungsauftrag(
          999999
        );

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });

  describe("empty children handling", () => {
    it("should return empty arrays for nodes with no children", async () => {
      const result = await projektStrukturService.getAll();

      result.forEach((projekt) => {
        expect(projekt.children).toBeInstanceOf(Array);

        projekt.children.forEach((netzplan) => {
          if (isNode(netzplan)) {
            expect(netzplan.children).toBeInstanceOf(Array);

            netzplan.children.forEach((unternetzplan) => {
              if (isNode(unternetzplan)) {
                expect(unternetzplan.children).toBeInstanceOf(Array);

                unternetzplan.children.forEach((fertigungsauftrag) => {
                  if (isNode(fertigungsauftrag)) {
                    expect(fertigungsauftrag.children).toBeInstanceOf(Array);
                  }
                });
              }
            });
          }
        });
      });
    });
  });

  describe("async behavior", () => {
    it("should simulate API latency with 100ms delay", async () => {
      const start = Date.now();
      await projektStrukturService.getAll();
      const duration = Date.now() - start;

      expect(duration).toBeGreaterThanOrEqual(100);
    });
  });
});
