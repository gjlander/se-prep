import { type ChangeEventHandler, useState } from 'react';

const fruitMap = {
	apple: {
		emoji: '🍎',
		label: 'Red Apple'
	},
	banana: {
		emoji: '🍌',
		label: 'Yellow Banana'
	},
	cherry: {
		emoji: '🍒',
		label: 'Sweet Cherry'
	},
	orange: {
		emoji: '🍊',
		label: 'Juicy Orange'
	},
	grape: {
		emoji: '🍇',
		label: 'Purple Grapes'
	},
	watermelon: {
		emoji: '🍉',
		label: 'Fresh Watermelon'
	},
	strawberry: {
		emoji: '🍓',
		label: 'Sweet Strawberry'
	},
	pineapple: {
		emoji: '🍍',
		label: 'Tropical Pineapple'
	},
	mango: {
		emoji: '🥭',
		label: 'Ripe Mango'
	},
	lemon: {
		emoji: '🍋',
		label: 'Zesty Lemon'
	},
	kiwi: {
		emoji: '🥝',
		label: 'Green Kiwi'
	},
	peach: {
		emoji: '🍑',
		label: 'Juicy Peach'
	},
	blueberry: {
		emoji: '🫐',
		label: 'Blueberry'
	}
} as const;

type Fruit = keyof typeof fruitMap;

const FruitSelector = () => {
	const [fruit, setFruit] = useState<Fruit>('apple');

	const handleChange: ChangeEventHandler<HTMLSelectElement> = e => {
		setFruit(e.target.value as Fruit);
	};

	const chosenFruit = fruitMap[fruit];

	return (
		<div>
			<label htmlFor='fruit'>Pick a fruit:</label>
			<select id='fruit' value={fruit} onChange={handleChange}>
				{Object.entries(fruitMap).map(([key, value]) => (
					<option key={key} value={key}>
						{value.label}
					</option>
				))}
			</select>
			<div>
				<span role='img' aria-label={chosenFruit.label}>
					{chosenFruit.emoji}
				</span>
				<span>{chosenFruit.label}</span>
			</div>
		</div>
	);
};

export default FruitSelector;
