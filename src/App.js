import { Fragment, useState } from 'react'
import _ from 'underscore';

import './viscoll/style.css';

import projectData from './data';


// Fela info um Lx, Rx eða Lx og láta birtast ef ýtt er á takka

function Group(props) {
	const leafHeight = 35;

	const topPadding = 20;
	const bottomPadding = 20;
	const borderWidth = 10;

	let joinedLeafs = [];

	let joinIndent = 0;

	return <div className="viscoll-group">
		<div className="group-title">
			{
				props.data.params.type+' '+props.group
			}
		</div>

		<div className="members" style={{
			height: leafHeight*props.data.memberOrders.length+topPadding+bottomPadding
		}}>
			{
				props.data.memberOrders.map((member, memberIndex) => {
					let leafId = parseInt(member.split('_')[1]);
					let leafObj = props.leafs[leafId];

                    let nextLeafObj = props.leafs[leafId+1];

					let leafTerms = _.filter(props.terms, (term) => term.objects.Leaf.indexOf(leafId) > -1);

					let leafRecto = props.rectos[leafObj.rectoOrder];
					let leafVerso = props.versos[leafObj.versoOrder];

					let rectoTerms = _.filter(props.terms, (term) => term.objects.Recto.indexOf(leafObj.rectoOrder) > -1);
					let versoTerms = _.filter(props.terms, (term) => term.objects.Verso.indexOf(leafObj.versoOrder) > -1);

					let isJoined = leafObj.conjoined_leaf_order > 0;

					if (isJoined && leafObj.conjoined_leaf_order < leafId) {
						isJoined = false;
					}


					if ((isJoined && joinedLeafs.indexOf(leafObj.conjoined_leaf_order) > -1) || leafObj.conjoined_leaf_order < leafId) {
						if (leafObj.conjoined_leaf_order < leafId && leafObj.conjoined_leaf_order !== null) {
							joinIndent -= 1;
						}

						if (joinIndent < 1) {

							joinIndent -= 1;
						}

					}
					else {
						joinIndent += 1;						
					}

					joinIndent = joinIndent < 0 ? 0 : joinIndent;

					let leafStyle = {
						top: leafHeight*memberIndex,
						height: leafHeight,
					};

					let isSewed = false;

					if (props.data.sewing && props.data.sewing.length == 2) {
						console.log('leafId: '+leafId)
						console.log(props.data.sewing[0])
						console.log(leafId >= props.data.sewing[0])
						console.log(leafId >= props.data.sewing[0] && leafId <= props.data.sewing[1])
						console.log('---------')
						if (leafId >= props.data.sewing[0] && leafId <= props.data.sewing[1]) {
							isSewed = true;
						}
					}

					return <Fragment key={memberIndex}>
						<div className={'leaf'+(leafTerms.length > 0 || rectoTerms.length > 0 || versoTerms.length > 0 ? ' hoverable' : '')} style={leafStyle}>
							
							<div className={'line'+(leafObj.params.stub === 'Yes' ? ' stub' : '')+
								(leafObj.params.type == 'Added' ? ' added' : '')+
								(leafObj.params.type == 'Endleaf' ? ' endleaf' : '')
							} style={{
									top: leafHeight/2
								}}>

								{
									(leafObj.params.attached_below == 'Pasted' || leafObj.params.attached_below == 'Tipped') && <div style={{
										left: leafHeight*(joinIndent)
									}} className={'pasted below'+(leafObj.params.attached_above == 'Tipped' ? ' tipped' : '')} />
								}
								{
									(leafTerms.length > 0 || rectoTerms.length > 0 || versoTerms.length > 0) && <>
										<div className="terms-symbol" />
										<div className="terms">
										{
												leafTerms.map((term, termIndex) => <div key={termIndex}>
                                                    {'L'+leafId+': '+term.params.title}
                                                    <br/>
                                                    {/*<small>{term.params.description}</small>*/}
                                                </div>)
											}
											{
												leafTerms.length > 0 && (rectoTerms.length > 0 || versoTerms.length > 0) && 
                                                <br/>
											}
											{
												rectoTerms.map((term, termIndex) => <div key={termIndex}>
                                                    {'Recto: '+term.params.title}
                                                    <br/>
                                                    {/*<small>{term.params.description}</small>*/}
                                                </div>)
											}
											{
												versoTerms.map((term, termIndex) => <div key={termIndex}>
                                                    {'Verso: '+term.params.title}
                                                    <br/>
                                                    {/*<small>{term.params.description}</small>*/}
                                                </div>)
											}
										</div>
									</>
								}
							</div>

							<div className="folio-number">
								{
									'L'+leafId
								}
								<div className="recto-verso">
								{
										leafRecto && <div>{leafObj.params.folio_number}r</div>
									}
									{
										leafVerso && <div>{leafObj.params.folio_number}v</div>
									}
								</div>
							</div>

						</div>

						{
							isJoined && <div className={'join'+(leafObj.params.type == 'Added' ? ' added' : '')+
								(leafObj.params.type == 'Endleaf' ? ' endleaf' : '')
							} 
							style={{
								top: (leafHeight*(memberIndex))+(leafHeight/2)-borderWidth,
								left: leafHeight*(joinIndent-1),
								width: leafHeight,
								height: leafHeight*(leafObj.conjoined_leaf_order-leafId)+(borderWidth*2)
							}}>
								<div className="join-line" style={{
									borderTopLeftRadius: leafHeight,
									borderBottomLeftRadius: leafHeight									
								}} />
								{
									isSewed && <div className="sewing" />
								}
							</div>
						}

					</Fragment>
				})
			}

		</div>
	</div>
}

function ViscollViewer(props) {
	return <div className="viscoll">
		<h1>{props.data.project.title}</h1>
		{
			Object.keys(props.data.Groups).map((group, groupIndex) => {
					return <Group key={groupIndex} 
						group={group}
						leafs={props.data.Leafs} 
						terms={props.data.Terms} 
						rectos={props.data.Rectos} 
						versos={props.data.Versos} 
						data={props.data.Groups[group]} />
				})
			}
	</div>
}

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
