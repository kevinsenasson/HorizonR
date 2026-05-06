const service = require('../src/services/employesService');
const repo    = require('../src/repositories/employesRepository');
const bcrypt  = require('bcrypt');

jest.mock('../src/repositories/employesRepository');
jest.mock('bcrypt');

describe('employesService', () => {

  beforeEach(() => jest.clearAllMocks());

  // listerEmployes
  it('listerEmployes - ADMIN appelle findAll', async () => {
    repo.findAll.mockResolvedValue([{ id: 1 }]);
    const res = await service.listerEmployes('ADMIN', 1);
    expect(repo.findAll).toHaveBeenCalled();
    expect(res.length).toBe(1);
  });

  it('listerEmployes - MANAGER appelle findByManagerId', async () => {
    repo.findByManagerId.mockResolvedValue([{ id: 2 }]);
    const res = await service.listerEmployes('MANAGER', 5);
    expect(repo.findByManagerId).toHaveBeenCalledWith(5);
    expect(res.length).toBe(1);
  });

  // getEmploye
  it('getEmploye - trouvé', async () => {
    repo.findById.mockResolvedValue({ id: 1, nom: 'Doe' });
    const res = await service.getEmploye(1);
    expect(res.nom).toBe('Doe');
  });

  it('getEmploye - non trouvé', async () => {
    repo.findById.mockResolvedValue(undefined);
    const res = await service.getEmploye(99);
    expect(res.error).toBe('not found');
  });

  // creerEmploye
  it('creerEmploye - champs manquants', async () => {
    const res = await service.creerEmploye({ nom: 'X' });
    expect(res.error).toBe('missing fields');
  });

  it('creerEmploye - mot de passe faible', async () => {
    const res = await service.creerEmploye({
      nom: 'X', prenom: 'Y', email: 'e@e.com', mot_de_passe: '123', role_id: 1
    });
    expect(res.error).toBe('weak password');
  });

  it('creerEmploye - email dupliqué', async () => {
    bcrypt.hash.mockResolvedValue('hashed');
    repo.insert.mockRejectedValue({ code: 'ER_DUP_ENTRY' });
    const res = await service.creerEmploye({
      nom: 'X', prenom: 'Y', email: 'e@e.com', mot_de_passe: 'Aa1@aaaa', role_id: 1
    });
    expect(res.error).toBe('duplicate email');
  });

  it('creerEmploye - succès', async () => {
    bcrypt.hash.mockResolvedValue('hashed');
    repo.insert.mockResolvedValue(10);
    const res = await service.creerEmploye({
      nom: 'X', prenom: 'Y', email: 'e@e.com', mot_de_passe: 'Aa1@aaaa', role_id: 1
    });
    expect(res.id).toBe(10);
  });

  // modifierEmploye
  it('modifierEmploye - non trouvé', async () => {
    repo.findByIdSimple.mockResolvedValue(undefined);
    const res = await service.modifierEmploye(99, {});
    expect(res.error).toBe('not found');
  });

  it('modifierEmploye - email dupliqué', async () => {
    repo.findByIdSimple.mockResolvedValue({ id: 1, actif: 1 });
    repo.update.mockRejectedValue({ code: 'ER_DUP_ENTRY' });
    const res = await service.modifierEmploye(1, {});
    expect(res.error).toBe('duplicate email');
  });

  it('modifierEmploye - succès', async () => {
    repo.findByIdSimple.mockResolvedValue({ id: 1, actif: 1 });
    repo.update.mockResolvedValue();
    const res = await service.modifierEmploye(1, { nom: 'X' });
    expect(res.ok).toBe(true);
  });

  // supprimerEmploye
  it('supprimerEmploye - auto-suppression', async () => {
    const res = await service.supprimerEmploye('1', 1);
    expect(res.error).toBe('self delete');
  });

  it('supprimerEmploye - non trouvé', async () => {
    repo.findByIdSimple.mockResolvedValue(undefined);
    const res = await service.supprimerEmploye('99', 1);
    expect(res.error).toBe('not found');
  });

  it('supprimerEmploye - succès', async () => {
    repo.findByIdSimple.mockResolvedValue({ id: 2, actif: 1 });
    repo.deactivate.mockResolvedValue();
    const res = await service.supprimerEmploye('2', 1);
    expect(res.ok).toBe(true);
  });

  // supprimerEmployeDefinitivement
  it('supprimerEmployeDefinitivement - auto-suppression', async () => {
    const res = await service.supprimerEmployeDefinitivement('1', 1);
    expect(res.error).toBe('self delete');
  });

  it('supprimerEmployeDefinitivement - non trouvé', async () => {
    repo.findByIdSimple.mockResolvedValue(undefined);
    const res = await service.supprimerEmployeDefinitivement('99', 1);
    expect(res.error).toBe('not found');
  });

  it('supprimerEmployeDefinitivement - encore actif', async () => {
    repo.findByIdSimple.mockResolvedValue({ id: 2, actif: 1 });
    const res = await service.supprimerEmployeDefinitivement('2', 1);
    expect(res.error).toBe('still active');
  });

  it('supprimerEmployeDefinitivement - succès', async () => {
    repo.findByIdSimple.mockResolvedValue({ id: 2, actif: 0 });
    repo.deleteById.mockResolvedValue();
    const res = await service.supprimerEmployeDefinitivement('2', 1);
    expect(res.ok).toBe(true);
  });

  // helpers
  it('listerEmployesService', async () => {
    repo.findByServiceOf.mockResolvedValue([{ id: 5 }]);
    const res = await service.listerEmployesService(1);
    expect(res.length).toBe(1);
  });

  it('listerServices', async () => {
    repo.findServices.mockResolvedValue([{ id: 1, nom: 'IT' }]);
    const res = await service.listerServices();
    expect(res[0].nom).toBe('IT');
  });

  it('listerRoles', async () => {
    repo.findRoles.mockResolvedValue([{ id: 1, nom: 'ADMIN' }]);
    const res = await service.listerRoles();
    expect(res[0].nom).toBe('ADMIN');
  });

});
