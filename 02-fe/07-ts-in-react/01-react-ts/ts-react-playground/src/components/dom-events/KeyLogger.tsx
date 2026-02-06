import { useEffect, useRef, useState } from 'react';

const KeyLogger = () => {
	const [combo, setCombo] = useState<string>('');
	const [capsOn, setCapsOn] = useState<boolean>(false);
	const pressed = useRef<Set<string>>(new Set());

	const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
	const metaLabel = isMac ? 'Cmd' : 'Win';

	useEffect(() => {
		const normalize = (key: string) => (key.length === 1 ? key.toLowerCase() : key.toLowerCase());

		const isModifier = (raw: string) =>
			raw === 'meta' || raw === 'control' || raw === 'alt' || raw === 'altgraph' || raw === 'shift';

		const formatKey = (raw: string, shiftActive: boolean): string => {
			switch (raw) {
				case ' ':
					return 'Space';
				case 'meta':
					return metaLabel;
				case 'control':
					return 'Ctrl';
				case 'altgraph':
				case 'alt':
					return 'Alt';
				case 'shift':
					return 'Shift';
				default: {
					if (raw.length === 1) {
						const shouldUpper = shiftActive !== capsOn;
						return shouldUpper ? raw.toUpperCase() : raw.toLowerCase();
					}
					return raw;
				}
			}
		};

		const orderKeys = (keys: string[]): string[] => {
			const priority = [metaLabel, 'Ctrl', 'Alt', 'Shift'];
			return keys.sort((a, b) => {
				const ai = priority.indexOf(a);
				const bi = priority.indexOf(b);
				if (ai !== -1 && bi !== -1) return ai - bi;
				if (ai !== -1) return -1;
				if (bi !== -1) return 1;
				return a.localeCompare(b);
			});
		};

		const rebuildCombo = (shiftActive: boolean) => {
			const displayKeys = Array.from(pressed.current).map(raw => formatKey(raw, shiftActive));
			setCombo(displayKeys.length ? orderKeys(displayKeys).join(' + ') : '');
		};

		const handleKeyDown = (e: KeyboardEvent) => {
			e.preventDefault();
			setCapsOn(e.getModifierState('CapsLock'));

			const raw = normalize(e.key);
			if (raw === 'capslock') {
				rebuildCombo(e.shiftKey);
				return;
			}

			pressed.current.add(raw);
			rebuildCombo(e.shiftKey);
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			setCapsOn(e.getModifierState('CapsLock'));

			const raw = normalize(e.key);
			if (raw === 'capslock') {
				rebuildCombo(e.shiftKey);
				return; // CapsLock wasn’t stored
			}

			pressed.current.delete(raw);
			if (raw === 'meta') {
				pressed.current.forEach(k => {
					if (!isModifier(k)) pressed.current.delete(k);
				});
			}
			rebuildCombo(e.shiftKey);
		};

		const handleBlur = () => {
			pressed.current.clear();
			setCombo('');
		};

		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);
		window.addEventListener('blur', handleBlur);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
			window.removeEventListener('blur', handleBlur);
		};
	}, [capsOn, metaLabel]);

	return (
		<div className='flex flex-col items-center justify-center h-full p-6 space-y-4'>
			<div className='border rounded-2xl shadow-lg p-8 min-w-[260px] text-center'>
				<div className='text-sm text-gray-500'>Caps&nbsp;{capsOn ? 'ON' : 'OFF'}</div>
				{combo ? (
					<span className='text-xl font-mono break-words'>{combo}</span>
				) : (
					<span className='text-gray-400'>Press any key…</span>
				)}
			</div>
		</div>
	);
};

export default KeyLogger;
