/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';

export interface ZoomState {
  scale: number;
  originX: number;
  originY: number;
}

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const STEP = 0.4;

export function useZoom() {
  const [scale, setScale] = useState(1);
  const [originX, setOriginX] = useState(0);
  const [originY, setOriginY] = useState(0);

  const clamp = (val: number) => Math.max(MIN_SCALE, Math.min(MAX_SCALE, val));

  const zoomIn = useCallback(() => setScale(s => clamp(s + STEP)), []);
  const zoomOut = useCallback(() => setScale(s => clamp(s - STEP)), []);
  const resetZoom = useCallback(() => { setScale(1); setOriginX(0); setOriginY(0); }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? STEP : -STEP;
    setScale(s => clamp(s + delta));
  }, []);

  return { scale, originX, originY, zoomIn, zoomOut, resetZoom, handleWheel };
}
