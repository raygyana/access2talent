import {ControlValueAccessor} from '@angular/forms';

export abstract class ValueAccessorBase<T> implements ControlValueAccessor {
    protected innerValue: T;

    private changed = new Array<(value: T) => void>();
    private touched = new Array<() => void>();

    get value(): T {
        // console.log('ValueAccessorBase', 'getValue called');
        return this.innerValue;
    }

    set value(value: T) {
        // console.log('ValueAccessorBase', 'setValue called', value, ':this.innerValue:', this.innerValue);
        if (this.innerValue !== value) {
            this.innerValue = value;
            this.changed.forEach(f => f(value));
        }
    }

    writeValue(value: T) {
        // console.log('ValueAccessorBase', 'writeValue called', value);
        this.value = value;
    }

    registerOnChange(fn: (value: T) => void) {
        this.changed.push(fn);
    }

    registerOnTouched(fn: () => void) {
        this.touched.push(fn);
    }

    touch() {
        this.touched.forEach(f => f());
    }
}
