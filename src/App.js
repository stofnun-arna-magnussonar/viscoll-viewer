import { useState } from 'react'
import ViscollViewer from './viscoll/ViscollViewer';
import projectData from './data';

// Fela info um Lx, Rx eða Lx og láta birtast ef ýtt er á takka

function App() {
    const [projectDataIndex, setProjectDataIndex] = useState(0);

    return (
		<div className="App">

            <div style={{
                marginBottom: 20,
                borderBottom: '1px solid #ccc',
                padding: 20
            }}>
                {
                    projectData.map((item, index) => <button key={index} onClick={() => setProjectDataIndex(index)}>{item.project.title}</button>)
                }
            </div>

			<ViscollViewer data={projectData[projectDataIndex]} />

		</div>
	);
}

export default App;
