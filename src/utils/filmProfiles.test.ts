import test from 'node:test';
import assert from 'node:assert/strict';
import { FILM_STOCKS, FILM_STOCK_LIST, getFilmStock } from './filmProfiles';

test('FILM_STOCKS: includes Kodak Portra 400, Fuji Velvia 50, and Ilford HP5 Plus', () => {
  assert.ok(FILM_STOCKS['portra_400'], 'Portra 400 should exist');
  assert.ok(FILM_STOCKS['velvia_50'], 'Velvia 50 should exist');
  assert.ok(FILM_STOCKS['hp5_plus'], 'Ilford HP5 Plus should exist');
  assert.ok(FILM_STOCKS['cinestill_800t'], 'CineStill 800T should exist');
  assert.ok(FILM_STOCKS['tri_x_400'], 'Tri-X 400 should exist');
  assert.ok(FILM_STOCKS['kodachrome_64'], 'Kodachrome 64 should exist');
});

test('getFilmStock: returns default when not found', () => {
  const stock = getFilmStock('non_existent_stock');
  assert.equal(stock.id, 'portra_400');
});

test('Black and white films have saturation 0.0', () => {
  const bwStocks = FILM_STOCK_LIST.filter(s => s.category === 'black_and_white');
  assert.ok(bwStocks.length >= 3, 'Should have at least 3 B&W films');
  for (const s of bwStocks) {
    assert.equal(s.saturation, 0.0, `${s.name} should have 0 saturation`);
  }
});

test('CineStill 800T has prominent highlight bloom (halation)', () => {
  const cinestill = FILM_STOCKS['cinestill_800t'];
  assert.ok(cinestill.highlightBloom > 0.5, 'CineStill should have strong halation bloom');
});
