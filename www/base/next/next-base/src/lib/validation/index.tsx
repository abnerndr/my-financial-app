export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const validators = {
	email: (value: string) => {
		if (!value) return 'Email is required';
		if (!emailRegex.test(value)) return 'Invalid email format';
		return true;
	},

	password: (value: string) => {
		if (!value) return 'Password is required';
		if (value.length < 6) return 'Password must be at least 6 characters';
		return true;
	},

	strongPassword: (value: string) => {
		if (!value) return 'Password is required';
		if (!passwordRegex.test(value)) {
			return 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character';
		}
		return true;
	},

	confirmPassword: (value: string, password: string) => {
		if (!value) return 'Please confirm your password';
		if (value !== password) return 'Passwords do not match';
		return true;
	},

	required: (value: string) => {
		if (!value || (typeof value === 'string' && !value.trim())) {
			return 'This field is required';
		}
		return true;
	},
};
