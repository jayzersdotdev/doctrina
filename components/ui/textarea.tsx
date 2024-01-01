import * as React from 'react'

import { cx } from '@/lib/cva.config'
import { TextArea, TextAreaProps } from 'react-aria-components'

export interface _TextAreaProps extends Omit<TextAreaProps, 'size'> {
	className?: string
}

const _TextArea = ({ className, ...props }: _TextAreaProps) => {
	return (
		<TextArea
			className={cx(
				'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
				className,
			)}
			{...props}
		/>
	)
}

export { _TextArea as TextArea }
