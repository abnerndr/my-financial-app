import { InputCardCode, type InputCardCodeProps } from './components/input-card-code';
import { InputCardDetails, type InputCardDetailsProps } from './components/input-card-details';
import { InputCardExpiration, type InputCardExpirationProps } from './components/input-card-expiration';
import { InputCardNumber, type InputCardNumberProps } from './components/input-card-number';
import { InputCopyClipboard, type InputCopyClipboardProps } from './components/input-copy';
import { InputCurrency, type InputCurrencyProps } from './components/input-currency';
import { InputNumberChevron, type InputNumberChevronProps } from './components/input-number-chevron';
import { InputNumberPlus, type InputNumberPlusProps } from './components/input-number-plus';
import { InputOTPSpaced, type InputOTPSpacedProps } from './components/input-otp-spaced';
import { InputPasswordValidation, type InputPasswordValidationProps } from './components/input-password-validation';
import { InputPhone, type InputPhoneProps } from './components/input-phone';
import { InputReadOnly, type InputReadOnlyProps } from './components/input-read-only';
import { InputSimple, type InputSimpleProps } from './components/input-simple';
import { InputTime, type InputTimeProps } from './components/input-time';
import { InputWithInnerTags, type InputWithInnerTagsProps } from './components/input-with-inner-tags';
import { InputWithTags, type InputWithTagsProps } from './components/input-with-tags';

export const TextFieldBase = {
	Simple: InputSimple,
	Currency: InputCurrency,
	Number: {
		Plus: InputNumberPlus,
		Chevron: InputNumberChevron,
	},
	Time: InputTime,
	OTP: InputOTPSpaced,
	Phone: InputPhone,
	Card: {
		Number: InputCardNumber,
		Expiration: InputCardExpiration,
		Code: InputCardCode,
		Detail: InputCardDetails,
	},
	Copy: InputCopyClipboard,
	ReadOnly: InputReadOnly,
	Password: InputPasswordValidation,
	Tags: {
		Simple: InputWithTags,
		Inner: InputWithInnerTags,
	},
};

export type {
	InputCardCodeProps,
	InputCardDetailsProps,
	InputCardExpirationProps,
	InputCardNumberProps,
	InputCopyClipboardProps,
	InputCurrencyProps,
	InputNumberChevronProps,
	InputNumberPlusProps,
	InputOTPSpacedProps,
	InputPasswordValidationProps,
	InputPhoneProps,
	InputReadOnlyProps,
	InputSimpleProps,
	InputTimeProps,
	InputWithInnerTagsProps,
	InputWithTagsProps,
};
