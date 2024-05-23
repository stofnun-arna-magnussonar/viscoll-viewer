import { useEffect, useState } from 'react'
import ViscollViewer from './viscoll/ViscollViewer';

// Fela info um Lx, Rx eða Lx og láta birtast ef ýtt er á takka

function App() {
	const [langData, setLangData] = useState(null);

	useEffect(() => {
		if (!langData && window.visCollLangFile) {
			fetch(window.visCollLangFile)
				.then(res => res.json())
				.then(json => {
					setLangData(json)
				});
		}
	}, []);

	return (
		<ViscollViewer data={window.visCollData} langData={langData} currentLang={window.visCollLang || 'is'} />
	);
}

export default App;
