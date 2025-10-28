'use client';

import type { Tag } from 'emblor';
import { UserIcon } from 'lucide-react';
import { useState } from 'react';
import type { DateRange, DateValue } from 'react-aria-components';
import { DateFieldBase } from '@/components/common/date-field';
import { TextFieldBase } from '@/components/common/text-field';

const tags = [
	{
		id: '1',
		text: 'Sport',
	},
	{
		id: '2',
		text: 'Coding',
	},
	{
		id: '3',
		text: 'Travel',
	},
];

export default function FieldsPage() {
	const [dateValue, setDateValue] = useState<DateValue | null>(null);
	const [dates, setDates] = useState<DateRange | null>(null);
	console.log(dateValue, 'single');
	console.log(dates, 'range');

	const [exampleTags, setExampleTags] = useState<Tag[]>(tags);
	const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

	return (
		<div className="w-full flex flex-col h-screen justify-center gap-y-10 my-20">
			<div className="w-full flex justify-center flex-row items-center gap-x-4 ">
				<DateFieldBase.Simple onChange={setDateValue} value={dateValue} />
				<DateFieldBase.Range onChange={setDates} value={dates} />
			</div>
			<div className="w-full flex justify-center flex-row items-center gap-x-4 mt-2">
				<TextFieldBase.Simple label="Nome" placeholder="Digite seu nome" leftIcon={UserIcon} />
				<TextFieldBase.Currency currency="BRL" label="Valor" placeholder="Digite um valor" />
			</div>
			<div className="w-full flex justify-center flex-row items-center gap-x-4 mt-2">
				<TextFieldBase.Number.Plus label="Number Plus" defaultValue={1} onChange={(value) => console.log(value)} />
				<TextFieldBase.Number.Chevron
					numberType="decimal"
					label="Number Chevron"
					defaultValue={1}
					onChange={(value) => console.log(value)}
				/>
			</div>
			<div className="w-full flex justify-center flex-row items-center gap-x-4 mt-2">
				<TextFieldBase.Time label="Time" isIcon={false} />
				<TextFieldBase.Time label="Time" isIcon={true} iconPosition="left" />
				<TextFieldBase.Time label="Time" isIcon={true} iconPosition="right" />
			</div>
			<div className="w-full flex justify-center flex-row items-center gap-x-4 mt-2">
				<TextFieldBase.OTP maxLength={4} label="OTP Input" />
			</div>
			<div className="w-full flex justify-center flex-row items-center gap-x-4 mt-2">
				<TextFieldBase.Card.Number id="number" label="Card Number" />
				<TextFieldBase.Card.Expiration id="expiration" label="Card Expiration" />
				<TextFieldBase.Card.Code id="code" label="Card Code" />
				<TextFieldBase.Card.Detail label="Card Details" onGetCardDetails={(value) => console.log(value)} />
			</div>
			<div className="w-full flex justify-center flex-row items-center gap-x-4 mt-14">
				<TextFieldBase.Copy label="Copy clipboard" copyText="example copy" />
				<TextFieldBase.ReadOnly label="Read Only" value="example read only" />
				<TextFieldBase.Password label="Password" />
			</div>
			<div className="w-full flex justify-center flex-row items-center gap-x-4 mb-14">
				<TextFieldBase.Tags.Simple
					label="Tags Input"
					activeTagIndex={activeTagIndex}
					setActiveTagIndex={setActiveTagIndex}
					setTags={setExampleTags}
					tags={exampleTags}
				/>
				<TextFieldBase.Tags.Inner
					label="Tags Input"
					activeTagIndex={activeTagIndex}
					setActiveTagIndex={setActiveTagIndex}
					setTags={setExampleTags}
					tags={exampleTags}
				/>
			</div>
		</div>
	);
}
