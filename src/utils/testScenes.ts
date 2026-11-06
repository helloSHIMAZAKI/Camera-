/**
 * Procedural Realistic Studio Test Scenes for Live Camera Simulation
 * Renders rich photography scenes onto a canvas so all camera profiles,
 * focus peaking, zebra highlights, and film grain work seamlessly.
 */

export interface TestScene {
  id: string;
  name: string;
  description: string;
  lightingType: string;
  focalSubject: string;
}

export const TEST_SCENES: TestScene[] = [
  {
    id: 'studio_portrait',
    name: 'Studio Portrait (Rembrandt)',
    description: 'Fashion portrait model with Rembrandt 45° key light and cheek triangle',
    lightingType: 'Rembrandt 3:1 Key/Fill',
    focalSubject: 'Model Face & Eyes'
  },
  {
    id: 'tokyo_neon',
    name: 'Tokyo Nocturne (CineStill)',
    description: 'Rain-slicked neon street with glowing lanterns and deep tungsten shadows',
    lightingType: 'Ambient Neon & Tungsten',
    focalSubject: 'Street Signage & Reflections'
  },
  {
    id: 'architectural',
    name: 'Bauhaus Architectural Still Life',
    description: 'Minimalist concrete curves, terracotta vase, and harsh angular sunlight',
    lightingType: 'Hard Sunlight & Deep Shadows',
    focalSubject: 'Geometric Curves & Texture'
  },
  {
    id: 'golden_hour',
    name: 'Coastal Golden Hour (Velvia)',
    description: 'Vivid sunset over ocean cliffs with warm golden backlight and cobalt water',
    lightingType: 'Direct Sun & Skylight',
    focalSubject: 'Sun Silhouette & Horizon'
  }
];

export function renderTestSceneToCanvas(ctx: CanvasRenderingContext2D, width: number, height: number, sceneId: string, timeSec: number) {
  ctx.save();

  if (sceneId === 'studio_portrait') {
    // Rich Studio Portrait with Rembrandt Lighting
    // Background gradient: neutral studio muslin backdrop
    const bgGrad = ctx.createRadialGradient(width * 0.45, height * 0.45, width * 0.1, width * 0.5, height * 0.5, width * 0.7);
    bgGrad.addColorStop(0, '#2d3748');
    bgGrad.addColorStop(0.6, '#1a202c');
    bgGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Warm Key Light Cast (Rembrandt 45° upper left)
    const keyWash = ctx.createRadialGradient(width * 0.35, height * 0.3, 20, width * 0.4, height * 0.4, width * 0.6);
    keyWash.addColorStop(0, 'rgba(255, 240, 220, 0.25)');
    keyWash.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = keyWash;
    ctx.fillRect(0, 0, width, height);

    // Model Torso / Shoulders
    ctx.save();
    ctx.translate(width * 0.5, height * 0.85);
    ctx.beginPath();
    ctx.ellipse(0, 0, width * 0.32, height * 0.25, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.restore();

    // Model Neck & Collarbone
    ctx.fillStyle = '#c59b82';
    ctx.fillRect(width * 0.46, height * 0.55, width * 0.08, height * 0.16);

    // Model Head / Face Oval
    const faceX = width * 0.5;
    const faceY = height * 0.42;
    const faceRadiusX = width * 0.13;
    const faceRadiusY = height * 0.19;

    // Face Base Skin Tone
    ctx.beginPath();
    ctx.ellipse(faceX, faceY, faceRadiusX, faceRadiusY, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#d4a373';
    ctx.fill();

    // Rembrandt Key Light on Left Cheek
    const keyCheek = ctx.createRadialGradient(faceX - faceRadiusX * 0.35, faceY - faceRadiusY * 0.2, 5, faceX - faceRadiusX * 0.2, faceY - faceRadiusY * 0.1, faceRadiusX * 0.7);
    keyCheek.addColorStop(0, 'rgba(255, 230, 200, 0.6)');
    keyCheek.addColorStop(0.8, 'rgba(212, 163, 115, 0.0)');
    ctx.fillStyle = keyCheek;
    ctx.beginPath();
    ctx.ellipse(faceX, faceY, faceRadiusX, faceRadiusY, 0, 0, Math.PI * 2);
    ctx.fill();

    // Shadow on Right Side of Face
    const shadowSide = ctx.createLinearGradient(faceX - 10, faceY, faceX + faceRadiusX, faceY);
    shadowSide.addColorStop(0, 'rgba(0, 0, 0, 0)');
    shadowSide.addColorStop(0.7, 'rgba(60, 35, 20, 0.55)');
    shadowSide.addColorStop(1, 'rgba(30, 15, 10, 0.75)');
    ctx.fillStyle = shadowSide;
    ctx.beginPath();
    ctx.ellipse(faceX, faceY, faceRadiusX, faceRadiusY, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rembrandt Triangle of Light on Right Cheek!
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(faceX + faceRadiusX * 0.25, faceY - 5);
    ctx.lineTo(faceX + faceRadiusX * 0.55, faceY + 5);
    ctx.lineTo(faceX + faceRadiusX * 0.35, faceY + 28);
    ctx.closePath();
    const remGrad = ctx.createRadialGradient(faceX + faceRadiusX * 0.38, faceY + 8, 2, faceX + faceRadiusX * 0.38, faceY + 8, 20);
    remGrad.addColorStop(0, 'rgba(255, 228, 196, 0.65)');
    remGrad.addColorStop(1, 'rgba(212, 163, 115, 0)');
    ctx.fillStyle = remGrad;
    ctx.fill();
    ctx.restore();

    // Eyes
    const eyeY = faceY - 12;
    const eyeOffsetX = faceRadiusX * 0.42;
    // Left eye (Key side - Catchlight)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(faceX - eyeOffsetX, eyeY, 14, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3a2312';
    ctx.beginPath();
    ctx.arc(faceX - eyeOffsetX, eyeY, 6, 0, Math.PI * 2);
    ctx.fill();
    // Catchlight star
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(faceX - eyeOffsetX - 2, eyeY - 2, 2, 0, Math.PI * 2);
    ctx.fill();

    // Right eye (Shadow side)
    ctx.fillStyle = '#eeddcc';
    ctx.beginPath();
    ctx.ellipse(faceX + eyeOffsetX, eyeY, 13, 6.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#221108';
    ctx.beginPath();
    ctx.arc(faceX + eyeOffsetX, eyeY, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // Nose bridge and subtle shadow
    ctx.strokeStyle = '#996644';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(faceX - 2, eyeY);
    ctx.lineTo(faceX - 4, faceY + 20);
    ctx.lineTo(faceX + 6, faceY + 24);
    ctx.stroke();

    // Lips
    ctx.fillStyle = '#b85d58';
    ctx.beginPath();
    ctx.ellipse(faceX + 2, faceY + 52, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair with Rim Light
    ctx.fillStyle = '#1c1512';
    ctx.beginPath();
    ctx.arc(faceX, faceY - faceRadiusY * 0.45, faceRadiusX * 1.15, Math.PI * 0.9, Math.PI * 2.1);
    ctx.lineTo(faceX + faceRadiusX * 1.25, faceY + 80);
    ctx.lineTo(faceX - faceRadiusX * 1.25, faceY + 80);
    ctx.closePath();
    ctx.fill();

    // Golden Hair Rim Light on Right
    ctx.strokeStyle = 'rgba(255, 235, 180, 0.7)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(faceX, faceY - faceRadiusY * 0.45, faceRadiusX * 1.16, Math.PI * 1.7, Math.PI * 2.05);
    ctx.stroke();

  } else if (sceneId === 'tokyo_neon') {
    // Tokyo Nocturne (CineStill Neon with Wet Asphalt Reflections)
    ctx.fillStyle = '#080812';
    ctx.fillRect(0, 0, width, height);

    // Skyscraper silhouettes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(width * 0.05, height * 0.15, width * 0.25, height * 0.85);
    ctx.fillRect(width * 0.35, height * 0.08, width * 0.32, height * 0.92);
    ctx.fillRect(width * 0.72, height * 0.22, width * 0.24, height * 0.78);

    // Glowing Neon Signage 1 (Cyan)
    const neonCyanX = width * 0.2;
    const neonCyanY = height * 0.35;
    ctx.save();
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 25;
    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('喫茶 · 東京', neonCyanX, neonCyanY);
    ctx.restore();

    // Glowing Neon Signage 2 (Crimson Red / Orange - CineStill Halation Trigger)
    const neonRedX = width * 0.52;
    const neonRedY = height * 0.25;
    ctx.save();
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 35;
    ctx.fillStyle = '#fb7185';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('新宿 800T', neonRedX, neonRedY);
    ctx.restore();

    // Bright Spot Light (creates halation)
    const spotX = width * 0.78;
    const spotY = height * 0.32;
    const spotGrad = ctx.createRadialGradient(spotX, spotY, 2, spotX, spotY, 45);
    spotGrad.addColorStop(0, '#ffffff');
    spotGrad.addColorStop(0.3, '#ffedd5');
    spotGrad.addColorStop(0.7, '#f97316');
    spotGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = spotGrad;
    ctx.beginPath();
    ctx.arc(spotX, spotY, 45, 0, Math.PI * 2);
    ctx.fill();

    // Wet Asphalt Street Surface Reflections (Bottom Half)
    const streetY = height * 0.65;
    ctx.fillStyle = '#090a0f';
    ctx.fillRect(0, streetY, width, height - streetY);

    // Mirror Neon Puddles on Asphalt
    const puddleCyan = ctx.createLinearGradient(0, streetY, 0, height);
    puddleCyan.addColorStop(0, 'rgba(6, 182, 212, 0.45)');
    puddleCyan.addColorStop(1, 'rgba(6, 182, 212, 0.02)');
    ctx.fillStyle = puddleCyan;
    ctx.fillRect(width * 0.18, streetY, width * 0.18, height - streetY);

    const puddleRed = ctx.createLinearGradient(0, streetY, 0, height);
    puddleRed.addColorStop(0, 'rgba(244, 63, 94, 0.55)');
    puddleRed.addColorStop(1, 'rgba(244, 63, 94, 0.05)');
    ctx.fillStyle = puddleRed;
    ctx.fillRect(width * 0.5, streetY, width * 0.22, height - streetY);

  } else if (sceneId === 'architectural') {
    // Bauhaus Architectural Still Life (Clean Geometry, Shadows)
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, width, height);

    // Harsh Diagonal Sunlight Wall Shadow
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(0, height * 0.2);
    ctx.lineTo(width * 0.7, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, height * 0.7);
    ctx.lineTo(0, height * 0.95);
    ctx.closePath();
    ctx.fill();

    // Pedestal Block
    const pedX = width * 0.28;
    const pedY = height * 0.52;
    const pedW = width * 0.44;
    const pedH = height * 0.4;
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(pedX, pedY, pedW, pedH);

    // Pedestal Side Cast Shadow
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(pedX + pedW, pedY);
    ctx.lineTo(pedX + pedW + width * 0.18, pedY + height * 0.12);
    ctx.lineTo(pedX + pedW + width * 0.18, pedY + pedH);
    ctx.lineTo(pedX + pedW, pedY + pedH);
    ctx.closePath();
    ctx.fill();

    // Terracotta Ceramic Curved Vase
    const vaseX = width * 0.48;
    const vaseY = pedY - height * 0.22;
    const vaseW = width * 0.14;
    const vaseH = height * 0.22;

    const vaseGrad = ctx.createLinearGradient(vaseX, vaseY, vaseX + vaseW, vaseY);
    vaseGrad.addColorStop(0, '#f97316');
    vaseGrad.addColorStop(0.3, '#ea580c');
    vaseGrad.addColorStop(0.8, '#9a3412');
    vaseGrad.addColorStop(1, '#7c2d12');
    ctx.fillStyle = vaseGrad;

    ctx.beginPath();
    ctx.ellipse(vaseX + vaseW / 2, vaseY + vaseH / 2, vaseW / 2, vaseH / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ceramic Neck
    ctx.fillRect(vaseX + vaseW * 0.3, vaseY - 20, vaseW * 0.4, 25);

    // Botanical Monstera leaf shadow across scene
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(width * 0.85, height * 0.1);
    ctx.quadraticCurveTo(width * 0.65, height * 0.35, width * 0.42, height * 0.45);
    ctx.stroke();

  } else {
    // Coastal Golden Hour (Velvia 50 Sunset & Ocean)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.6);
    skyGrad.addColorStop(0, '#1e3a8a'); // deep cobalt top
    skyGrad.addColorStop(0.4, '#ea580c'); // rich orange
    skyGrad.addColorStop(0.75, '#fbbf24'); // golden amber
    skyGrad.addColorStop(1, '#fef08a'); // yellow horizon
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height * 0.6);

    // Blazing Sun Disc
    const sunX = width * 0.52;
    const sunY = height * 0.52;
    const sunGrad = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, 70);
    sunGrad.addColorStop(0, '#ffffff');
    sunGrad.addColorStop(0.2, '#fef08a');
    sunGrad.addColorStop(0.6, '#f97316');
    sunGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 70, 0, Math.PI * 2);
    ctx.fill();

    // Ocean Surface
    const oceanY = height * 0.58;
    const oceanGrad = ctx.createLinearGradient(0, oceanY, 0, height);
    oceanGrad.addColorStop(0, '#0284c7');
    oceanGrad.addColorStop(0.3, '#0369a1');
    oceanGrad.addColorStop(0.7, '#075985');
    oceanGrad.addColorStop(1, '#0c4a6e');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, oceanY, width, height - oceanY);

    // Sun Golden Shimmer on Ocean Water
    const shimmerGrad = ctx.createLinearGradient(sunX - 35, 0, sunX + 35, 0);
    shimmerGrad.addColorStop(0, 'rgba(254, 240, 138, 0)');
    shimmerGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.7)');
    shimmerGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = shimmerGrad;
    ctx.fillRect(sunX - 45, oceanY, 90, height - oceanY);

    // Silhouette Coastal Cliff on Left
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(0, oceanY - 80);
    ctx.lineTo(width * 0.32, oceanY + 40);
    ctx.lineTo(width * 0.22, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
  }

  // Gentle subtle breathing motion simulation
  const breath = Math.sin(timeSec * 1.5) * 2;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
  ctx.fillRect(0, breath, width, height);

  ctx.restore();
}
