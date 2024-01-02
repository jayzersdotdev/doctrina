'use client'

import {
	Text,
	TextField,
	type TextFieldProps,
	type TextProps,
} from 'react-aria-components'

import { cx } from '@/lib/cva.config'

const _TextField = ({ className, ...props }: TextFieldProps) => {
	return <TextField className={cx('w-full', className)} {...props} />
}

const _TextFieldDescription = ({ className, ...props }: TextProps) => {
	return (
		<Text
			elementType="div"
			slot="description"
			className={cx('mt-2 text-sm text-muted-foreground', className)}
			{...props}
		/>
	)
}

const _TextFieldErrorMessage = ({ className, ...props }: TextProps) => {
	return (
		<Text
			elementType="div"
			slot="error-message"
			className={cx('mt-2 text-sm text-destructive', className)}
			{...props}
		/>
	)
}

export {
	_TextField as TextField,
	_TextFieldDescription as TextFieldDescription,
	_TextFieldErrorMessage as TextFieldErrorMessage,
}
