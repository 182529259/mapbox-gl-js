// @flow

import DOM from '../../util/dom';
import type Point from '@mapbox/point-geometry';
import type InertiaOptions from '../handler_inertia';

const LEFT_BUTTON = 0;

export default class MousePanHandler {

    _enabled: boolean;
    _active: boolean;
    _lastPoint: Point;
    _eventButton: number;
    _options: InertiaOptions;

    constructor() {
        this.reset();
    }

    reset() {
        this._active = false;
        delete this._lastPoint;
        delete this._eventButton;
    }

    mousedown(e: MouseEvent, point: Point) {
        if (this._lastPoint) return;

        const eventButton = DOM.mouseButton(e);
        if (eventButton !== LEFT_BUTTON || e.ctrlKey) {
            return;
        }

        this._lastPoint = point;
        this._eventButton = eventButton;
    }

    mousemove(e: MouseEvent, point: Point) {
        if (!this._lastPoint) return;

        this._active = true;

        const panDelta = point.sub(this._lastPoint);
        this._lastPoint = point;

        return {
            around: point,
            panDelta
        };
    }

    mouseup(e: MouseEvent, point: Point) {
        const eventButton = DOM.mouseButton(e);
        if (eventButton !== this._eventButton) return;
        this.reset();
    }

    enable(options?: InertiaOptions) {
        this._enabled = true;
        if (!!options) this._options = options;
    }

    disable() {
        this._enabled = false;
        this.reset();
    }

    isEnabled() {
        return this._enabled;
    }

    isActive() {
        return this._active;
    }
}