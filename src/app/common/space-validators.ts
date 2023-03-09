import { FormControl, ValidationErrors } from '@angular/forms';

export class SpaceValidators {
  static notOnlyWhiteSpace(control: FormControl): ValidationErrors {
    if (control.value != null && String(control.value).trim().length === 0) {
      return { notOnlyWhiteSpace: true };
    } else return {};
  }
}
