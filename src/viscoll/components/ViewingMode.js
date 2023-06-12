import React from 'react';
import PaperManager from "./PaperManager";
import ImageViewer from "./ImageViewer";

/** Contains the collation drawing in a canvas element */
export default class ViewingMode extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			paperManager: {},
		};
	}

	componentDidMount() {
		window.addEventListener("resize", this.drawOnCanvas);
		this.setState({
			paperManager: new PaperManager({
				canvasID: 'myCanvas',
				origin: 0,
				spacing: 0.04,
				strokeWidth: 0.015,
				strokeColor: 'rgb(82,108,145)',
				strokeColorActive: 'rgb(78,214,203)',
				strokeColorGroupActive: 'rgb(82,108,145)',
				strokeColorFilter: '#95fff6',
				strokeColorAdded: "#5F95D6",
				groupColor: '#e7e7e7',
				groupColorActive: 'rgb(78,214,203)',
				groupTextColor: "#727272",
				strokeColorTacket: "#4e4e4e",
				handleObjectClick: this.props.handleObjectClick,
				groupIDs: this.props.project.groupIDs,
				leafIDs: this.props.project.leafIDs,
				Groups: this.props.project.Groups,
				Leafs: this.props.project.Leafs,
				Rectos: this.props.project.Rectos,
				Versos: this.props.project.Versos,
				Notes: this.props.project.Notes,
				activeGroups: [],
				activeLeafs: [],
				activeRectos: [],
				activeVersos: [],
				visibleAttributes: this.props.project.project.preferences,
				toggleTacket: this.props.toggleTacket,
				addTacket: this.addTacket,
				viewingMode: true,
			})
		}, ()=>{this.drawOnCanvas();});
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			this.props.project.preferences !== nextProps.project.preferences ||
			this.props.project.Notes!==nextProps.project.Notes ||
			this.state.viewingMode !== nextState.viewingMode ||
			this.props.imageViewerEnabled !== nextProps.imageViewerEnabled
		);
	}

	componentWillUpdate(nextProps, nextState) {
		if (Object.keys(this.state.paperManager).length>0) {
			this.state.paperManager.setProject(nextProps.project);
			this.state.paperManager.setFilter(nextProps.collationManager.filters);
			this.state.paperManager.setVisibility(nextProps.project.preferences);
		}
	}

	componentDidUpdate() {
		this.drawOnCanvas();
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.drawOnCanvas);
	}

	/**
	 * Draw canvas
	 */
	drawOnCanvas = () => {
		// Create leaves through manager
		this.updateCanvasSize();
		this.state.paperManager.draw();
	}
	/**
	 * Update canvas size based on current window size
	 */
	updateCanvasSize = () => {
		// Resize the canvas
		let maxWidth = window.innerWidth-window.innerWidth*0.46;
		if (this.props.imageViewerEnabled) {
			maxWidth = window.innerWidth-window.innerWidth*0.75;
		}
		document.getElementById("myCanvas").width=maxWidth;
		this.state.paperManager.setWidth(maxWidth);
		if (this.props.imageViewerEnabled) {
			this.state.paperManager.setScale(0.06, 0.027);
		} else {
			this.state.paperManager.setScale(0.04, 0.015);
		}
	}
		
	render() {
		let canvasAttr = {
			'data-paper-hidpi': 'off',
			'height': window.innerHeight,
			'width': window.innerWidth,
		};

		window.viewingMode = this;

		let leafID, leaf, recto, verso, isRectoDIY, isVersoDIY, rectoURL, versoURL;
 
		// conditionally render image viewer only if an Image exists for the selected object
		const hasImage = isRectoDIY || isVersoDIY || rectoURL || versoURL;

		return (
		<div className="viewingMode">
				<div style={this.props.imageViewerEnabled && hasImage ? { width: "40%" } : {}}>
				
				<canvas id="myCanvas" {...canvasAttr}></canvas>
			</div>
			{this.props.imageViewerEnabled && hasImage?
				<ImageViewer isRectoDIY={isRectoDIY} isVersoDIY={isVersoDIY} rectoURL={rectoURL} versoURL={versoURL} fixed={true} />
				:""
			}
		</div>
		);
	}
}
