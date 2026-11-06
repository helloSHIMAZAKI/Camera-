import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLightDistance,
  calculateIncidentLux,
  calculateKeyToFillRatio,
  kelvinToRgb,
  STUDIO_LIGHTING_PRESETS,
  SUBJECT_POSITION
} from './lightingCalculator';
import { StudioLight } from '../types/camera';

test('calculateLightDistance: computes Euclidean distance from subject at [0, 1.2, 0]', () => {
  // Light placed at [0, 1.2, 3] -> distance is exactly 3m
  const d1 = calculateLightDistance({ x: 0, y: 1.2, z: 3 });
  assert.equal(Math.round(d1 * 100) / 100, 3.0);

  // Light placed at [3, 1.2, 4] -> dx=3, dy=0, dz=4 -> distance 5m
  const d2 = calculateLightDistance({ x: 3, y: 1.2, z: 4 });
  assert.equal(Math.round(d2 * 100) / 100, 5.0);
});

test('calculateIncidentLux: inverse square law halves lux by 4x when distance doubles', () => {
  const lightA: StudioLight = {
    id: 'test_a',
    name: 'Test Light',
    type: 'key',
    x: 0,
    y: 1.2,
    z: 1.0, // distance = 1.0m
    intensityLux: 1000,
    colorTempK: 5600,
    modifier: 'bare_bulb', // factor 1.0
    enabled: true
  };

  const lightB: StudioLight = {
    ...lightA,
    z: 2.0 // distance = 2.0m (doubled)
  };

  const luxA = calculateIncidentLux(lightA);
  const luxB = calculateIncidentLux(lightB);

  // At 2m, lux should be 1/4 of 1m
  assert.equal(Math.round(luxA), 1000);
  assert.equal(Math.round(luxB), 250);
});

test('calculateIncidentLux: disabled lights return 0 lux', () => {
  const disabledLight: StudioLight = {
    id: 'off_light',
    name: 'Off',
    type: 'fill',
    x: 1,
    y: 1.2,
    z: 1,
    intensityLux: 2000,
    colorTempK: 5600,
    modifier: 'softbox',
    enabled: false
  };
  assert.equal(calculateIncidentLux(disabledLight), 0);
});

test('calculateKeyToFillRatio: calculates ratio accurately', () => {
  const lights: StudioLight[] = [
    {
      id: 'k',
      name: 'Key',
      type: 'key',
      x: 0,
      y: 1.2,
      z: 1.0,
      intensityLux: 1500,
      colorTempK: 5600,
      modifier: 'bare_bulb',
      enabled: true
    },
    {
      id: 'f',
      name: 'Fill',
      type: 'fill',
      x: 0,
      y: 1.2,
      z: 1.0,
      intensityLux: 500,
      colorTempK: 5600,
      modifier: 'bare_bulb',
      enabled: true
    }
  ];

  const result = calculateKeyToFillRatio(lights);
  assert.equal(result.ratioString, '3.0:1');
  assert.equal(Math.round(result.ratioNumeric), 3);
});

test('kelvinToRgb: 3200K tungsten has warm orange tone and 6500K daylight has blue tone', () => {
  const rgb3200 = kelvinToRgb(3200);
  assert.ok(rgb3200[0] > rgb3200[2], 'Tungsten 3200K red should exceed blue');

  const rgb6500 = kelvinToRgb(6500);
  assert.ok(rgb6500[0] <= 255 && rgb6500[1] <= 255 && rgb6500[2] <= 255);
});

test('STUDIO_LIGHTING_PRESETS: has all standard portrait genres', () => {
  const ids = STUDIO_LIGHTING_PRESETS.map(p => p.id);
  assert.ok(ids.includes('rembrandt'));
  assert.ok(ids.includes('butterfly'));
  assert.ok(ids.includes('split'));
  assert.ok(ids.includes('loop'));
  assert.ok(ids.includes('film_noir'));
});
