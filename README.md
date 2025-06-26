# Viscoll component for React.js

This project includes a component for React.js that displays data from https://viscoll.org/ (a system for modeling and visualizing the physical collation of medieval manuscript codices). The project is set up for embedding it to Handrit.is but can easily adjusted to fit other systems.

Usage:
```
import ViscollViewer from './viscoll/ViscollViewer';

<ViscollViewer
  data={[json data downloaded from Viscoll]}
  langData={langData}
  currentLang={[language key from langData]} />
```

Example data can be found in `src/data.js` and example language data in `public/langData.json`.
