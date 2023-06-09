import * as ComponentConstructors from '../../components';
import { CLASS_INITIALIZED } from '../../constants/classes';
import { DEFAULTS } from '../../constants/defaults';
import { EVENT_DESTROY, EVENT_MOUNTED, EVENT_READY, EVENT_REFRESH } from '../../constants/events';
import { DATA_ATTRIBUTE } from '../../constants/project';
import { CREATED, DESTROYED, IDLE, STATES } from '../../constants/states';
import { FADE } from '../../constants/types';
import { EventInterface, State } from '../../constructors';
import { Fade, Slide } from '../../transitions';
import { addClass, assert, assign, empty, forOwn, getAttribute, isString, merge, query, slice } from '../../utils';
import { ARIA_LABEL, ARIA_LABELLEDBY } from '../../constants/attributes';
/**
 * The frontend class for the Splide slider.
 *
 * @since 3.0.0
 */
class Splide {
    /**
     * The Splide constructor.
     *
     * @param target  - The selector for the target element, or the element itself.
     * @param options - Optional. An object with options.
     */
    constructor(target, options) {
        /**
         * The EventBusObject object.
         */
        this.event = EventInterface();
        /**
         * The collection of all component objects.
         */
        this.Components = {};
        /**
         * The StateObject object.
         */
        this.state = State(CREATED);
        /**
         * An array with SyncTarget objects for splide instances to sync with.
         */
        this.splides = [];
        /**
         * The current options.
         */
        this._o = {};
        /**
         * The collection of extensions.
         */
        this._E = {};
        const root = isString(target) ? query(document, target) : target;
        assert(root, `${root} is invalid.`);
        this.root = root;
        options = merge({
            label: getAttribute(root, ARIA_LABEL) || '',
            labelledby: getAttribute(root, ARIA_LABELLEDBY) || '',
        }, DEFAULTS, Splide.defaults, options || {});
        try {
            merge(options, JSON.parse(getAttribute(root, DATA_ATTRIBUTE)));
        }
        catch (e) {
            assert(false, 'Invalid JSON');
        }
        this._o = Object.create(merge({}, options));
    }
    /**
     * Initializes the instance.
     *
     * @param Extensions - Optional. An object with extensions.
     * @param Transition - Optional. A Transition component.
     *
     * @return `this`
     */
    mount(Extensions, Transition) {
        const { state, Components } = this;
        assert(state.is([CREATED, DESTROYED]), 'Already mounted!');
        state.set(CREATED);
        this._C = Components;
        this._T = Transition || this._T || (this.is(FADE) ? Fade : Slide);
        this._E = Extensions || this._E;
        const Constructors = assign({}, ComponentConstructors, this._E, { Transition: this._T });
        forOwn(Constructors, (Component, key) => {
            const component = Component(this, Components, this._o);
            Components[key] = component;
            component.setup && component.setup();
        });
        forOwn(Components, component => {
            component.mount && component.mount();
        });
        this.emit(EVENT_MOUNTED);
        addClass(this.root, CLASS_INITIALIZED);
        state.set(IDLE);
        this.emit(EVENT_READY);
        return this;
    }
    /**
     * Syncs the slider with the provided one.
     * This method must be called before the `mount()`.
     *
     * @example
     * ```ts
     * var primary   = new Splide();
     * var secondary = new Splide();
     *
     * primary.sync( secondary );
     * primary.mount();
     * secondary.mount();
     * ```
     *
     * @param splide - A Splide instance to sync with.
     *
     * @return `this`
     */
    sync(splide) {
        this.splides.push({ splide });
        splide.splides.push({ splide: this, isParent: true });
        if (this.state.is(IDLE)) {
            this._C.Sync.remount();
            splide.Components.Sync.remount();
        }
        return this;
    }
    /**
     * Moves the slider with the following control pattern.
     *
     * | Pattern | Description |
     * |---|---|
     * | `i` | Goes to the slide `i` |
     * | `'+${i}'` | Increments the slide index by `i` |
     * | `'-${i}'` | Decrements the slide index by `i` |
     * | `'>'` | Goes to the next page |
     * | `'<'` | Goes to the previous page |
     * | `>${i}` | Goes to the page `i` |
     *
     * In most cases, `'>'` and `'<'` notations are enough to control the slider
     * because they respect `perPage` and `perMove` options.
     *
     * @example
     * ```ts
     * var splide = new Splide();
     *
     * // Goes to the slide 1:
     * splide.go( 1 );
     *
     * // Increments the index:
     * splide.go( '+2' );
     *
     * // Goes to the next page:
     * splide.go( '>' );
     *
     * // Goes to the page 2:
     * splide.go( '>2' );
     * ```
     *
     * @param control - A control pattern.
     *
     * @return `this`
     */
    go(control) {
        this._C.Controller.go(control);
        return this;
    }
    on(events, callback) {
        this.event.on(events, callback);
        return this;
    }
    /**
     * Removes the registered all handlers for the specified event or events.
     * If you want to only remove a particular handler, use namespace to identify it.
     *
     * @example
     * ```ts
     * var splide = new Splide();
     *
     * // Removes all handlers assigned to "move":
     * splide.off( 'move' );
     *
     * // Only removes handlers that belong to the specified namespace:
     * splide.off( 'move.myNamespace' );
     * ```
     *
     * @param events - An event name or names separated by spaces. Use a dot(.) to append a namespace.
     *
     * @return `this`
     */
    off(events) {
        this.event.off(events);
        return this;
    }
    emit(event) {
        // eslint-disable-next-line prefer-rest-params, prefer-spread
        this.event.emit(event, ...slice(arguments, 1));
        return this;
    }
    /**
     * Inserts a slide at the specified position.
     *
     * @example
     * ```ts
     * var splide = new Splide();
     * splide.mount();
     *
     * // Adds the slide by the HTML:
     * splide.add( '<li></li> );
     *
     * // or adds the element:
     * splide.add( document.createElement( 'li' ) );
     * ```
     *
     * @param slides - A slide element, an HTML string that represents a slide, or an array with them.
     * @param index  - Optional. An index to insert a slide at.
     *
     * @return `this`
     */
    add(slides, index) {
        this._C.Slides.add(slides, index);
        return this;
    }
    /**
     * Removes slides that match the matcher
     * that can be an index, an array with indices, a selector, or an iteratee function.
     *
     * @param matcher - An index, an array with indices, a selector string, or an iteratee function.
     */
    remove(matcher) {
        this._C.Slides.remove(matcher);
        return this;
    }
    /**
     * Checks the slider type.
     *
     * @param type - A type to test.
     *
     * @return `true` if the type matches the current one, or otherwise `false`.
     */
    is(type) {
        return this._o.type === type;
    }
    /**
     * Refreshes the slider.
     *
     * @return `this`
     */
    refresh() {
        this.emit(EVENT_REFRESH);
        return this;
    }
    /**
     * Destroys the slider.
     *
     * @param completely - Optional. If `true`, Splide will not remount the slider by breakpoints.
     *
     * @return `this`
     */
    destroy(completely = true) {
        const { event, state } = this;
        if (state.is(CREATED)) {
            // Postpones destruction requested before the slider becomes ready.
            EventInterface(this).on(EVENT_READY, this.destroy.bind(this, completely));
        }
        else {
            forOwn(this._C, component => {
                component.destroy && component.destroy(completely);
            }, true);
            event.emit(EVENT_DESTROY);
            event.destroy();
            completely && empty(this.splides);
            state.set(DESTROYED);
        }
        return this;
    }
    /**
     * Returns options.
     *
     * @return An object with the latest options.
     */
    get options() {
        return this._o;
    }
    /**
     * Merges options to the current options and emits `updated` event.
     *
     * @param options - An object with new options.
     */
    set options(options) {
        this._C.Media.set(options, true, true);
    }
    /**
     * Returns the number of slides without clones.
     *
     * @return The number of slides.
     */
    get length() {
        return this._C.Slides.getLength(true);
    }
    /**
     * Returns the active slide index.
     *
     * @return The active slide index.
     */
    get index() {
        return this._C.Controller.getIndex();
    }
}
/**
 * Changes the default options for all Splide instances.
 */
Splide.defaults = {};
/**
 * The collection of state numbers.
 */
Splide.STATES = STATES;
export { Splide };
//# sourceMappingURL=../../../src/js/core/Splide/Splide.js.map