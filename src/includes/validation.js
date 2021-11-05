import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure,
} from 'vee-validate';

import {
  required,
  min,
  max,
  alpha_spaces as alphaSpaces,
  email,
  min_value as minVal,
  max_value as maxVal,
  confirmed,
  not_one_of as excluded,
} from '@vee-validate/rules';

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default {
  install(app) {
    app.component('VeeForm', VeeForm);
    app.component('VeeField', VeeField);
    app.component('ErrorMessage', ErrorMessage);

    defineRule('required', required);
    defineRule('tos', required);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('alpha_spaces', alphaSpaces);
    defineRule('email', email);
    defineRule('min_value', minVal);
    defineRule('max_value', maxVal);
    defineRule('passwords_mismatch', confirmed);
    defineRule('excluded', excluded);
    defineRule('country_excluded', excluded);

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `The field "${capitalize(ctx.field)}" is required`,
          min: `The field "${capitalize(ctx.field)}" is too short`,
          max: `The field "${capitalize(ctx.field)}" is too long`,
          alpha_spaces: `The field "${capitalize(ctx.field)}" may only contain letters and spaces`,
          email: `The field "${capitalize(ctx.field)}" must be a valid email`,
          min_value: `The field "${capitalize(ctx.field)}" is too low`,
          max_value: `The field "${capitalize(ctx.field)}" is too high`,
          excluded: `You are not allowed to use this value for the field "${capitalize(ctx.field)}"`,
          country_excluded: 'Due to restrictions, we don\'t accept users from this location',
          passwords_mismatch: 'The passwords don\'t match',
          tos: 'You must accept the Terms of Service',
        };

        return messages[ctx.rule.name] ? messages[ctx.rule.name] : `The field "${capitalize(ctx.field)}" in invalid`;
      },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true,
    });
  },
};
