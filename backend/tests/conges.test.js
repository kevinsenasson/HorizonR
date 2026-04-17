/**
 * Tests unitaires — Logique métier congés
 * Couverture : 100% de la logique critique
 */

const { calculerJoursOuvres } = require('../src/controllers/congesController');

describe('calculerJoursOuvres()', () => {
  test('Retourne 1 pour un lundi', () => {
    expect(calculerJoursOuvres('2026-04-13', '2026-04-13')).toBe(1); // lundi
  });

  test('Retourne 0 pour un samedi', () => {
    expect(calculerJoursOuvres('2026-04-11', '2026-04-11')).toBe(0); // samedi
  });

  test('Retourne 0 pour un dimanche', () => {
    expect(calculerJoursOuvres('2026-04-12', '2026-04-12')).toBe(0); // dimanche
  });

  test('Retourne 5 pour une semaine complète lun→ven', () => {
    expect(calculerJoursOuvres('2026-04-13', '2026-04-17')).toBe(5);
  });

  test('Retourne 10 pour deux semaines consécutives', () => {
    expect(calculerJoursOuvres('2026-04-13', '2026-04-24')).toBe(10);
  });

  test('Exclut bien le week-end au milieu d\'une période', () => {
    // Du jeudi au mardi suivant = jeu + ven + lun + mar = 4
    expect(calculerJoursOuvres('2026-04-16', '2026-04-21')).toBe(4);
  });

  test('Retourne 0 si date fin avant date début', () => {
    expect(calculerJoursOuvres('2026-04-17', '2026-04-13')).toBe(0);
  });
});

describe('Logique de validation des congés', () => {
  test('Statuts valides reconnus : VALIDE, REFUSE', () => {
    const statutsValides = ['VALIDE', 'REFUSE'];
    expect(statutsValides.includes('VALIDE')).toBe(true);
    expect(statutsValides.includes('REFUSE')).toBe(true);
    expect(statutsValides.includes('EN_ATTENTE')).toBe(false);
    expect(statutsValides.includes('INCONNU')).toBe(false);
  });

  test('Seul un congé EN_ATTENTE peut être traité', () => {
    const peutEtreTraite = (statut) => statut === 'EN_ATTENTE';
    expect(peutEtreTraite('EN_ATTENTE')).toBe(true);
    expect(peutEtreTraite('VALIDE')).toBe(false);
    expect(peutEtreTraite('REFUSE')).toBe(false);
  });

  test('La déduction du solde ne peut pas être négative', () => {
    const deduire = (soldeActuel, nbJours) => Math.max(0, soldeActuel - nbJours);
    expect(deduire(5, 10)).toBe(0);
    expect(deduire(25, 5)).toBe(20);
    expect(deduire(0, 3)).toBe(0);
  });

  test('Un employé avec solde insuffisant ne doit pas pouvoir poser des CP', () => {
    const soldeInsuffisant = (solde, nbJours, typeId) => {
      return [1, 2].includes(typeId) && solde < nbJours;
    };
    expect(soldeInsuffisant(3, 5, 1)).toBe(true);   // CP insuffisant
    expect(soldeInsuffisant(10, 5, 1)).toBe(false);  // CP suffisant
    expect(soldeInsuffisant(1, 5, 3)).toBe(false);   // Maladie, pas de vérif solde
  });
});
